import { getDatabase } from '@/lib/mongodb'
import { ContentBaseSchema } from '@/lib/models'
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDatabase()
    const content = await db.collection('contents').findOne({ _id: new ObjectId(id) })

    if (!content) return NextResponse.json({ error: 'Content not found' }, { status: 404 })

    return NextResponse.json({ ...content, _id: content._id.toString() })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
    const content = ContentBaseSchema.partial().parse(normalized)
    if (content.type === 'article' && !content.authorName?.trim()) {
      return NextResponse.json({ error: 'Author name is required for articles' }, { status: 400 })
    }

    const db = await getDatabase()

    const existingBySlug = await db.collection('contents').findOne({ slug: content.slug, _id: { $ne: new ObjectId(id) } })
    if (existingBySlug) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }

    const result = await db.collection('contents').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...content,
          updatedAt: new Date().toISOString(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    revalidateTag(CACHE_TAGS.contents, 'max')

    return NextResponse.json({ message: 'Content updated successfully' })
  } catch (error: any) {
    console.error('Error updating content:', error)
    return NextResponse.json({ error: error.message || 'Failed to update content' }, { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDatabase()
    const result = await db.collection('contents').deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    revalidateTag(CACHE_TAGS.contents, 'max')

    return NextResponse.json({ message: 'Content deleted successfully' })
  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 })
  }
}

