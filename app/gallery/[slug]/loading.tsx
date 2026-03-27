import { Skeleton } from '@/components/ui/skeleton'

export default function LoadingAlbumDetail() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <Skeleton className="h-10 w-2/3" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="aspect-video w-full" />
        ))}
      </div>
    </div>
  )
}
