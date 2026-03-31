'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGallery } from '@/hooks/useApi'
import { useDebounce } from '@/hooks/useDebounce'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Edit, Eye, Search } from 'lucide-react'
import GalleryForm from '@/components/admin/gallery-form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import DeleteConfirmDialog from '@/components/admin/delete-confirm-dialog'
import cloudinaryLoader from '@/lib/cloudinary-loader'

export default function GalleryPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null)
  const [albumToDelete, setAlbumToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Import useDebounce if not already imported
  const debouncedSearch = useDebounce(search, 300)
  
  const { data, mutate, isLoading } = useGallery(page, category, debouncedSearch)

  const handleAddNew = () => {
    setSelectedAlbum(null)
    setShowForm(true)
  }

  const handleViewAlbum = (slug: string) => {
    router.push(`/gallery/${slug}`)
  }

  const handleEdit = (album: any) => {
    setSelectedAlbum(album)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!albumToDelete?._id) return
    setIsDeleting(true)
    try {
      await fetch(`/api/gallery/${albumToDelete._id}`, { method: 'DELETE' })
      setAlbumToDelete(null)
      mutate()
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setSelectedAlbum(null)
    mutate()
  }

  return (
    <div className="p-3 sm:p-4 md:p-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Photo Gallery</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">Manage gallery albums and images</p>
        </div>
        <Button onClick={handleAddNew} className="w-full sm:w-fit gap-2">
          <Plus className="w-4 h-4" />
          <span>New Album</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by event name or description..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-10"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Filter by Category</label>
            <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={category === '' ? 'default' : 'outline'}
              onClick={() => {
                setCategory('')
                setPage(1)
              }}
            >
              All
            </Button>
            {['Events', 'Meetings', 'Awards', 'Training', 'Other'].map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={category === cat ? 'default' : 'outline'}
                onClick={() => {
                  setCategory(cat)
                  setPage(1)
                }}
                className="text-xs md:text-sm"
              >
                {cat}
              </Button>
            ))}
          </div>          </div>        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : data?.albums?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.albums.map((album: any) => (
              <Card key={album._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-40 bg-muted cursor-pointer" onClick={() => handleViewAlbum(album.eventSlug)}>
                  {album.coverImage ? (
                    <Image
                      src={album.coverImage}
                      loader={cloudinaryLoader}
                      alt={album.eventName}
                      fill
                      sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">No cover</div>
                  )}
                </div>
                <CardContent className="p-4 space-y-2">
                  <h3 className="text-base sm:text-lg font-semibold line-clamp-2">{album.eventName}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{album.imageCount || 0} images</p>
                  {album.category && <p className="text-xs text-muted-foreground">Category: {album.category}</p>}
                  <div className="flex gap-2 pt-2 justify-end">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      aria-label="View album"
                      onClick={() => handleViewAlbum(album.eventSlug)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      aria-label="Edit album"
                      onClick={() => handleEdit(album)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-9 w-9"
                      aria-label="Delete album"
                      onClick={() => setAlbumToDelete(album)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {data?.pages && data.pages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center gap-2">
              <Button variant="outline" disabled={page === 1} className="w-full sm:w-fit" onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <span className="flex items-center justify-center px-4 text-sm md:text-base">Page {page} of {data.pages}</span>
              <Button variant="outline" disabled={page === data.pages} className="w-full sm:w-fit" onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">
            No gallery albums found
          </CardContent>
        </Card>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent
          className="w-[95vw] sm:w-[90vw] md:max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6"
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {selectedAlbum ? 'Edit Album' : 'Create Album'}
            </DialogTitle>
            <DialogDescription>
              Upload cover, set category, and add album details.
            </DialogDescription>
          </DialogHeader>
          <GalleryForm
            item={selectedAlbum}
            onClose={handleFormClose}
          />
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={Boolean(albumToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setAlbumToDelete(null)
        }}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Delete album?"
        itemLabel={albumToDelete?.eventName || 'this album'}
        description={`This will permanently remove ${albumToDelete?.eventName || 'this album'} and its gallery data.`}
      />
    </div>
  )
}

