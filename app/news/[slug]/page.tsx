import { auth } from '@/auth'
import { getActiveJobsCount, getContentBySlug } from '@/lib/server-data'
import NewsDetailClient from './news-detail-client'

export const revalidate = 3600

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [content, session, activeJobsCount] = await Promise.all([
    getContentBySlug(slug),
    auth(),
    getActiveJobsCount(),
  ])

  return (
    <NewsDetailClient
      initialContent={content}
      session={session}
      activeJobsCount={activeJobsCount}
    />
  )
}
