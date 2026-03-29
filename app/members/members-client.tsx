'use client'

import { useEffect, useState } from 'react'
import { useMembersWithFallback } from '@/hooks/useApi'
import { useSearchParams } from 'next/navigation'
import NavigationClient from '@/components/public/navigation-client'
import Footer from '@/components/public/footer'
import PageIntro from '@/components/public/page-intro'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/useDebounce'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Mail,
  Phone,
  Globe,
  Store,
  UtensilsCrossed,
  Cog,
  Plane,
  Cpu,
  GraduationCap,
  Stethoscope,
  Building2,
  Users,
  MapPin,
  Search,
  SlidersHorizontal,
} from 'lucide-react'

const businessTypes = [
  'Retail',
  'Restaurant',
  'Service',
  'Manufacturing',
  'Tourism',
  'Technology',
  'Education',
  'Healthcare',
  'Other',
]

const wards = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 6', 'Ward 7', 'Ward 8', 'Ward 9', 'Ward 10']

const maskPhone = (phone?: string) => {
  const value = (phone || '').trim()
  if (!value) return ''
  if (value.length <= 6) return `${value}****`
  return `${value.slice(0, 6)}****`
}

export default function MembersClient({
  initialPage = 1,
  initialSearch = '',
  initialBusinessType = 'all',
  initialWard = 'all',
  fallbackData,
  session,
  activeJobsCount = 0,
}: {
  initialPage?: number
  initialSearch?: string
  initialBusinessType?: string
  initialWard?: string
  fallbackData?: any
  session?: any
  activeJobsCount?: number
}) {
  const [page, setPage] = useState(initialPage)
  const [search, setSearch] = useState(initialSearch)
  const [businessType, setBusinessType] = useState(initialBusinessType)
  const [ward, setWard] = useState(initialWard)
  const [focusId, setFocusId] = useState<string | null>(null)
  const searchParams = useSearchParams()
  
  // Debounce search input for API calls (300ms delay)
  const debouncedSearch = useDebounce(search, 300)
  
  const { data, isLoading } = useMembersWithFallback(
    page,
    debouncedSearch,
    businessType,
    ward,
    fallbackData
  )

  // Only show loading when there's truly no data available
  const showLoading = isLoading && !data?.members

  useEffect(() => {
    const qsSearch = searchParams.get('search')
    const qsFocus = searchParams.get('focus')
    const qsPage = parseInt(searchParams.get('page') || '0', 10)
    if (qsSearch) setSearch(qsSearch)
    if (qsPage && qsPage > 0) setPage(qsPage)
    if (qsFocus) setFocusId(qsFocus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!focusId || !data?.members?.length) return
    const el = document.getElementById(`member-${focusId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('ring-2', 'ring-sky-300', 'ring-offset-2')
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-sky-300', 'ring-offset-2')
      }, 2000)
    }
  }, [focusId, data?.members])

  const handleReset = () => {
    setSearch('')
    setBusinessType('all')
    setWard('all')
    setPage(1)
  }

  const typeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'retail':
        return Store
      case 'restaurant':
        return UtensilsCrossed
      case 'service':
        return Cog
      case 'tourism':
        return Plane
      case 'technology':
        return Cpu
      case 'education':
        return GraduationCap
      case 'healthcare':
        return Stethoscope
      case 'manufacturing':
        return Building2
      default:
        return Users
    }
  }

  const iconStylesByType: Record<string, { wrap: string; icon: string }> = {
    retail: { wrap: 'from-blue-100 to-cyan-100 dark:from-blue-900/60 dark:to-cyan-900/60', icon: 'text-blue-700 dark:text-cyan-300' },
    restaurant: { wrap: 'from-orange-100 to-amber-100 dark:from-orange-900/60 dark:to-amber-900/60', icon: 'text-orange-700 dark:text-amber-300' },
    service: { wrap: 'from-violet-100 to-fuchsia-100 dark:from-violet-900/60 dark:to-fuchsia-900/60', icon: 'text-violet-700 dark:text-fuchsia-300' },
    tourism: { wrap: 'from-sky-100 to-indigo-100 dark:from-sky-900/60 dark:to-indigo-900/60', icon: 'text-sky-700 dark:text-indigo-300' },
    technology: { wrap: 'from-teal-100 to-emerald-100 dark:from-teal-900/60 dark:to-emerald-900/60', icon: 'text-teal-700 dark:text-emerald-300' },
    education: { wrap: 'from-rose-100 to-pink-100 dark:from-rose-900/60 dark:to-pink-900/60', icon: 'text-rose-700 dark:text-pink-300' },
    healthcare: { wrap: 'from-red-100 to-rose-100 dark:from-red-900/60 dark:to-rose-900/60', icon: 'text-red-700 dark:text-rose-300' },
    manufacturing: { wrap: 'from-amber-100 to-yellow-100 dark:from-amber-900/60 dark:to-yellow-900/60', icon: 'text-amber-700 dark:text-yellow-300' },
  }

  return (
    <div className="min-h-screen public-sky">
      <NavigationClient session={session ?? null} activeJobsCount={activeJobsCount} />

      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-12 space-y-8 sm:space-y-10">
        <PageIntro
          title="Member Directory"
          subtitle={`Browse and connect with ${data?.total || 0} business members in our community`}
          eyebrow="Directory"
        />

        <div className="card-modern sky-card p-3 md:p-4 border-2 border-primary/10 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-600/70" />
              <Input
                placeholder="Search members..."
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
                value={businessType}
                onValueChange={(value) => {
                  setBusinessType(value)
                  setPage(1)
                }}
              >
                <SelectTrigger className="h-8 w-full sm:w-32 text-sm">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={ward}
                onValueChange={(value) => {
                  setWard(value)
                  setPage(1)
                }}
              >
                <SelectTrigger className="h-8 w-full sm:w-24 text-sm">
                  <SelectValue placeholder="Ward" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {wards.map((w) => (
                    <SelectItem key={w} value={w}>
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 border-sky-200 text-sky-800 hover:bg-white/80"
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>

        {showLoading ? (
          <div className="text-center py-16">
            <p className="text-foreground/70 text-lg">Loading members...</p>
          </div>
        ) : data?.members?.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {data.members.map((member: any) => {
                const Icon = typeIcon(member.businessType || '')
                const isActive = member.membershipStatus !== 'inactive'
                const businessTypeKey = (member.businessType || '').toLowerCase()
                return (
                  <div
                    key={member._id}
                    id={`member-${member._id}`}
                    className="card-modern sky-card p-6 border-2 border-primary/10 hover:border-primary/30 group hover-lift"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`rounded-xl bg-gradient-to-br ${iconStylesByType[businessTypeKey]?.wrap || 'from-sky-100 to-blue-100 dark:from-sky-900/60 dark:to-blue-900/60'} p-3 shadow-sm`}>
                        <Icon className={`h-6 w-6 ${iconStylesByType[businessTypeKey]?.icon || 'text-sky-700 dark:text-sky-300'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-xl leading-tight text-slate-900 group-hover:text-sky-700 transition-colors">
                          {member.businessName}
                        </h3>
                        <p className="text-sm font-semibold text-sky-700/90 mt-1">{member.businessType}</p>
                        <p className="text-xs uppercase tracking-wide text-slate-500 mt-1">{member.ward}</p>
                        <div className="mt-2 inline-flex items-center gap-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}
                            aria-hidden="true"
                          />
                          <span className={`text-xs font-semibold ${isActive ? 'text-green-700' : 'text-red-700'}`}>
                            {isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                        <p className="text-base font-semibold text-slate-800">{member.ownerName}</p>
                      </div>
                      {member.description && (
                        <p className="text-sm text-slate-600 line-clamp-2">{member.description}</p>
                      )}
                    </div>

                    <div className="mt-4 space-y-2.5 pt-4 border-t border-sky-100">
                      <div className="flex items-center gap-2 text-sm font-medium text-sky-800">
                        <MapPin className="h-4 w-4 text-orange-600 dark:text-orange-300 flex-shrink-0" />
                        <span className="truncate">{member.address}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm font-medium text-sky-800">
                        <Mail className="h-4 w-4 text-cyan-600 dark:text-cyan-300 flex-shrink-0" />
                        <a href={`mailto:${member.email}`} className="truncate hover:text-sky-700">
                          {member.email}
                        </a>
                      </div>

                      <div className="flex items-center gap-2 text-sm font-medium text-sky-800">
                        <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-300 flex-shrink-0" />
                        <span>{maskPhone(member.phone)}</span>
                      </div>

                      {member.website && (
                        <div className="flex items-center gap-2 text-sm font-medium text-sky-800">
                          <Globe className="h-4 w-4 text-violet-600 dark:text-violet-300 flex-shrink-0" />
                          <a
                            href={member.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate hover:text-sky-700"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {data?.pages && data.pages > 1 && (
              <div className="flex justify-center gap-4 py-10">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="btn-modern"
                >
                  Previous
                </Button>
                <span className="flex items-center px-6 font-semibold text-foreground">
                  Page {page} of {data.pages}
                </span>
                <Button
                  variant="outline"
                  disabled={page === data.pages}
                  onClick={() => setPage(page + 1)}
                  className="btn-modern"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="card-modern sky-card p-8 md:p-12 text-center border-2 border-primary/10">
            <p className="text-foreground/75 text-lg">No members found matching your filters.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
