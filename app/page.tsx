import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Footer from '@/components/public/footer'
import { ArrowRight, BellRing, CalendarDays, FileText, Newspaper, Users, Briefcase, Star, TrendingUp, Shield } from 'lucide-react'
import { getHomePageContent, getCommitteeMembers } from '@/lib/server-data'

export const revalidate = 7200 // 2 hours - balance between freshness and cache hits

function plainText(html: string) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export default async function Home() {
  const [homeContent, { members }] = await Promise.all([
    getHomePageContent(),
    getCommitteeMembers('current'),
  ])
  
  const notices = homeContent.notices || []
  const newsItems = homeContent.news || []
  const articleItems = homeContent.articles || []
  const stats = homeContent.stats || {}
  const president = members?.[0] // First member by priority (usually the president)

  const statistics = [
    { label: 'Active Members', value: stats.members || 0, icon: Users, color: 'sky' },
    { label: 'News & Updates', value: stats.newsCount || 0, icon: Newspaper, color: 'amber' },
    { label: 'Articles', value: stats.articleCount || 0, icon: FileText, color: 'emerald' },
    { label: 'Job Openings', value: stats.jobs || 0, icon: Briefcase, color: 'rose' },
  ]

  return (
    <div className="min-h-screen public-sky">
      <main className="mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-10 md:py-14 space-y-6 sm:space-y-8 md:space-y-10">
        {/* Modern Hero Section */}
        <section className="relative overflow-hidden rounded-3xl border border-sky-200/70 bg-gradient-to-br from-white via-sky-50 to-blue-100 dark:border-sky-900/50 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950">
          <div className="grid items-stretch gap-0 lg:grid-cols-12">
            <div className="lg:col-span-7 p-4 sm:p-6 md:p-8 lg:p-10 space-y-4 sm:space-y-5 md:space-y-6 relative z-10">
              <div className="flex items-center gap-2">
                <div className="h-1 w-12 bg-gradient-to-r from-sky-500 to-blue-500" />
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-sky-700 dark:text-sky-300">
                  Welcome
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-sky-600 dark:text-sky-400 mb-2">
                  चापाकोट उद्योग वाणिज्य संघ
                </p>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-black leading-tight text-slate-900 dark:text-slate-100 tracking-tight">
                  Chapakot Chamber of Commerce & Industry
                </h1>
              </div>
              <p className="news-font max-w-2xl text-base sm:text-lg md:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                Empowering local businesses and fostering economic growth through collaboration, innovation, and mutual support in Chapakot.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href="/members">
                  <Button className="btn-sky hover:scale-105 transition-transform group">
                    Explore Members
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/news">
                  <Button variant="outline" className="border-sky-400 text-sky-700 hover:bg-sky-50 dark:border-sky-500 dark:text-sky-300 dark:hover:bg-sky-950/50 hover:scale-105 transition-transform">
                    Latest Updates
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative lg:col-span-5 min-h-[280px] md:min-h-[360px]">
              <Image
                src="/chapakot.jpg"
                alt="चापाकोट"
                fill
                priority
                sizes="(max-width: 1024px) calc(100vw - 2rem), 42vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/95 rounded-lg p-3 border border-white/30 dark:border-slate-700/30 shadow-sm">
                <p className="text-xs font-semibold text-sky-700 dark:text-sky-300 uppercase tracking-wide">Chapakot Region</p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Business Hub in Syangja</p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Statistics */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {statistics.map((stat, idx) => {
            const Icon = stat.icon
            const colorClass = stat.color === 'sky' ? 'text-sky-600 dark:text-sky-400' : 
                              stat.color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                              stat.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                              'text-rose-600 dark:text-rose-400'
            return (
              <div key={idx} className="rounded-2xl border border-primary/10 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-5 hover:border-primary/20 dark:hover:border-slate-600 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mb-1">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">{stat.value}</p>
                  </div>
                  <Icon className={`${colorClass} h-5 w-5 sm:h-6 sm:w-6 opacity-60`} />
                </div>
              </div>
            )
          })}
        </section>

        {/* Important Notices */}
        {notices.length > 0 && (
          <section className="rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50 to-orange-50 p-4 sm:p-5 md:p-6 dark:border-amber-800/70 dark:from-amber-950/30 dark:to-orange-950/20">
            <div className="mb-4 flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-300">
              <BellRing className="h-5 w-5" />
              <span>Important Notices</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {notices.map((notice: any) => (
                <Link
                  key={notice._id}
                  href={`/news/${notice.slug}`}
                  className="group rounded-xl border border-amber-200 bg-white/90 p-4 transition-all hover:-translate-y-1 hover:shadow-md dark:border-amber-900/60 dark:bg-slate-900/90"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                      Notice
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="line-clamp-2 font-bold leading-5 text-slate-900 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">{notice.title}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{plainText(notice.content).slice(0, 120)}...</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* President's Message - Modern Design */}
        {president && (
          <section className="relative overflow-hidden rounded-3xl border border-indigo-200/50 bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:border-indigo-900/30 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40 p-0">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-200/30 dark:bg-indigo-900/20 rounded-full blur-3xl" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl" />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-6 md:gap-8 items-center p-6 sm:p-8 md:p-10">
              {/* President Photo */}
              <div className="flex justify-center md:justify-start">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-3xl blur-2xl opacity-40 dark:opacity-20" />
                  <div className="relative h-80 w-72 overflow-hidden rounded-3xl border-4 border-white shadow-2xl dark:border-slate-800">
                    <Image
                      src={president.image || '/placeholder.jpg'}
                      alt={president.name}
                      width={300}
                      height={360}
                      className="h-full w-full object-cover object-top"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                  {/* Badge */}
                  <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-indigo-500 to-blue-500 text-white rounded-full p-4 shadow-lg border-4 border-white dark:border-slate-800 flex items-center justify-center">
                    <Star className="h-6 w-6" fill="currentColor" />
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full" />
                    <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Message</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 leading-tight">
                    अध्यक्षको सन्देश
                  </h2>
                  <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
                    {president.name}
                    {president.role && <span className="text-slate-600 dark:text-slate-400 font-normal"> • {president.role}</span>}
                  </p>
                </div>

                <p className="news-font text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                  Our organization is committed to empowering local businesses, fostering collaboration among members, and accelerating economic development in Chapakot. This platform aims to deliver comprehensive information, business opportunities, and services swiftly and transparently to all our stakeholders.
                </p>

                <p className="news-font text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                  We strive to create a vibrant, inclusive business community that champions growth, encourages innovation, and promotes sustainable development for the prosperity of our members and the entire region.
                </p>

                <div className="flex gap-3 pt-2">
                  <Link href="/about/committee">
                    <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white group">
                      <Shield className="mr-2 h-4 w-4" />
                      Meet Our Team
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* News and Articles Grid */}
        <section className="grid gap-6 lg:grid-cols-2">
          {/* Latest News */}
          <div className="rounded-2xl border border-primary/10 bg-white dark:bg-slate-950 p-5 md:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-50">
                <Newspaper className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                <span>Latest News</span>
              </h3>
              <Link href="/news?type=news" className="text-sm font-semibold text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-200 group">
                <span className="group-hover:underline">View All</span>
                <ArrowRight className="ml-1 h-3 w-3 inline group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="space-y-3">
              {newsItems.length > 0 ? (
                newsItems.map((item: any) => (
                  <Link
                    key={item._id}
                    href={`/news/${item.slug}`}
                    className="group block rounded-xl border border-primary/10 dark:border-slate-700 bg-white dark:bg-slate-950 p-4 hover:border-sky-300 hover:shadow-md transition-all duration-300 dark:hover:bg-slate-900"
                  >
                    <p className="news-font line-clamp-2 font-bold leading-snug text-slate-900 dark:text-slate-50 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{item.title}</p>
                    <p className="news-font mt-1 line-clamp-2 text-sm text-slate-700 dark:text-slate-300">{plainText(item.content).slice(0, 100)}...</p>
                    <div className="mt-3 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">No news available.</p>
              )}
            </div>
          </div>

          {/* Featured Articles */}
          <div className="rounded-2xl border border-primary/10 bg-white dark:bg-slate-950 p-5 md:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-50">
                <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span>Featured Articles</span>
              </h3>
              <Link href="/news?type=article" className="text-sm font-semibold text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-200 group">
                <span className="group-hover:underline">View All</span>
                <ArrowRight className="ml-1 h-3 w-3 inline group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="space-y-3">
              {articleItems.length > 0 ? (
                articleItems.map((item: any) => (
                  <Link
                    key={item._id}
                    href={`/news/${item.slug}`}
                    className="group block rounded-xl border border-primary/10 dark:border-slate-700 bg-white dark:bg-slate-950 p-4 hover:border-sky-300 hover:shadow-md transition-all duration-300 dark:hover:bg-slate-900"
                  >
                    <p className="news-font line-clamp-2 font-bold leading-snug text-slate-900 dark:text-slate-50 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{item.title}</p>
                    <p className="news-font mt-1 line-clamp-2 text-sm text-slate-700 dark:text-slate-300">{plainText(item.content).slice(0, 100)}...</p>
                    <div className="mt-3 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400">No articles available.</p>
              )}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative overflow-hidden rounded-3xl border border-sky-200/50 bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 dark:from-sky-600 dark:via-blue-600 dark:to-indigo-700 p-6 sm:p-8 md:p-10">
          <div className="absolute -right-20 -top-20 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="space-y-2 flex-1">
              <h3 className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-white">
                <TrendingUp className="h-6 w-6" />
                Ready to Grow Your Business?
              </h3>
              <p className="text-sm sm:text-base text-sky-100">Join our vibrant community of businesses and explore opportunities together.</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto whitespace-nowrap">
              <Link href="/jobs" className="flex-1 sm:flex-initial">
                <Button variant="secondary" className="w-full sm:w-auto hover:scale-105 transition-transform group">
                  <Briefcase className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                  Explore Jobs
                </Button>
              </Link>
              <Link href="/members" className="flex-1 sm:flex-initial">
                <Button className="w-full sm:w-auto bg-white text-sky-700 dark:text-sky-700 hover:bg-slate-100 dark:bg-white dark:hover:bg-slate-100 hover:scale-105 transition-transform group font-semibold">
                  <Users className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Find Members
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
