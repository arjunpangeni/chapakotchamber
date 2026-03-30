import { getDatabase } from '@/lib/mongodb'
import { JobSchema } from '@/lib/models'
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

    const job = await db.collection('jobs').findOne({
      _id: new ObjectId(id),
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...job,
      _id: job._id?.toString(),
    })
  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Default salary to 'Negotiable' if not provided
    const jobData = {
      ...body,
      salary: body.salary?.trim() || 'Negotiable',
    }
    
    const validated = JobSchema.partial().parse(jobData)

    // Ensure immutable fields are not included in $set
    const { _id, ...updateData } = validated

    const db = await getDatabase()
    const result = await db.collection('jobs').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date().toISOString(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    revalidateTag(CACHE_TAGS.jobs, 'max')

    return NextResponse.json({ message: 'Job updated successfully' })
  } catch (error: any) {
    console.error('Error updating job:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update job' },
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

    const result = await db.collection('jobs').deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    revalidateTag(CACHE_TAGS.jobs, 'max')

    return NextResponse.json({ message: 'Job deleted successfully' })
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 })
  }
}

