import { Metadata } from 'next'

interface HeadProps {
  params: { slug: string }
}

export default async function Head({ params }: HeadProps) {
  const slug = params.slug
  const res = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/gallery?slug=${encodeURIComponent(slug)}`, {
    cache: 'no-store',
  })

  const data = res.ok ? await res.json() : null
  const album = data?.album
  const title = album ? `${album.eventName} · Chapakot Gallery` : 'Gallery Album · Chapakot'
  const description = album?.description || 'Explore photo albums from Chapakot community events.'

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/gallery/${slug}`} />
      <meta property="og:image" content={album?.images?.[0]?.url || ''} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  )
}
