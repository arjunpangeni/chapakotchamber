'use client'

import { useState } from 'react'
import Footer from '@/components/public/footer'
import { Button } from '@/components/ui/button'
import { Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import cloudinaryLoader from '@/lib/cloudinary-loader'

export default function NewsDetailClient({
  initialContent,
}: {
  initialContent: any | null
}) {
  const [content] = useState<any>(initialContent)

  if (!content) return <div className="min-h-screen bg-[#f4f5f7] dark:bg-slate-950"><main className="mx-auto max-w-4xl px-4 py-12">Not found</main><Footer /></div>

  // Strip any script tags to avoid React script warnings and improve safety
  const safeHtml = (content.content || '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')

  const baseBadge = content.type === 'notice' ? 'bg-red-100 text-red-700' : content.type === 'article' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'

  return (
    <div className="min-h-screen bg-[#f4f5f7] dark:bg-slate-950">
      <main className="news-font mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-3">
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${baseBadge}`}>{content.type.toUpperCase()}</span>
        </div>

        <h1 className="text-[1.8rem] font-semibold leading-[1.25] tracking-tight text-black sm:text-[2.4rem] lg:text-[3rem] dark:text-slate-100">
          {content.title}
        </h1>

        <div className="mt-7 h-12 w-full rounded-sm bg-slate-200/80 dark:bg-slate-800/70" />

        <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-base sm:text-lg text-slate-700 dark:text-slate-300">
          <span><Eye className="mr-1 inline-block h-5 w-5" /> {new Date(content.createdAt).toLocaleDateString()}</span>
          {content.type === 'article' && content.authorName && <span>लेखक: {content.authorName}</span>}
          {content.type === 'notice' && content.expiresAt && <span>अन्तिम मिति: {new Date(content.expiresAt).toLocaleDateString()}</span>}
        </div>

        {content.image ? (
          <div className="mt-8 relative h-[34vh] min-h-[220px] w-full overflow-hidden rounded-md border border-slate-300/80 sm:h-[52vh] dark:border-slate-700">
            <Image
              src={content.image}
              loader={cloudinaryLoader}
              alt={content.title}
              fill
              sizes="(max-width: 768px) calc(100vw - 2rem), 1100px"
              className="object-cover"
              priority
            />
          </div>
        ) : null}

        <article
          className="mt-10 max-w-none text-black dark:text-slate-100 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-4 [&_h2]:mt-9 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-3 [&_h3]:mt-7 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:mb-2 [&_ol]:mb-7 [&_ol]:pl-7 [&_p]:mb-7 [&_p]:text-lg [&_p]:leading-[1.85] [&_strong]:font-semibold [&_ul]:mb-7 [&_ul]:list-disc [&_ul]:pl-7 sm:[&_p]:text-xl lg:[&_p]:text-[1.4rem]"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />

        <div className="mt-10">
          <Link href="/news">
            <Button variant="outline" className="h-11 px-5 text-base">Back to news</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
