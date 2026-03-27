import Image from 'next/image'
import Navigation from '@/components/public/navigation'
import Footer from '@/components/public/footer'
import PageIntro from '@/components/public/page-intro'
import { getCommitteeMembers } from '@/lib/server-data'

export default async function PastPresidentsPage() {
  const { members } = await getCommitteeMembers('past')
  return (
    <div className="min-h-screen public-sky">
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 py-12 md:py-16 lg:py-20">
        <PageIntro
          title="Past Presidents"
          subtitle="Historical leaders who shaped the mission of Chapakot Chamber."
          eyebrow="Archive"
          className="mb-14"
        />

        <div className="space-y-4 md:space-y-6">
          {members.map((president: any) => (
            <div
              key={president._id}
              className="card-modern sky-card p-6 md:p-8 border-2 border-primary/10 hover:border-primary/30 group hover-lift transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="relative h-20 w-20 md:h-24 md:w-24 lg:h-32 lg:w-32 rounded-2xl overflow-hidden border border-sky-100 shadow-md flex-shrink-0">
                  <Image
                    src={president.image || '/placeholder.jpg'}
                    alt={president.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 128px"
                    priority={false}
                  />
                </div>
                <div className="flex-1 w-full text-center sm:text-left">
                  <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors duration-300">
                    {president.name}
                  </h2>
                  <p className="text-sm font-semibold text-sky-700/90 dark:text-sky-300 mt-1">{president.tenure || 'N/A'}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mt-1">Past President</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
