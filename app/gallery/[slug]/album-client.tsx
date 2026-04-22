'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Footer from '@/components/public/footer'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import cloudinaryLoader from '@/lib/cloudinary-loader'

export default function AlbumClient({
  initialAlbum,
}: {
  initialAlbum: any | null
}) {
  const router = useRouter()
  const [album] = useState<any>(initialAlbum)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<any>(null)

  const [activeIndex, setActiveIndex] = useState<number>(0)

  const openLightbox = (index: number) => {
    setActiveIndex(index)
    setSelectedImage(album?.images?.[index] || null)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setSelectedImage(null)
  }

  const showPrev = () => {
    if (!album?.images?.length) return
    const nextIndex = (activeIndex - 1 + album.images.length) % album.images.length
    setActiveIndex(nextIndex)
    setSelectedImage(album.images[nextIndex])
  }

  const showNext = () => {
    if (!album?.images?.length) return
    const nextIndex = (activeIndex + 1) % album.images.length
    setActiveIndex(nextIndex)
    setSelectedImage(album.images[nextIndex])
  }

  const [touchStartX, setTouchStartX] = useState<number | null>(null)

  useEffect(() => {
    if (!lightboxOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        showPrev()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        showNext()
      } else if (event.key === 'Escape') {
        event.preventDefault()
        closeLightbox()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxOpen, activeIndex, album])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.changedTouches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX
    if (deltaX > 50) showPrev()
    else if (deltaX < -50) showNext()
    setTouchStartX(null)
  }

  if (!album) {
    return (
      <div className="min-h-screen public-sky">
        <main className="max-w-6xl mx-auto px-4 py-12 text-center">Album not found</main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen public-sky">
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{album.eventName}</h1>
            <p className="text-muted-foreground mt-1">{album.description}</p>
            <p className="text-sm text-muted-foreground">{album.images?.length || 0} photos</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/gallery')}>
              Back
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {album.images?.map((img: any, index: number) => (
            <div
              key={`${img.publicId || index}`}
              className="relative overflow-hidden rounded-lg border border-border bg-white shadow-sm cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <div className="relative aspect-video">
                <Image
                  src={img.url}
                  loader={cloudinaryLoader}
                  alt={img.caption || `${album.eventName} image ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                  loading="lazy"
                  placeholder={img.blurDataURL ? 'blur' : 'empty'}
                  blurDataURL={img.blurDataURL || ''}
                />
              </div>
              <div className="p-2">
                <p className="text-sm text-muted-foreground line-clamp-1">{img.caption || `Image ${index + 1}`}</p>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent
            className="w-[94vw] sm:w-[90vw] md:max-w-4xl max-h-[86vh] p-0 overflow-hidden border border-slate-700 bg-slate-950 [&>button]:hidden"
          >
            <DialogHeader>
              <DialogTitle className="text-white">{selectedImage?.caption || ''}</DialogTitle>
              <DialogDescription className="text-white/70">
                Swipe or use the arrows to navigate photos.
              </DialogDescription>
            </DialogHeader>
            <div
              className="relative h-[56vh] w-full sm:h-[66vh] md:h-[70vh]"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <button
                onClick={closeLightbox}
                className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-base font-bold text-slate-900 shadow-md transition hover:bg-white"
                aria-label="Close viewer"
              >
                ×
              </button>

              {selectedImage && (
                <Image
                  src={selectedImage.url}
                  loader={cloudinaryLoader}
                  alt={selectedImage.caption || 'Lightbox image'}
                  fill
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 88vw, 1280px"
                  className="object-contain p-2 sm:p-3"
                  loading="lazy"
                />
              )}

              <button
                onClick={showPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-black/70"
                aria-label="Previous image"
              >
                Prev
              </button>
              <button
                onClick={showNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-black/70"
                aria-label="Next image"
              >
                Next
              </button>
            </div>
            <div className="flex items-center justify-between bg-slate-950 p-3">
              <span className="text-xs text-white">
                {activeIndex + 1} / {album.images?.length}
              </span>
              <Button variant="outline" className="border-slate-600 bg-slate-900 text-slate-100 hover:bg-slate-800" onClick={closeLightbox}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  )
}

