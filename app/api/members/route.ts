import { getDatabase } from '@/lib/mongodb'
import { MemberSchema } from '@/lib/models'
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'

const ITEMS_PER_PAGE = 15

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const returnAll = searchParams.get('all') === 'true'
    const search = searchParams.get('search') || ''
    const businessType = searchParams.get('businessType') || ''
    const ward = searchParams.get('ward') || ''
    const membershipStatus = searchParams.get('membershipStatus') || ''

    const db = await getDatabase()
    const filter: any = {}

    if (search) {
      filter.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { ownerName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    }

    if (membershipStatus === 'active' || membershipStatus === 'inactive') {
      filter.membershipStatus = membershipStatus
    }
    if (businessType) filter.businessType = businessType
    if (ward) filter.ward = ward

    const query = db.collection('members').find(filter).sort({ businessName: 1 })

    if (returnAll) {
      const members = await query.toArray()
      return NextResponse.json({
        members: members.map((m) => ({
          ...m,
          _id: m._id?.toString(),
          membershipStatus: m.membershipStatus || 'active',
        })),
        total: members.length,
        page: 1,
        pages: 1,
      })
    } else {
      const skip = (page - 1) * ITEMS_PER_PAGE
      const [members, total] = await Promise.all([
        query.skip(skip).limit(ITEMS_PER_PAGE).toArray(),
        db.collection('members').countDocuments(filter),
      ])

      return NextResponse.json({
        members: members.map((m) => ({
          ...m,
          _id: m._id?.toString(),
          membershipStatus: m.membershipStatus || 'active',
        })),
        total,
        page,
        pages: Math.ceil(total / ITEMS_PER_PAGE),
      })
    }
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = MemberSchema.parse(body)

    const db = await getDatabase()
    const result = await db.collection('members').insertOne({
      ...validated,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    revalidateTag(CACHE_TAGS.members, 'max')
    revalidateTag(CACHE_TAGS.jobs, 'max')

    return NextResponse.json(
      { _id: result.insertedId.toString(), ...validated },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating member:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create member' },
      { status: 400 }
    )
  }
}

