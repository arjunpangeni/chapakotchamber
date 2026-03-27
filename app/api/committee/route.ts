import { getDatabase } from '@/lib/mongodb'
import { CommitteeMemberSchema } from '@/lib/models'
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'all'

    const db = await getDatabase()
    const filter: any = {}
    if (type !== 'all') filter.type = type

    const members = await db.collection('committee-members').find(filter).sort({ priority: 1, createdAt: -1 }).toArray()

    return NextResponse.json({
      members: members.map((m) => ({
        ...m,
        _id: m._id?.toString(),
      })),
    })
  } catch (error) {
    console.error('Error fetching committee members:', error)
    return NextResponse.json({ error: 'Failed to fetch committee members' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = CommitteeMemberSchema.parse(body)

    const db = await getDatabase()
    const result = await db.collection('committee-members').insertOne({
      ...validated,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    revalidateTag(CACHE_TAGS.committee)

    return NextResponse.json(
      { _id: result.insertedId.toString(), ...validated },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating committee member:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create committee member' },
      { status: 400 }
    )
  }
}