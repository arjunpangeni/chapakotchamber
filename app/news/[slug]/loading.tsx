import { Skeleton } from '@/components/ui/skeleton'

export default function LoadingNewsDetail() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-10">
      <Skeleton className="h-72 w-full" />
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-11/12" />
    </div>
  )
}
