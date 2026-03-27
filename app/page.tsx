import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Navigation from '@/components/public/navigation'
import Footer from '@/components/public/footer'
import { ArrowRight, BellRing, CalendarDays, FileText, Newspaper, Megaphone, Users, Briefcase } from 'lucide-react'
import { getContentsPage } from '@/lib/server-data'

export const revalidate = 3600

function plainText(html: string) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export default async function Home() {
  const data = await getContentsPage({ page: 1, type: 'all', search: '' })
  const contents = data?.contents || []

  const notices = contents
    .filter((item: any) => item.type === 'notice')
    .sort((a: any, b: any) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 4)

  const newsItems = contents
    .filter((item: any) => item.type === 'news')
    .sort((a: any, b: any) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 6)

  const articleItems = contents
    .filter((item: any) => item.type === 'article')
    .sort((a: any, b: any) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 6)

  return (
    <div className="min-h-screen public-sky">
      <Navigation />

      <main className="mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-10 md:py-14 space-y-6 sm:space-y-8 md:space-y-10">
        <section className="overflow-hidden rounded-3xl border border-sky-200/70 bg-gradient-to-br from-white via-sky-50 to-blue-100 dark:border-sky-900/50 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950">
          <div className="grid items-stretch gap-0 lg:grid-cols-12">
            <div className="lg:col-span-7 p-4 sm:p-6 md:p-8 lg:p-10 space-y-3 sm:space-y-4 md:space-y-5">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-sky-700 dark:text-sky-300">
                चापाकोट उद्योग वाणिज्य संघ
              </p>
               <h1 className="text-xl sm:text-2xl md:text-4xl font-bold leading-tight text-slate-900 dark:text-slate-100">
                  Chapakot Chamber of Commerce & Industry
                </h1>
              <p className="news-font max-w-4xl text-[1.02rem] leading-[1.85] text-slate-700 dark:text-slate-300 sm:text-lg">
                गण्डकी प्रदेशको स्याङ्जा जिल्लाको दक्षिण-पूर्वी भागमा अवस्थित चापाकोट नगरपालिका रत्नापुर, कुवाकोट तथा चापाकोट क्षेत्रको एकीकृत पहिचानसहित सम्भावनापूर्ण व्यापारिक केन्द्रको रूपमा विकास हुँदै आएको छ। स्थानीय व्यापारी तथा उद्यमीहरूको एकता, हकहित संरक्षण र व्यावसायिक वातावरण सुदृढ गर्न चापाकोट उद्योग वाणिज्य संघ निरन्तर सक्रिय छ।
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link href="/members">
                  <Button className="btn-sky">Members<ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
                <Link href="/news">
                  <Button variant="outline" className="border-sky-300 text-sky-800 hover:bg-white/80 dark:border-sky-700 dark:text-sky-200 dark:hover:bg-slate-800/70">
                    News/Articles
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative lg:col-span-5 min-h-[260px] md:min-h-[320px]">
              <Image
                src="/chapakot.jpg"
                alt="चापाकोट"
                fill
                priority
                sizes="(max-width: 1024px) calc(100vw - 2rem), 42vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-50 to-orange-50 p-3 sm:p-4 md:p-5 dark:border-amber-800/70 dark:from-amber-950/30 dark:to-orange-950/20">
          <div className="mb-3 flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-300">
            <Megaphone className="h-4 w-4" />
            Important Notices
          </div>

          {notices.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {notices.map((notice: any) => (
                <Link
                  key={notice._id}
                  href={`/news/${notice.slug}`}
                  className="rounded-xl border border-amber-200 bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md dark:border-amber-900/60 dark:bg-slate-900 dark:hover:bg-slate-900"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="rounded bg-amber-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                      Notice
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="line-clamp-2 font-semibold leading-5 text-slate-900 dark:text-slate-100">{notice.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{plainText(notice.content).slice(0, 130)}...</p>
                  <p className="mt-2 text-xs font-medium text-amber-700 dark:text-amber-300">Read full notice</p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-700 dark:text-slate-300">There are no active notices at the moment.</p>
          )}
        </section>

        <section className="rounded-2xl border border-primary/10 bg-white/85 p-4 sm:p-5 md:p-6 dark:border-slate-800 dark:bg-slate-900/85">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-sky-700 dark:text-sky-300">200+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-sky-700 dark:text-sky-300">50+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">News</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-sky-700 dark:text-sky-300">25+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Articles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-sky-700 dark:text-sky-300">5+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Notices</div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-primary/10 bg-white/85 p-4 sm:p-5 md:p-6 dark:border-slate-800 dark:bg-slate-900/85">
          <div className="grid gap-4 sm:gap-5 md:grid-cols-12 md:items-center">
            <div className="md:col-span-3">
              <div className="relative mx-auto h-32 w-28 overflow-hidden rounded-2xl border border-sky-200/80 bg-white shadow-lg shadow-sky-100/80 ring-2 ring-white sm:h-40 sm:w-32 dark:border-sky-800/70 dark:bg-slate-900 dark:shadow-none dark:ring-slate-900">
                <Image
                  src="/nirmaldainew.png"
                  alt="अध्यक्ष सन्देश"
                  fill
                  sizes="(max-width: 640px) 112px, 128px"
                  className="object-cover object-top"
                />
              </div>
            </div>
            <div className="md:col-span-9 space-y-2">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">अध्यक्षको सन्देश</h2>
               <p className="text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                 Our organization is committed to empowering local businesses, fostering collaboration among members,
                 and accelerating economic development in Chapakot. This website aims to deliver information, opportunities,
                 and services quickly and transparently to all. We strive to create a vibrant business community that
                 supports growth, innovation, and sustainable development for the benefit of our members and the region.
               </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-primary/10 bg-white/85 p-4 sm:p-5 md:p-6 dark:border-slate-800 dark:bg-slate-900/85">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
                <Newspaper className="h-5 w-5 text-sky-700 dark:text-sky-300" />
                ताजा समाचार
              </h3>
              <Link href="/news" className="text-sm font-semibold text-sky-700 hover:text-sky-800 dark:text-sky-300">सबै हेर्नुहोस्</Link>
            </div>
            <div className="space-y-3">
              {newsItems.length > 0 ? (
                newsItems.map((item: any) => (
                  <Link
                    key={item._id}
                    href={`/news/${item.slug}`}
                    className="block rounded-xl border border-primary/10 bg-white p-4 shadow-sm hover:shadow-lg hover:border-sky-300 transition-all duration-300 dark:border-slate-800 dark:bg-slate-950/70 dark:hover:bg-slate-900"
                  >
                    <p className="news-font line-clamp-2 text-[1.02rem] font-semibold leading-[1.6] text-slate-900 dark:text-slate-100 sm:text-lg">{item.title}</p>
                    <p className="news-font mt-1 line-clamp-2 text-[0.98rem] leading-[1.85] text-slate-600 dark:text-slate-300 sm:text-base">{plainText(item.content).slice(0, 120)}...</p>
                    <p className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-slate-700 dark:text-slate-300">समाचार उपलब्ध छैन।</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-white/85 p-4 sm:p-5 md:p-6 dark:border-slate-800 dark:bg-slate-900/85">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
                <FileText className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                नयाँ लेखहरू
              </h3>
              <Link href="/news?type=article" className="text-sm font-semibold text-sky-700 hover:text-sky-800 dark:text-sky-300">सबै हेर्नुहोस्</Link>
            </div>
            <div className="space-y-3">
              {articleItems.length > 0 ? (
                articleItems.map((item: any) => (
                  <Link
                    key={item._id}
                    href={`/news/${item.slug}`}
                    className="block rounded-xl border border-primary/10 bg-white p-4 shadow-sm hover:shadow-lg hover:border-sky-300 transition-all duration-300 dark:border-slate-800 dark:bg-slate-950/70 dark:hover:bg-slate-900"
                  >
                    <p className="news-font line-clamp-2 text-[1.02rem] font-semibold leading-[1.6] text-slate-900 dark:text-slate-100 sm:text-lg">{item.title}</p>
                    <p className="news-font mt-1 line-clamp-2 text-[0.98rem] leading-[1.85] text-slate-600 dark:text-slate-300 sm:text-base">{plainText(item.content).slice(0, 120)}...</p>
                    <p className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-slate-700 dark:text-slate-300">लेख उपलब्ध छैन।</p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-primary/10 bg-gradient-to-r from-sky-100/80 to-blue-100/80 p-4 sm:p-5 md:p-6 dark:border-slate-800 dark:from-slate-900 dark:to-sky-950/60">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="flex items-center gap-2 text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                <BellRing className="h-4 w-4 text-sky-700 dark:text-sky-300" />
                Members, Jobs, and Updates in One Place
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">Stay connected with the chamber community through one unified platform.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Link href="/jobs" className="flex-1 sm:flex-initial"><Button variant="outline" className="w-full sm:w-auto dark:border-sky-700 dark:text-sky-200 hover:scale-105 transition-transform"><Briefcase className="mr-2 h-4 w-4" />Jobs</Button></Link>
              <Link href="/members" className="flex-1 sm:flex-initial"><Button className="w-full sm:w-auto btn-sky hover:scale-105 transition-transform"><Users className="mr-2 h-4 w-4" />Members</Button></Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
