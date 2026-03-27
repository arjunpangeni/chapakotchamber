'use client'

import { useState } from 'react'
import { useContentsWithFallback } from '@/hooks/useApi'
import NavigationClient from '@/components/public/navigation-client'
import Footer from '@/components/public/footer'
import PageIntro from '@/components/public/page-intro'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar, Search, SlidersHorizontal, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import cloudinaryLoader from '@/lib/cloudinary-loader'

export default function NewsClient({
  initialPage = 1,
  initialFilter = 'all',
  initialSearch = '',
  fallbackData,
  session,
  activeJobsCount = 0,
}: {
  initialPage?: number
  initialFilter?: 'all' | 'news' | 'notice' | 'article'
  initialSearch?: string
  fallbackData?: any
  session?: any
  activeJobsCount?: number
}) {
  const [page, setPage] = useState(initialPage)
  const [filter, setFilter] = useState<'all' | 'news' | 'notice' | 'article'>(initialFilter)
  const [search, setSearch] = useState(initialSearch)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')
  const { data, isLoading } = useContentsWithFallback(page, filter, search, fallbackData)

  const sortedContents = [...(data?.contents || [])].sort((a: any, b: any) => {
    if (sortBy === 'oldest') return +new Date(a.createdAt) - +new Date(b.createdAt)
    return +new Date(b.createdAt) - +new Date(a.createdAt)
  })

  const labels = [
    { value: 'all', label: 'All' },
    { value: 'news', label: 'News' },
    { value: 'notice', label: 'Notices' },
    { value: 'article', label: 'Articles' },
  ]

  return (
    <div className="min-h-screen bg-[#f4f5f7] dark:bg-slate-950">
      <NavigationClient session={session ?? null} activeJobsCount={activeJobsCount} />

      <main className="news-font max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12 space-y-6 sm:space-y-8">
        <PageIntro
          title="News & Updates"
          subtitle="Stay informed with the latest news from Chapakot Chamber"
          eyebrow="Updates"
        />

        <div className="card-modern sky-card p-3 md:p-4 border-2 border-primary/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">
            <SlidersHorizontal className="h-4 w-4" />
            Filter by Type
          </div>
          <div className="flex overflow-x-auto gap-2 pb-1">
            {labels.map((tab) => (
              <Button
                key={tab.value}
                variant={filter === tab.value ? 'default' : 'outline'}
                size="sm"
                className={`h-7 px-3 text-xs ${filter === tab.value ? 'bg-sky-500 text-white' : 'border-sky-300 text-sky-800 hover:bg-sky-50 dark:border-sky-700 dark:text-sky-200 dark:hover:bg-slate-800'}`}
                onClick={() => { setFilter(tab.value); setPage(1); }}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* News List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading news...</p>
          </div>
        ) : data?.contents?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedContents.map((item: any) => {
                const expired = item.expiresAt && new Date(item.expiresAt) < new Date()
                return (
                  <Link
                    key={item._id}
                    href={`/news/${item.slug}`}
                    className={`group hover:shadow-lg sky-card ${item.type === 'notice' ? 'border border-red-200 dark:border-red-900/60' : 'border border-primary/10 dark:border-slate-800'} transition-shadow rounded-lg overflow-hidden flex flex-col`}
                  >
                    {item.image && (
                      <div className="relative h-64 w-full">
                        <Image
                          src={item.image}
                          loader={cloudinaryLoader}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) calc(100vw - 2rem), (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col bg-[#f6f7f9] dark:bg-slate-900/75">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h2 className="text-[1.3rem] sm:text-[1.45rem] font-semibold leading-[1.4] text-slate-900 dark:text-slate-100">{item.title}</h2>
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${
                              item.type === 'notice'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                                : item.type === 'article'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
                                : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {item.type.toUpperCase()}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
                          <span className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                          {item.type === 'article' && item.authorName && (
                            <span className="flex items-center gap-2">
                              <User className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                              {item.authorName}
                            </span>
                          )}
                          {item.type === 'notice' && item.expiresAt && (
                            <span className="text-red-600 dark:text-red-300">Expires {new Date(item.expiresAt).toLocaleDateString()}</span>
                          )}
                          {expired && <span className="text-red-600 dark:text-red-300 font-semibold">Expired</span>}
                        </div>

                        <p className="mt-4 line-clamp-4 text-base leading-8 text-slate-700 dark:text-slate-300">{item.content.replace(/<[^>]+>/g, '').slice(0, 260)}...</p>
                      </div>

                      <div className="mt-4">
                        <span className="inline-flex h-9 w-full items-center justify-center rounded-md border border-sky-200 bg-transparent px-4 text-sm font-medium text-sky-800 transition-colors group-hover:bg-sky-50 dark:border-sky-700 dark:text-sky-200 dark:group-hover:bg-slate-800">
                          Read Full
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Pagination */}
            {data?.pages && data.pages > 1 && (
              <div className="flex justify-center gap-2 py-8">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4">
                  Page {page} of {data.pages}
                </span>
                <Button
                  variant="outline"
                  disabled={page === data.pages}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="sky-card">
            <CardContent className="text-center py-12 text-muted-foreground">
              No news articles found.
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  )
}

