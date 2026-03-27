import NewsClient from './news-client'
import { auth } from '@/auth'
import { getActiveJobsCount, getContentsPage } from '@/lib/server-data'

export const revalidate = 3600

type SearchParams = {
  page?: string
  type?: 'all' | 'news' | 'notice' | 'article'
  search?: string
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page || '1') || 1)
  const filter = (params.type || 'all') as 'all' | 'news' | 'notice' | 'article'
  const search = (params.search || '').trim()

  const [data, session, activeJobsCount] = await Promise.all([
    getContentsPage({ page, type: filter, search }),
    auth(),
    getActiveJobsCount(),
  ])

  return (
    <NewsClient
      initialPage={page}
      initialFilter={filter}
      initialSearch={search}
      fallbackData={data}
      session={session}
      activeJobsCount={activeJobsCount}
    />
  )
}
