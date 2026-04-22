import Image from 'next/image'
import Footer from '@/components/public/footer'
import PageIntro from '@/components/public/page-intro'
import { getCommitteeMembers } from '@/lib/server-data'

export default async function CommitteePage() {
  const { members } = await getCommitteeMembers('current')

  return (
    <div className="min-h-screen public-sky">
      <main className="max-w-6xl mx-auto px-4 py-12 md:py-16 lg:py-20">
        <PageIntro
          title="Executive Committee"
          subtitle="Our current leadership team, selected for strategic guidance and member advocacy."
          eyebrow="Leadership"
          className="mb-14"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {members.map((member: any) => (
            <div key={member._id} className="group relative mx-auto w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-slate-800 hover:border-sky-200 dark:hover:border-sky-700 sm:max-w-none">
              <div className="relative h-64 overflow-hidden sm:h-auto sm:aspect-[4/5]">
                <Image
                  src={member.image || '/placeholder.jpg'}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6 relative">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300 line-clamp-1">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                  {member.role}
                </p>
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200">
                  Executive Committee
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
