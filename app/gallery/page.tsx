import GalleryClient from './gallery-client'
import { getActiveJobsCount, getGalleryPage } from '@/lib/server-data'

export const revalidate = 60

type SearchParams = {
  page?: string
  category?: string
  search?: string
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page || '1') || 1)
  const category = (params.category || '').trim()
  const search = (params.search || '').trim()

  const [data, activeJobsCount] = await Promise.all([
    getGalleryPage({ page, category, search }),
    getActiveJobsCount(),
  ])

  return (
    <GalleryClient
      initialPage={page}
      initialCategory={category}
      initialSearch={search}
      fallbackData={data}
      activeJobsCount={activeJobsCount}
    />
  )
}
