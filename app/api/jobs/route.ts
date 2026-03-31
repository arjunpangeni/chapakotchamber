import { getDatabase } from '@/lib/mongodb'
import { JobSchema } from '@/lib/models'
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'

const ITEMS_PER_PAGE = 20

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''
    const jobType = searchParams.get('jobType') || ''
    const includeExpired = searchParams.get('includeExpired') === 'true'

    const db = await getDatabase()
    const filter: any = { status: 'active' }

    // Filter out expired jobs unless explicitly requested (for admin)
    if (!includeExpired) {
      const now = new Date().toISOString()
      filter.deadline = { $gte: now }
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    if (jobType) filter.jobType = jobType

    const skip = (page - 1) * ITEMS_PER_PAGE

    const [jobs, total] = await Promise.all([
      db
        .collection('jobs')
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(ITEMS_PER_PAGE)
        .toArray(),
      db.collection('jobs').countDocuments(filter),
    ])

    return NextResponse.json({
      jobs: jobs.map((j) => ({
        ...j,
        _id: j._id?.toString(),
        isExpired: new Date(j.deadline) < new Date(),
      })),
      total,
      page,
      pages: Math.ceil(total / ITEMS_PER_PAGE),
    })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Default salary to 'Negotiable' if not provided
    const jobData = {
      ...body,
      salary: body.salary?.trim() || 'Negotiable',
    }
    
    const validated = JobSchema.parse(jobData)

    const db = await getDatabase()
    const result = await db.collection('jobs').insertOne({
      ...validated,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    revalidateTag(CACHE_TAGS.jobs, 'max')

    return NextResponse.json(
      { _id: result.insertedId.toString(), ...validated },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating job:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create job' },
      { status: 400 }
    )
  }
}

