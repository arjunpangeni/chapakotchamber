import { Skeleton } from '@/components/ui/skeleton'

export default function LoadingNews() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-12">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-5 w-[460px] max-w-full" />
      </div>

      <div className="rounded-2xl border border-primary/10 bg-white/70 p-4 md:p-5 space-y-3">
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
        <div className="grid md:grid-cols-12 gap-3">
          <Skeleton className="h-9 md:col-span-8" />
          <Skeleton className="h-9 md:col-span-2" />
          <Skeleton className="h-9 md:col-span-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-primary/10 bg-white/70 overflow-hidden">
            <Skeleton className="h-64 w-full" />
            <div className="p-6 space-y-3">
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
