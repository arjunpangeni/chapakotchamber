import { getDatabase } from '@/lib/mongodb'
import { GalleryAlbumSchema } from '@/lib/models'
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'

const ITEMS_PER_PAGE = 20

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const category = searchParams.get('category') || ''
    const eventSlug = searchParams.get('slug') || ''

    const db = await getDatabase()
    const filter: any = {}

    if (category) filter.category = category
    if (eventSlug) filter.eventSlug = eventSlug

    if (eventSlug) {
      const album = await db
        .collection('gallery-albums')
        .findOne({ eventSlug })

      if (!album) {
        return NextResponse.json({ error: 'Album not found' }, { status: 404 })
      }

      return NextResponse.json({
        album: {
          ...album,
          _id: album._id?.toString(),
        },
      })
    }

    const skip = (page - 1) * ITEMS_PER_PAGE

    const [albums, total] = await Promise.all([
      db
        .collection('gallery-albums')
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(ITEMS_PER_PAGE)
        .toArray(),
      db.collection('gallery-albums').countDocuments(filter),
    ])

    return NextResponse.json({
      albums: albums.map((a) => ({
        ...a,
        _id: a._id?.toString(),
        coverImage: a.images?.[0]?.url || null,
        imageCount: a.images?.length || 0,
      })),
      total,
      page,
      pages: Math.ceil(total / ITEMS_PER_PAGE),
    })
  } catch (error) {
    console.error('Error fetching gallery albums:', error)
    return NextResponse.json({ error: 'Failed to fetch gallery albums' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const normalized = {
      ...body,
      eventSlug: (body.eventSlug || body.eventName || '')
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-'),
      images: body.images || [],
    }

    const validated = GalleryAlbumSchema.parse(normalized)

    const db = await getDatabase()

    const existing = await db.collection('gallery-albums').findOne({ eventSlug: validated.eventSlug })

    if (existing) {
      const result = await db.collection('gallery-albums').updateOne(
        { _id: existing._id },
        {
          $set: {
            ...validated,
            updatedAt: new Date().toISOString(),
          },
        }
      )

      revalidateTag(CACHE_TAGS.gallery, 'max')

      return NextResponse.json({ message: 'Gallery album updated', updatedCount: result.modifiedCount })
    }

    const result = await db.collection('gallery-albums').insertOne({
      ...validated,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    revalidateTag(CACHE_TAGS.gallery, 'max')

    return NextResponse.json(
      { _id: result.insertedId.toString(), ...validated },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating/updating gallery album:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create or update gallery album' },
      { status: 400 }
    )
  }
}

