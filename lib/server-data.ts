import { unstable_cache } from 'next/cache'
import { getDatabase } from '@/lib/mongodb'
import { CACHE_TAGS } from '@/lib/cache-tags'
import { recordQueryExecution, getPerformanceSummary } from '@/lib/performance-monitor'

const REVALIDATE_SECONDS = 3600

// Performance thresholds (in milliseconds)
const PERFORMANCE_THRESHOLDS = {
  statistics: 500, // Alert if stats queries take > 500ms
  contents: 300,   // Alert if content queries take > 300ms
  members: 300,    // Alert if member queries take > 300ms
}

const MEMBERS_PER_PAGE = 15
const JOBS_PER_PAGE = 20
const CONTENTS_PER_PAGE = 15
const GALLERY_PER_PAGE = 20

const toId = <T extends { _id?: any }>(doc: T) => ({
  ...doc,
  _id: doc._id?.toString?.() || doc._id,
})

export async function getMembersPage(params: {
  page: number
  search: string
  businessType: string
  ward: string
}) {
  const { page, search, businessType, ward } = params

  return unstable_cache(
    async () => {
      const db = await getDatabase()
      const filter: any = {}

      if (search) {
        filter.$or = [
          { businessName: { $regex: search, $options: 'i' } },
          { ownerName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ]
      }

      if (businessType) filter.businessType = businessType
      if (ward) filter.ward = ward

      const skip = (page - 1) * MEMBERS_PER_PAGE
      const [members, total] = await Promise.all([
        db
          .collection('members')
          .find(filter)
          .sort({ businessName: 1 })
          .skip(skip)
          .limit(MEMBERS_PER_PAGE)
          .toArray(),
        db.collection('members').countDocuments(filter),
      ])

      return {
        members: members.map((m) => ({
          ...toId(m),
          membershipStatus: m.membershipStatus || 'active',
        })),
        total,
        page,
        pages: Math.ceil(total / MEMBERS_PER_PAGE),
      }
    },
    [CACHE_TAGS.members, String(page), search, businessType, ward],
    { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.members] }
  )()
}

export async function getMembersAll() {
  return unstable_cache(
    async () => {
      const db = await getDatabase()
      const members = await db.collection('members').find({}).sort({ businessName: 1 }).toArray()

      return {
        members: members.map((m) => ({
          ...toId(m),
          membershipStatus: m.membershipStatus || 'active',
        })),
      }
    },
    [CACHE_TAGS.members, 'all'],
    { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.members] }
  )()
}

export async function getJobsPage(params: { page: number; search: string; jobType: string }) {
  const { page, search, jobType } = params

  return unstable_cache(
    async () => {
      const db = await getDatabase()
      const filter: any = { status: 'active' }

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { company: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ]
      }

      if (jobType) filter.jobType = jobType

      const skip = (page - 1) * JOBS_PER_PAGE
      const [jobs, total] = await Promise.all([
        db
          .collection('jobs')
          .find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(JOBS_PER_PAGE)
          .toArray(),
        db.collection('jobs').countDocuments(filter),
      ])

      return {
        jobs: jobs.map((job) => toId(job)),
        total,
        page,
        pages: Math.ceil(total / JOBS_PER_PAGE),
      }
    },
    [CACHE_TAGS.jobs, String(page), search, jobType],
    { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.jobs] }
  )()
}

export async function getActiveJobsCount() {
  return unstable_cache(
    async () => {
      const db = await getDatabase()
      return db.collection('jobs').countDocuments({ status: 'active' })
    },
    [CACHE_TAGS.jobs, 'count'],
    { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.jobs] }
  )()
}

export async function getContentsPage(params: { page: number; type: string; search: string }) {
  const { page, type, search } = params

  return unstable_cache(
    async () => {
      const db = await getDatabase()
      const filter: any = { published: true, type: { $ne: 'roadblocker' } }

      const now = new Date().toISOString()
      filter.$or = [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gt: now } }]

      if (type && type !== 'all') {
        filter.type = type
      }

      if (search) {
        filter.$or = filter.$or || []
        filter.$or.push(
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        )
      }

      const skip = (page - 1) * CONTENTS_PER_PAGE
      const [contents, total] = await Promise.all([
        db
          .collection('contents')
          .find(filter)
          .sort({ isPinned: -1, createdAt: -1 })
          .skip(skip)
          .limit(CONTENTS_PER_PAGE)
          .toArray(),
        db.collection('contents').countDocuments(filter),
      ])

      return {
        contents: contents.map((c) => toId(c)),
        total,
        page,
        pages: Math.ceil(total / CONTENTS_PER_PAGE),
      }
    },
    [CACHE_TAGS.contents, String(page), type, search],
    { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.contents] }
  )()
}

export async function getContentBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const db = await getDatabase()
      const content = await db.collection('contents').findOne({
        slug,
        published: true,
        type: { $ne: 'roadblocker' },
      })

      return content ? toId(content) : null
    },
    [CACHE_TAGS.contents, 'slug', slug],
    { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.contents] }
  )()
}

export async function getGalleryPage(params: { page: number; category: string; search: string }) {
  const { page, category, search } = params

  return unstable_cache(
    async () => {
      const db = await getDatabase()
      const filter: any = {}
      if (category) filter.category = category
      if (search) {
        filter.$or = [
          { eventName: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ]
      }

      const skip = (page - 1) * GALLERY_PER_PAGE
      const [albums, total] = await Promise.all([
        db
          .collection('gallery-albums')
          .find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(GALLERY_PER_PAGE)
          .toArray(),
        db.collection('gallery-albums').countDocuments(filter),
      ])

      return {
        albums: albums.map((album) => ({
          ...toId(album),
          coverImage: album.images?.[0]?.url || null,
          imageCount: album.images?.length || 0,
        })),
        total,
        page,
        pages: Math.ceil(total / GALLERY_PER_PAGE),
      }
    },
    [CACHE_TAGS.gallery, String(page), category, search],
    { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.gallery] }
  )()
}

export async function getGalleryBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const db = await getDatabase()
      const album = await db.collection('gallery-albums').findOne({ eventSlug: slug })
      return album ? toId(album) : null
    },
    [CACHE_TAGS.gallery, 'slug', slug],
    { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.gallery] }
  )()
}

export async function getCommitteeMembers(type: 'current' | 'past' | 'all' = 'all') {
  return unstable_cache(
    async () => {
      const db = await getDatabase()
      const filter: any = {}
      if (type !== 'all') filter.type = type

      const members = await db.collection('committee-members').find(filter).sort({ priority: 1, createdAt: -1 }).toArray()

      return {
        members: members.map((m) => toId(m)),
      }
    },
    [CACHE_TAGS.committee, type],
    { revalidate: 86400, tags: [CACHE_TAGS.committee] } // revalidate daily since not changing regularly
  )()
}

// Optimized home page content query - avoids counting all documents
export async function getHomePageContent() {
  return unstable_cache(
    async () => {
      const db = await getDatabase()
      const baseFilter = { published: true, type: { $ne: 'roadblocker' } }
      const now = new Date().toISOString()
      const filter = {
        ...baseFilter,
        $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gt: now } }]
      }

      // Start monitoring overall statistics query time
      const statsStartTime = Date.now()

      // Fetch all content types in parallel without counting (faster for home page)
      const [notices, news, articles, membersCount, jobsCount, newsCount, articleCount] = await Promise.all([
        db
          .collection('contents')
          .find({ ...filter, type: 'notice' })
          .sort({ isPinned: -1, createdAt: -1 })
          .limit(4)
          .toArray(),
        db
          .collection('contents')
          .find({ ...filter, type: 'news' })
          .sort({ isPinned: -1, createdAt: -1 })
          .limit(6)
          .toArray(),
        db
          .collection('contents')
          .find({ ...filter, type: 'article' })
          .sort({ isPinned: -1, createdAt: -1 })
          .limit(6)
          .toArray(),
        db.collection('members').countDocuments({ membershipStatus: { $ne: 'inactive' } }),
        db.collection('jobs').countDocuments({ status: 'active' }),
        db.collection('contents').countDocuments({ ...filter, type: 'news' }),
        db.collection('contents').countDocuments({ ...filter, type: 'article' }),
      ])

      const statsExecutionTime = Date.now() - statsStartTime
      recordQueryExecution('getHomePageContent', statsExecutionTime, PERFORMANCE_THRESHOLDS.statistics)

      // Log individual stat collection times
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔍 Stats Query Performance: ${statsExecutionTime}ms`)
        console.log(getPerformanceSummary())
      }

      return {
        notices: notices.map((c) => toId(c)),
        news: news.map((c) => toId(c)),
        articles: articles.map((c) => toId(c)),
        stats: {
          members: membersCount,
          jobs: jobsCount,
          newsCount: newsCount,
          articleCount: articleCount,
        }
      }
    },
    [CACHE_TAGS.contents, 'home'],
    { revalidate: REVALIDATE_SECONDS, tags: [CACHE_TAGS.contents] }
  )()
}

export const publicDataRevalidate = REVALIDATE_SECONDS
