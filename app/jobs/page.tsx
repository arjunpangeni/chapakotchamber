import JobsClient from './jobs-client'
import { getActiveJobsCount, getJobsPage, getMembersAll } from '@/lib/server-data'

export const revalidate = 60

type SearchParams = {
  page?: string
  search?: string
  jobType?: string
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page || '1') || 1)
  const search = (params.search || '').trim()
  const jobType = (params.jobType || 'all').trim() || 'all'

  const [jobsData, membersAll, activeJobsCount] = await Promise.all([
    getJobsPage({ page, search, jobType: jobType === 'all' ? '' : jobType }),
    getMembersAll(),
    getActiveJobsCount(),
  ])

  return (
    <JobsClient
      initialPage={page}
      initialSearch={search}
      initialJobType={jobType}
      fallbackData={jobsData}
      membersAll={membersAll}
      activeJobsCount={activeJobsCount}
    />
  )
}
