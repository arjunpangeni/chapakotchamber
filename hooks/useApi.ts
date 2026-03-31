import useSWR from 'swr'

// Production: 10 minutes of cache without revalidation
// Only refetch when explicitly called via mutate()
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  revalidateIfStale: false, // Don't revalidate just because data is stale
  dedupingInterval: 600_000, // 10 minutes - prevent duplicate requests
  focusThrottleInterval: 300_000, // 5 minutes throttle on focus
  keepPreviousData: true, // Show old data while fetching new
  errorRetryCount: 2, // Retry failed requests twice
  errorRetryInterval: 3000, // Wait 3 seconds between retries
}

// For search queries: more aggressive revalidation (1 minute)
const swrConfigSearch = {
  ...swrConfig,
  dedupingInterval: 60_000, // 1 minute for search queries
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.error || 'Request failed')
  }

  return data
}

export function useMembers(
  page = 1,
  search = '',
  businessType = 'all',
  ward = 'all',
  membershipStatus = 'all'
) {
  const params = new URLSearchParams()
  params.append('page', page.toString())
  if (search) params.append('search', search)
  if (businessType && businessType !== 'all') params.append('businessType', businessType)
  if (ward && ward !== 'all') params.append('ward', ward)
  if (membershipStatus && membershipStatus !== 'all') params.append('membershipStatus', membershipStatus)

  // Use search config if there's an active search filter
  const config = search || businessType !== 'all' || ward !== 'all' ? swrConfigSearch : swrConfig

  const { data, error, isLoading, mutate } = useSWR(
    `/api/members?${params.toString()}`,
    fetcher,
    config
  )

  return { data, error, isLoading, mutate }
}

export function useMembersWithFallback(
  page = 1,
  search = '',
  businessType = 'all',
  ward = 'all',
  membershipStatus = 'all',
  fallbackData?: any
) {
  const params = new URLSearchParams()
  params.append('page', page.toString())
  if (search) params.append('search', search)
  if (businessType && businessType !== 'all') params.append('businessType', businessType)
  if (ward && ward !== 'all') params.append('ward', ward)
  if (membershipStatus && membershipStatus !== 'all') params.append('membershipStatus', membershipStatus)

  // Use search config if there's an active search filter
  const config = search || businessType !== 'all' || ward !== 'all' ? swrConfigSearch : swrConfig

  const { data, error, isLoading, mutate } = useSWR(
    `/api/members?${params.toString()}`,
    fetcher,
    { ...config, fallbackData }
  )

  return { data, error, isLoading, mutate }
}

export function useMembersAll() {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/members?all=true`,
    fetcher,
    swrConfig
  )

  return { data, error, isLoading, mutate }
}

export function useMember(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/members/${id}` : null,
    fetcher,
    swrConfig
  )

  return { data, error, isLoading, mutate }
}

export function useJobs(page = 1, search = '', jobType = 'all', includeExpired = false) {
  const params = new URLSearchParams()
  params.append('page', page.toString())
  if (search) params.append('search', search)
  if (jobType && jobType !== 'all') params.append('jobType', jobType)
  if (includeExpired) params.append('includeExpired', 'true')

  // Use search config if there's an active search filter
  const config = search || jobType !== 'all' ? swrConfigSearch : swrConfig

  const { data, error, isLoading, mutate } = useSWR(
    `/api/jobs?${params.toString()}`,
    fetcher,
    config
  )

  return { data, error, isLoading, mutate }
}

export function useJobsWithFallback(page = 1, search = '', jobType = 'all', fallbackData?: any, includeExpired = false) {
  const params = new URLSearchParams()
  params.append('page', page.toString())
  if (search) params.append('search', search)
  if (jobType && jobType !== 'all') params.append('jobType', jobType)
  if (includeExpired) params.append('includeExpired', 'true')

  // Use search config if there's an active search filter
  const config = search || jobType !== 'all' ? swrConfigSearch : swrConfig

  const { data, error, isLoading, mutate } = useSWR(
    `/api/jobs?${params.toString()}`,
    fetcher,
    { ...config, fallbackData }
  )

  return { data, error, isLoading, mutate }
}

export function useJob(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/jobs/${id}` : null,
    fetcher,
    swrConfig
  )

  return { data, error, isLoading, mutate }
}

export function useContents(page = 1, type = 'all', search = '') {
  const params = new URLSearchParams()
  params.append('page', page.toString())
  if (type) params.append('type', type)
  if (search) params.append('search', search)

  // Use search config if there's an active search filter
  const config = search || type !== 'all' ? swrConfigSearch : swrConfig

  const { data, error, isLoading, mutate } = useSWR(
    `/api/contents?${params.toString()}`,
    fetcher,
    config
  )

  return { data, error, isLoading, mutate }
}

export function useContentsWithFallback(page = 1, type = 'all', search = '', fallbackData?: any) {
  const params = new URLSearchParams()
  params.append('page', page.toString())
  if (type) params.append('type', type)
  if (search) params.append('search', search)

  // Use search config if there's an active search filter
  const config = search || type !== 'all' ? swrConfigSearch : swrConfig

  const { data, error, isLoading, mutate } = useSWR(
    `/api/contents?${params.toString()}`,
    fetcher,
    { ...config, fallbackData }
  )

  return { data, error, isLoading, mutate }
}

export function useContent(slug: string) {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? `/api/contents?slug=${encodeURIComponent(slug)}` : null,
    fetcher,
    swrConfig
  )

  return { data, error, isLoading, mutate }
}

export function useContentWithFallback(slug: string, fallbackData?: any) {
  const { data, error, isLoading, mutate } = useSWR(
    slug ? `/api/contents?slug=${encodeURIComponent(slug)}` : null,
    fetcher,
    { ...swrConfig, fallbackData }
  )

  return { data, error, isLoading, mutate }
}

export function useNews(page = 1, search = '') {
  const params = new URLSearchParams()
  params.append('page', page.toString())
  if (search) params.append('search', search)

  // Use search config if there's an active search filter
  const config = search ? swrConfigSearch : swrConfig

  const { data, error, isLoading, mutate } = useSWR(
    `/api/news?${params.toString()}`,
    fetcher,
    config
  )

  return { data, error, isLoading, mutate }
}

export function useNewsItem(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/news/${id}` : null,
    fetcher,
    swrConfig
  )

  return { data, error, isLoading, mutate }
}

export function useGallery(page = 1, category = '', search = '') {
  const params = new URLSearchParams()
  params.append('page', page.toString())
  if (category) params.append('category', category)
  if (search) params.append('search', search)

  // Use search config if there's an active category filter or search
  const config = category || search ? swrConfigSearch : swrConfig

  const { data, error, isLoading, mutate } = useSWR(
    `/api/gallery?${params.toString()}`,
    fetcher,
    config
  )

  return { data, error, isLoading, mutate }
}

export function useGalleryWithFallback(page = 1, category = '', search = '', fallbackData?: any) {
  const params = new URLSearchParams()
  params.append('page', page.toString())
  if (category) params.append('category', category)
  if (search) params.append('search', search)

  // Use search config if there's an active category filter or search
  const config = category || search ? swrConfigSearch : swrConfig

  const { data, error, isLoading, mutate } = useSWR(
    `/api/gallery?${params.toString()}`,
    fetcher,
    { ...config, fallbackData }
  )

  return { data, error, isLoading, mutate }
}

export function useGalleryItem(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/gallery/${id}` : null,
    fetcher,
    swrConfig
  )

  return { data, error, isLoading, mutate }
}

export function useCommitteeMembers(type = 'all') {
  const params = new URLSearchParams()
  if (type !== 'all') params.append('type', type)

  const { data, error, isLoading, mutate } = useSWR(
    `/api/committee?${params.toString()}`,
    fetcher,
    swrConfig
  )

  return { data, error, isLoading, mutate }
}

export function useCommitteeMember(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/committee/${id}` : null,
    fetcher,
    swrConfig
  )

  return { data, error, isLoading, mutate }
}
