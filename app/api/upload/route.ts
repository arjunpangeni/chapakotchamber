import { v2 as cloudinary } from 'cloudinary'
import { NextRequest, NextResponse } from 'next/server'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Supported MIME types for images
const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

function sanitizeFolder(input: string | null | undefined) {
  const raw = (input || '').trim()
  if (!raw) return 'chapakot-chamber'

  let normalized = raw.split('\\').join('/')

  while (normalized.includes('//')) {
    normalized = normalized.split('//').join('/')
  }

  normalized = normalized
    .split(' ')
    .filter(Boolean)
    .join(' ')

  while (normalized.startsWith('/')) {
    normalized = normalized.slice(1)
  }

  while (normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1)
  }

  return normalized || 'chapakot-chamber'
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Supported types: JPEG, PNG, WebP, GIF` },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum limit of 50MB` },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const folder = sanitizeFolder(request.nextUrl.searchParams.get('folder'))

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          transformation: [
            { width: 1600, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      uploadStream.end(buffer)
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    )
  }
}
