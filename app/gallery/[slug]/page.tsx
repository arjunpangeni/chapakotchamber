import { auth } from '@/auth'
import { getActiveJobsCount, getGalleryBySlug } from '@/lib/server-data'
import AlbumClient from './album-client'

export const revalidate = 3600

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const [album, session, activeJobsCount] = await Promise.all([
    getGalleryBySlug(slug),
    auth(),
    getActiveJobsCount(),
  ])

  return (
    <AlbumClient
      initialAlbum={album}
      session={session}
      activeJobsCount={activeJobsCount}
    />
  )
}
