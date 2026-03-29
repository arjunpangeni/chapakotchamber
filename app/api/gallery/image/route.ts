import { v2 as cloudinary } from 'cloudinary'
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const publicId = body.publicId as string

    if (!publicId) {
      return NextResponse.json({ error: 'publicId is required' }, { status: 400 })
    }

    const result = await cloudinary.uploader.destroy(publicId, { invalidate: true })

    if (result.result !== 'ok' && result.result !== 'not found') {
      return NextResponse.json({ error: 'Cloudinary deletion failed', details: result }, { status: 500 })
    }

    revalidateTag(CACHE_TAGS.gallery, 'max')

    return NextResponse.json({ message: 'Image removed from Cloudinary' })
  } catch (error: any) {
    console.error('Cloudinary image delete error:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete from Cloudinary' }, { status: 500 })
  }
}



