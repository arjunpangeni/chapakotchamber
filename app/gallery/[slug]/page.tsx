import { getGalleryBySlug } from '@/lib/server-data'
import AlbumClient from './album-client'

export const revalidate = 3600

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const album = await getGalleryBySlug(slug)

  return <AlbumClient initialAlbum={album} />
}
