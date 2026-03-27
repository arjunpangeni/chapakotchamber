import { getDatabase } from '@/lib/mongodb'
import { CommitteeMemberSchema } from '@/lib/models'
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

    const member = await db.collection('committee-members').findOne({
      _id: new ObjectId(id),
    })

    if (!member) {
      return NextResponse.json({ error: 'Committee member not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...member,
      _id: member._id?.toString(),
    })
  } catch (error) {
    console.error('Error fetching committee member:', error)
    return NextResponse.json({ error: 'Failed to fetch committee member' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const validated = CommitteeMemberSchema.partial().parse(body)

    // Ensure immutable fields are not included in $set
    const { _id, ...updateData } = validated

    const db = await getDatabase()
    const result = await db.collection('committee-members').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date().toISOString(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Committee member not found' }, { status: 404 })
    }

    revalidateTag(CACHE_TAGS.committee)

    return NextResponse.json({ message: 'Committee member updated successfully' })
  } catch (error: any) {
    console.error('Error updating committee member:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update committee member' },
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

    const result = await db.collection('committee-members').deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Committee member not found' }, { status: 404 })
    }

    revalidateTag(CACHE_TAGS.committee)

    return NextResponse.json({ message: 'Committee member deleted successfully' })
  } catch (error) {
    console.error('Error deleting committee member:', error)
    return NextResponse.json({ error: 'Failed to delete committee member' }, { status: 500 })
  }
}