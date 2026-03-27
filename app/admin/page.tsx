'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useMembers } from '@/hooks/useApi'
import { useJobs } from '@/hooks/useApi'
import { useContents } from '@/hooks/useApi'
import { useGallery } from '@/hooks/useApi'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, Briefcase, Newspaper, Image } from 'lucide-react'

function StatCard({
  title,
  value,
  icon: Icon,
  isLoading,
}: {
  title: string
  value: number
  icon: React.ReactNode
  isLoading: boolean
}) {
  return (
    <div className="card-modern p-6 md:p-8 border-2 border-primary/10 hover:border-primary/30 group hover-lift">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground/70 group-hover:text-primary transition-colors duration-300">{title}</h3>
        <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 text-primary">{Icon}</div>
      </div>
      {isLoading ? (
        <Skeleton className="h-8 w-16" />
      ) : (
        <div className="text-3xl font-bold text-foreground">{value}</div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const { data: membersData, isLoading: membersLoading } = useMembers()
  const { data: jobsData, isLoading: jobsLoading } = useJobs()
  const { data: contentsData, isLoading: contentsLoading } = useContents()
  const { data: galleryData, isLoading: galleryLoading } = useGallery()

  return (
    <div className="p-4 sm:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link href="/" passHref>
          <Button variant="ghost" className="btn-modern text-primary hover:bg-primary/10 font-semibold w-full sm:w-fit">
            ← Back to Home
          </Button>
        </Link>
        <div className="text-center sm:text-right">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">Dashboard</h1>
          <p className="text-foreground/60 mt-2 text-sm md:text-base">
            Welcome to the Chapakot Chamber of Commerce admin panel
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Members"
          value={membersData?.total || 0}
          icon={<Users className="h-5 w-5" />}
          isLoading={membersLoading}
        />
        <StatCard
          title="Active Jobs"
          value={jobsData?.total || 0}
          icon={<Briefcase className="h-5 w-5" />}
          isLoading={jobsLoading}
        />
        <StatCard
          title="Content Items"
          value={contentsData?.total || 0}
          icon={<Newspaper className="h-5 w-5" />}
          isLoading={contentsLoading}
        />
        <StatCard
          title="Gallery Items"
          value={galleryData?.total || 0}
          icon={<Image className="h-5 w-5" />}
          isLoading={galleryLoading}
        />
      </div>

      <div className="card-modern p-6 md:p-10 border-2 border-primary/10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Quick Stats</h2>
          <p className="text-foreground/70 mt-1">Recent activity overview</p>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
            <div className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full mt-1 flex-shrink-0" />
            <div className="text-sm text-foreground/75">
              You can manage members, jobs, news, and gallery items from the sidebar or mobile menu. Each section provides tools to create, update, and delete entries while maintaining data integrity.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
