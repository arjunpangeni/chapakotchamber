'use client'

import { useMemo, useState } from 'react'
import { useJobsWithFallback } from '@/hooks/useApi'
import NavigationClient from '@/components/public/navigation-client'
import Footer from '@/components/public/footer'
import PageIntro from '@/components/public/page-intro'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Briefcase, MapPin, Mail, Phone, Search, SlidersHorizontal } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

export default function JobsClient({
  initialPage = 1,
  initialSearch = '',
  initialJobType = 'all',
  fallbackData,
  membersAll,
  session,
  activeJobsCount = 0,
}: {
  initialPage?: number
  initialSearch?: string
  initialJobType?: string
  fallbackData?: any
  membersAll?: any
  session?: any
  activeJobsCount?: number
}) {
  const [page, setPage] = useState(initialPage)
  const [search, setSearch] = useState(initialSearch)
  const [jobType, setJobType] = useState(initialJobType)
  const [sortBy, setSortBy] = useState<'newest' | 'deadline'>('newest')
  
  // Debounce search input for API calls (300ms delay)
  const debouncedSearch = useDebounce(search, 300)
  
  const { data, isLoading } = useJobsWithFallback(page, debouncedSearch, jobType, fallbackData)

  const memberByName = useMemo(() => {
    const map = new Map()
    for (const m of membersAll?.members || []) {
      map.set(m.businessName, m)
    }
    return map
  }, [membersAll])

  const jobs = useMemo(() => {
    const list = [...(data?.jobs || [])]
    if (sortBy === 'deadline') {
      return list.sort((a: any, b: any) => +new Date(a.deadline) - +new Date(b.deadline))
    }
    return list.sort((a: any, b: any) => +new Date(b.createdAt) - +new Date(a.createdAt))
  }, [data?.jobs, sortBy])

  const iconStylesByType: Record<string, { wrap: string; icon: string }> = {
    'full-time': { wrap: 'from-blue-100 to-cyan-100 dark:from-blue-900/60 dark:to-cyan-900/60', icon: 'text-blue-700 dark:text-cyan-300' },
    'part-time': { wrap: 'from-emerald-100 to-green-100 dark:from-emerald-900/60 dark:to-green-900/60', icon: 'text-emerald-700 dark:text-green-300' },
    contract: { wrap: 'from-amber-100 to-orange-100 dark:from-amber-900/60 dark:to-orange-900/60', icon: 'text-amber-700 dark:text-orange-300' },
    temporary: { wrap: 'from-violet-100 to-fuchsia-100 dark:from-violet-900/60 dark:to-fuchsia-900/60', icon: 'text-violet-700 dark:text-fuchsia-300' },
  }

  const handleReset = () => {
    setSearch('')
    setJobType('all')
    setPage(1)
  }

  return (
    <div className="min-h-screen public-sky">
      <NavigationClient session={session ?? null} activeJobsCount={activeJobsCount} />

      <main className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16 space-y-8 sm:space-y-10">
        <PageIntro
          title="Job Listings"
          subtitle={`Discover ${data?.total || 0} employment opportunities in our community`}
          eyebrow="Careers"
        />

        <Card className="border-primary/10 sky-card">
          <CardContent className="p-3 md:p-4 space-y-3">

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-600/70" />
                <Input
                  placeholder="Search jobs..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  className="h-8 pl-9 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={jobType}
                  onValueChange={(value) => {
                    setJobType(value)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="h-8 w-full sm:w-32 text-sm">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="temporary">Temp</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={(value: 'newest' | 'deadline') => setSortBy(value)}>
                  <SelectTrigger className="h-8 w-full sm:w-28 text-sm">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleReset} variant="outline" size="sm" className="h-8 px-3 border-sky-300 text-sky-700 hover:bg-sky-50 dark:border-sky-700 dark:text-sky-300 dark:hover:bg-sky-950">
                  <SlidersHorizontal className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="border-primary/10 sky-card animate-pulse">
                <CardContent className="p-4 space-y-3">
                  <div className="h-4 w-1/2 bg-sky-200 rounded" />
                  <div className="h-3 w-1/3 bg-sky-100 rounded" />
                  <div className="h-3 w-3/4 bg-sky-100 rounded" />
                  <div className="h-3 w-1/4 bg-sky-100 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data?.jobs?.length > 0 ? (
          <>
            <div className="grid gap-4 md:gap-6 md:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job: any) => (
                <Card
                  key={job._id}
                  className="border-primary/10 sky-card hover:shadow-xl hover:border-primary/20 transition-all duration-300"
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${iconStylesByType[job.jobType]?.wrap || 'from-sky-100 to-blue-100 dark:from-sky-900/60 dark:to-blue-900/60'} flex items-center justify-center flex-shrink-0`}>
                        <Briefcase className={`h-5 w-5 ${iconStylesByType[job.jobType]?.icon || 'text-sky-700 dark:text-sky-300'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 line-clamp-2">{job.title}</h3>
                        <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mt-1 truncate">{job.company}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-300">Deadline: {new Date(job.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-700 dark:text-slate-200 line-clamp-3">{job.description}</p>

                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                        <span className="inline-flex items-center rounded-full bg-sky-100 dark:bg-sky-900/50 px-3 py-1 text-sky-700 dark:text-sky-200">
                          {job.jobType}
                        </span>
                      {job.location && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-slate-700 dark:text-slate-200">
                          <MapPin className="h-3 w-3 text-violet-600 dark:text-violet-300" />
                          {job.location}
                        </span>
                      )}
                      {job.salary && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-slate-700 dark:text-slate-200">
                          <Briefcase className="h-3 w-3 text-amber-600 dark:text-amber-300" />
                          {job.salary}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 border-t border-sky-100 dark:border-slate-700 pt-3">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Contact {memberByName.get(job.company)?.ownerName || job.company} for this job.
                      </p>
                      <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                        {memberByName.get(job.company)?.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-cyan-600 dark:text-cyan-300" /> {memberByName.get(job.company)?.email}
                          </div>
                        )}
                        {memberByName.get(job.company)?.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3 text-emerald-600 dark:text-emerald-300" /> {memberByName.get(job.company)?.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {data?.pages && data.pages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center gap-3 py-8">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  className="rounded-lg w-full sm:w-fit border-sky-200 text-sky-800 hover:bg-white/80"
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center justify-center px-4 text-sm font-medium">
                  Page {page} of {data.pages}
                </span>
                <Button
                  variant="outline"
                  disabled={page === data.pages}
                  className="rounded-lg w-full sm:w-fit border-sky-200 text-sky-800 hover:bg-white/80"
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="border-primary/10 sky-card">
            <CardContent className="text-center py-16 text-foreground/70">
              No jobs found matching your filters.
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  )
}
