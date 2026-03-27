import { Skeleton } from '@/components/ui/skeleton'

export default function LoadingGallery() {
  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-12">
      <div className="space-y-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-[440px] max-w-full" />
      </div>

      <div className="rounded-2xl border border-primary/10 bg-white/70 p-4 md:p-5">
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-primary/10 bg-white/70 overflow-hidden">
            <Skeleton className="h-56 w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
