import GalleryClient from './gallery-client'
import { auth } from '@/auth'
import { getActiveJobsCount, getGalleryPage } from '@/lib/server-data'

export const revalidate = 3600

type SearchParams = {
  page?: string
  category?: string
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page || '1') || 1)
  const category = (params.category || '').trim()

  const [data, session, activeJobsCount] = await Promise.all([
    getGalleryPage({ page, category }),
    auth(),
    getActiveJobsCount(),
  ])

  return (
    <GalleryClient
      initialPage={page}
      initialCategory={category}
      fallbackData={data}
      session={session}
      activeJobsCount={activeJobsCount}
    />
  )
}
