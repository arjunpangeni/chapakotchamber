import { getDatabase } from '@/lib/mongodb'
import { ContentSchema } from '@/lib/models'
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'

const ITEMS_PER_PAGE = 15

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const type = searchParams.get('type') || ''
    const search = searchParams.get('search') || ''
    const slug = searchParams.get('slug') || ''

    const db = await getDatabase()
    const filter: any = { published: true }
    filter.type = { $ne: 'roadblocker' }

    // Auto hide expired notices
    const now = new Date().toISOString()
    filter.$or = [
      { expiresAt: { $exists: false } },
      { expiresAt: null },
      { expiresAt: { $gt: now } },
    ]

    if (type && type !== 'all') {
      filter.type = type
    }

    if (search) {
      filter.$text = { $search: search }
    }

    if (slug) {
      const content = await db.collection('contents').findOne({
        slug,
        published: true,
        type: { $ne: 'roadblocker' },
      })
      if (!content) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 })
      }
      return NextResponse.json({ content: { ...content, _id: content._id.toString() } })
    }

    const skip = (page - 1) * ITEMS_PER_PAGE

    const [contents, total] = await Promise.all([
      db
        .collection('contents')
        .find(filter)
        .sort({ isPinned: -1, createdAt: -1 })
        .skip(skip)
        .limit(ITEMS_PER_PAGE)
        .toArray(),
      db.collection('contents').countDocuments(filter),
    ])

    return NextResponse.json({
      contents: contents.map((c) => ({ ...c, _id: c._id.toString() })),
      total,
      page,
      pages: Math.ceil(total / ITEMS_PER_PAGE),
    })
  } catch (error) {
    console.error('Error fetching contents:', error)
    return NextResponse.json({ error: 'Failed to fetch contents' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const normalized = {
      ...body,
      slug: (body.slug || body.title)
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      isPinned: !!body.isPinned,
      image: body.image || '',
      expiresAt: body.expiresAt || null,
      published: !!body.published,
    }

    const content = ContentSchema.parse(normalized)

    const db = await getDatabase()

    async function getUniqueSlug(slug: string, excludeId?: any): Promise<string> {
      let candidate = slug
      let counter = 1

      while (true) {
        const conflict = await db.collection('contents').findOne({
          slug: candidate,
          ...((excludeId && { _id: { $ne: excludeId } }) || {}),
        })

        if (!conflict) {
          return candidate
        }

        candidate = `${slug}-${counter}`
        counter += 1
      }
    }

    const idToExclude = body._id ? new (require('mongodb').ObjectId)(body._id) : undefined
    const uniqueSlug = await getUniqueSlug(content.slug, idToExclude)
    content.slug = uniqueSlug

    const now = new Date().toISOString()

    if (body._id) {
      const result = await db.collection('contents').updateOne(
        { _id: new (require('mongodb').ObjectId)(body._id) },
        {
          $set: {
            ...content,
            updatedAt: now,
          },
        }
      )

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 })
      }

      revalidateTag(CACHE_TAGS.contents, 'max')

      return NextResponse.json({ message: 'Content updated successfully' })
    }

    const { _id, ...contentData } = content
    const contentToInsert = {
      ...contentData,
      createdAt: now,
      updatedAt: now,
    }

    const insertResult = await db.collection('contents').insertOne(contentToInsert)

    if (!insertResult.insertedId) {
      return NextResponse.json({ error: 'Failed to insert content' }, { status: 500 })
    }

    revalidateTag(CACHE_TAGS.contents, 'max')

    return NextResponse.json(
      {
        _id: insertResult.insertedId.toString(),
        ...contentToInsert,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating content:', error)
    return NextResponse.json({ error: error.message || 'Failed to create content' }, { status: 400 })
  }
}

