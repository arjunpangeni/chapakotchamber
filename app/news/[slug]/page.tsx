import { getContentBySlug } from '@/lib/server-data'
import NewsDetailClient from './news-detail-client'

export const revalidate = 3600

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const content = await getContentBySlug(slug)

  return <NewsDetailClient initialContent={content} />
}
