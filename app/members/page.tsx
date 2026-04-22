import MembersClient from './members-client'
import { getActiveJobsCount, getMembersPage } from '@/lib/server-data'

export const revalidate = 60

type SearchParams = {
  page?: string
  search?: string
  businessType?: string
  ward?: string
}

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page || '1') || 1)
  const search = (params.search || '').trim()
  const businessType = (params.businessType || 'all').trim() || 'all'
  const ward = (params.ward || 'all').trim() || 'all'

  const [data, activeJobsCount] = await Promise.all([
    getMembersPage({
      page,
      search,
      businessType: businessType === 'all' ? '' : businessType,
      ward: ward === 'all' ? '' : ward,
    }),
    getActiveJobsCount(),
  ])

  return (
    <MembersClient
      initialPage={page}
      initialSearch={search}
      initialBusinessType={businessType}
      initialWard={ward}
      fallbackData={data}
      activeJobsCount={activeJobsCount}
    />
  )
}
