'use client'

import { useState,useMemo } from 'react'
import { useGalleryWithFallback } from '@/hooks/useApi'
import NavigationClient from '@/components/public/navigation-client'
import Footer from '@/components/public/footer'
import PageIntro from '@/components/public/page-intro'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import cloudinaryLoader from '@/lib/cloudinary-loader'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

export default function GalleryClient({
  initialPage = 1,
  initialCategory = '',
  initialSearch = '',
  fallbackData,
  session,
  activeJobsCount = 0,
}: {
  initialPage?: number
  initialCategory?: string
  initialSearch?: string
  fallbackData?: any
  session?: any
  activeJobsCount?: number
}) {
  const [page, setPage] = useState(initialPage)
  const [category, setCategory] = useState(initialCategory)
  const [search, setSearch] = useState(initialSearch)
  
  // Debounce search input for API calls (300ms delay)
  const debouncedSearch = useDebounce(search, 300)
  
  const { data, isLoading } = useGalleryWithFallback(page, category, debouncedSearch, fallbackData)

  // Only show loading when there's truly no data available
  const showLoading = isLoading && !data?.albums

  const filteredAlbums = useMemo(() => {
    const list = [...(data?.albums || [])]
    if (!search.trim()) return list
    const term = search.trim().toLowerCase()
    return list.filter((album: any) => {
      const fields = [album.eventName, album.description, album.category, album.eventSlug].join(' ').toLowerCase()
      return fields.includes(term)
    })
  }, [data?.albums, search])

  return (
    <div className="min-h-screen public-sky">
      <NavigationClient session={session ?? null} activeJobsCount={activeJobsCount} />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16 space-y-8 sm:space-y-10">
        <PageIntro
          title="Photo Gallery"
          subtitle="Browse event albums and view full photos from our activities"
          eyebrow="Media"
        />

        {/* Search and Filter */}
        <div className="card-modern border border-primary/10 p-4 rounded-2xl space-y-4">
          {/* Search */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300 mb-2">
              <Search className="h-4 w-4" />
              Search
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-600/70" />
              <Input
                placeholder="Search albums..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="h-8 pl-9 text-sm"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300 mb-2">
              <SlidersHorizontal className="h-4 w-4" />
              Categories
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={category === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => { setCategory(''); setPage(1); }}
                className="h-7 px-3 text-xs"
              >
                All
              </Button>
              {['Events', 'Meetings', 'Awards', 'Training', 'Other'].map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => { setCategory(cat); setPage(1); }}
                  className="h-7 px-3 text-xs"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {showLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card-modern sky-card overflow-hidden animate-pulse">
                <div className="h-56 bg-sky-100/70" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-2/3 bg-sky-200 rounded" />
                  <div className="h-3 w-1/2 bg-sky-100 rounded" />
                  <div className="h-3 w-1/3 bg-sky-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.albums?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAlbums.map((album: any) => (
                <Link key={album._id} href={`/gallery/${album.eventSlug}`} className="group block h-full">
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-primary/10 sky-card h-full flex flex-col">
                    <div className="relative h-56 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                      {album.coverImage ? (
                        <Image
                          src={album.coverImage}
                          loader={cloudinaryLoader}
                          alt={album.eventName}
                          fill
                          sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAFggJ/lwqFAAAAAElFTkSuQmCC"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">No cover</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold line-clamp-2 text-lg text-foreground group-hover:text-primary transition-colors">
                          {album.eventName}
                        </h3>
                        <p className="text-sm text-foreground/70 mt-1">{album.imageCount || 0} photo(s)</p>
                      </div>
                      <p className="text-xs text-primary/70 mt-3 font-medium">
                        {album.category || 'Uncategorized'}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {data?.pages && data.pages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center gap-3 py-8">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  className="rounded-lg w-full sm:w-fit"
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
                  className="rounded-lg w-full sm:w-fit"
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="border-primary/10">
            <CardContent className="text-center py-16 text-foreground/70">
              No albums found.
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  )
}

