import { Skeleton } from '@/components/ui/skeleton'

export default function LoadingJobs() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-[420px] max-w-full" />
      </div>

      <div className="rounded-2xl border border-primary/10 bg-white/70 p-4 md:p-5 space-y-3">
        <Skeleton className="h-4 w-40" />
        <div className="grid md:grid-cols-12 gap-3">
          <Skeleton className="h-9 md:col-span-5" />
          <Skeleton className="h-9 md:col-span-3" />
          <Skeleton className="h-9 md:col-span-2" />
          <Skeleton className="h-9 md:col-span-2" />
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-primary/10 bg-white/70 p-5 space-y-3">
            <div className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  )
}
