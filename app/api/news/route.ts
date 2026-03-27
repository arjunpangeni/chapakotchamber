import { getDatabase } from '@/lib/mongodb'
import { NewsSchema } from '@/lib/models'
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'

const ITEMS_PER_PAGE = 20

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''

    const db = await getDatabase()
    const filter: any = { published: true }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (page - 1) * ITEMS_PER_PAGE

    const [news, total] = await Promise.all([
      db
        .collection('news')
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(ITEMS_PER_PAGE)
        .toArray(),
      db.collection('news').countDocuments(filter),
    ])

    return NextResponse.json({
      news: news.map((n) => ({
        ...n,
        _id: n._id?.toString(),
      })),
      total,
      page,
      pages: Math.ceil(total / ITEMS_PER_PAGE),
    })
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = NewsSchema.parse(body)

    const db = await getDatabase()
    const result = await db.collection('news').insertOne({
      ...validated,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json(
      { _id: result.insertedId.toString(), ...validated },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating news:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create news' },
      { status: 400 }
    )
  }
}
