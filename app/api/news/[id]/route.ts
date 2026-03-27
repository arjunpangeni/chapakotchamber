import { getDatabase } from '@/lib/mongodb'
import { NewsSchema } from '@/lib/models'
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDatabase()

    const newsItem = await db.collection('news').findOne({
      _id: new ObjectId(id),
    })

    if (!newsItem) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...newsItem,
      _id: newsItem._id?.toString(),
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validated = NewsSchema.partial().parse(body)

    // Ensure immutable fields are not included in $set
    const { _id, ...updateData } = validated

    const db = await getDatabase()
    const result = await db.collection('news').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date().toISOString(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'News updated successfully' })
  } catch (error: any) {
    console.error('Error updating news:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update news' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDatabase()

    const result = await db.collection('news').deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'News not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'News deleted successfully' })
  } catch (error) {
    console.error('Error deleting news:', error)
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 })
  }
}
