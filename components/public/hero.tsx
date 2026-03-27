'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 text-balance">
          Chapakot Chamber of Commerce
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 text-balance">
          Empowering businesses and fostering community growth in Chapakot. Join us as we build a stronger local economy together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/members">
            <Button size="lg" variant="default">
              Explore Members
            </Button>
          </Link>
          <Link href="/jobs">
            <Button size="lg" variant="outline">
              View Job Listings
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
