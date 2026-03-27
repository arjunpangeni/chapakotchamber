import { getDatabase } from '@/lib/mongodb'
import { GalleryAlbumSchema } from '@/lib/models'
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { v2 as cloudinary } from 'cloudinary'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDatabase()

    const album = await db.collection('gallery-albums').findOne({
      _id: new ObjectId(id),
    })

    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...album,
      _id: album._id?.toString(),
    })
  } catch (error) {
    console.error('Error fetching album:', error)
    return NextResponse.json({ error: 'Failed to fetch album' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validated = GalleryAlbumSchema.partial().parse(body)

    const { _id, ...updateData } = validated

    const db = await getDatabase()
    const result = await db.collection('gallery-albums').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date().toISOString(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 })
    }

    revalidateTag(CACHE_TAGS.gallery, 'max')

    return NextResponse.json({ message: 'Album updated successfully' })
  } catch (error: any) {
    console.error('Error updating album:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update album' },
      { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDatabase()

    const album = await db.collection('gallery-albums').findOne({ _id: new ObjectId(id) })
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 })
    }

    const imageIds: string[] = Array.isArray(album.images) ? album.images
      .map((img: any) => img.publicId)
      .filter(Boolean) : []

    await Promise.all(
      imageIds.map((publicId) =>
        cloudinary.uploader.destroy(publicId, { invalidate: true }).catch((err) => {
          console.warn('Cloudinary image delete warning:', publicId, err)
        })
      )
    )

    const result = await db.collection('gallery-albums').deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 })
    }

    revalidateTag(CACHE_TAGS.gallery, 'max')

    return NextResponse.json({ message: 'Album deleted successfully' })
  } catch (error) {
    console.error('Error deleting album:', error)
    return NextResponse.json({ error: 'Failed to delete album' }, { status: 500 })
  }
}

