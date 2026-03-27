import { Skeleton } from '@/components/ui/skeleton'

export default function LoadingMembers() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12">
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-5 w-[460px] max-w-full" />
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-primary/10 bg-white/70 p-6 space-y-4">
            <div className="flex gap-3">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </div>
  )
}
