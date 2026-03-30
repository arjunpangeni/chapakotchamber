'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { GalleryAlbumSchema } from '@/lib/models'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { generateGallerySlug } from '@/lib/slug-generator'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface GalleryFormProps {
  item?: any
  onClose: () => void
}

export default function GalleryForm({ item, onClose }: GalleryFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [images, setImages] = useState<any[]>(
    item?.images || []
  )
  const [uploadQueue, setUploadQueue] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(GalleryAlbumSchema.partial()),
    defaultValues: {
      eventName: item?.eventName || '',
      eventSlug: item?.eventSlug || '',
      description: item?.description || '',
      category: item?.category || '',
    },
  })

  // Auto-generate slug from event name
  const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const eventName = e.target.value
    if (eventName && !item) {
      // Only auto-generate for new albums, not edits
      const slug = generateGallerySlug(eventName)
      setValue('eventSlug', slug)
    }
  }

  const normalizeSlug = (value: string) =>
    (value || '')
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  // Supported image MIME types
  const SUPPORTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

  const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (!SUPPORTED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `File type "${file.type || 'unknown'}" not supported. Supported types: JPEG, PNG, WebP, GIF`,
      }
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds max limit of 50MB`,
      }
    }

    return { valid: true }
  }

  const resizeImage = (file: File, maxWidth = 1600): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      const timeoutId = setTimeout(() => {
        reject(new Error('Image loading timeout - file may be corrupted'))
      }, 10000) // 10 second timeout

      img.onload = () => {
        clearTimeout(timeoutId)
        try {
          const scale = Math.min(1, maxWidth / img.width)
          const canvas = document.createElement('canvas')
          canvas.width = img.width * scale
          canvas.height = img.height * scale
          const ctx = canvas.getContext('2d')
          if (!ctx) return reject(new Error('Canvas context failed'))
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('Blob conversion failed'))
            resolve(blob)
          }, 'image/jpeg', 0.85)
        } catch (err) {
          reject(new Error(`Image processing failed: ${(err as Error).message}`))
        }
      }
      img.onerror = () => {
        clearTimeout(timeoutId)
        reject(new Error('Failed to load image - file may be corrupted or unsupported format'))
      }
      img.onabort = () => {
        clearTimeout(timeoutId)
        reject(new Error('Image loading was aborted'))
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const uploadFile = async (file: File, folder: string) => {
    // Validate file before processing
    const validation = validateImageFile(file)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    // Try to resize, with graceful fallback
    let uploadFile = file
    try {
      const resizedBlob = await resizeImage(file, 1600)
      uploadFile = new File([resizedBlob], file.name, { type: 'image/jpeg' })
    } catch (err) {
      console.warn('Image resize failed, uploading original:', err)
      // If resize fails, try uploading original file
      // This handles animated GIFs and other special formats
      if (file.type === 'image/gif') {
        toast({
          title: 'GIF Warning',
          description: 'Animated GIF files are uploaded as-is without resizing',
        })
      }
    }

    const formData = new FormData()
    formData.append('file', uploadFile)

    const response = await fetch(`/api/upload?folder=${encodeURIComponent(folder)}`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    return {
      url: data.secure_url,
      publicId: data.public_id,
      // Don't store blurDataURL to avoid MongoDB 16MB document size limit with large albums
      blurDataURL: '',
    }
  }

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    // Validate all files first
    const validFiles: File[] = []
    const invalidErrors: string[] = []

    for (const file of files) {
      const validation = validateImageFile(file)
      if (validation.valid) {
        validFiles.push(file)
      } else {
        invalidErrors.push(`${file.name}: ${validation.error}`)
      }
    }

    // Show error if there are invalid files
    if (invalidErrors.length > 0) {
      const errorMessage = invalidErrors.slice(0, 3).join('\n') 
        + (invalidErrors.length > 3 ? `\n...and ${invalidErrors.length - 3} more` : '')
      setError(errorMessage)
      toast({
        title: 'Some files were not valid',
        description: invalidErrors[0],
        variant: 'destructive',
      })
    }

    // Only add valid files
    if (validFiles.length > 0) {
      setUploadQueue((prev) => [...prev, ...validFiles])

      const previews = validFiles.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        file,
      }))

      setImages((prev) => [...prev, ...previews])
      
      if (invalidErrors.length === 0) {
        setError(null) // Clear error if all files are valid
      }
    }

    // Reset input
    e.target.value = ''
  }

  const onSubmit = async (data: any) => {
    if (!data.eventName?.trim()) {
      setError('Event name is required')
      return
    }

    if (!data.category?.trim()) {
      setError('Category is required')
      return
    }

    if (images.length === 0) {
      setError('At least one photo is required')
      return
    }

    const normalizedSlug = normalizeSlug(data.eventSlug || data.eventName)

    if (!normalizedSlug) {
      setError('Event slug is required')
      return
    }

    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    try {
      setIsUploading(true)
      setUploadProgress(0)

      const folder = `gallery/${normalizedSlug}`
      const keptImages = images.filter((img) => !img.file)
      const uploadedImages = []

      for (let i = 0; i < uploadQueue.length; i += 1) {
        const img = await uploadFile(uploadQueue[i], folder)
        uploadedImages.push(img)
        setUploadProgress(Math.round(((i + 1) / uploadQueue.length) * 100))
      }

      const payload = {
        eventName: data.eventName,
        eventSlug: normalizedSlug,
        description: data.description || '',
        category: data.category || '',
        images: [...keptImages, ...uploadedImages],
      }

      const url = item ? `/api/gallery/${item._id}` : '/api/gallery'
      const method = item ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Failed to save gallery item')
        return
      }

      setSuccess(true)
      toast({
        title: 'Success',
        description: item
          ? 'Gallery item updated successfully'
          : 'Gallery item created successfully',
      })
      setTimeout(() => onClose(), 1500)
    } catch (error: any) {
      setError(error.message || 'An error occurred while saving')
      toast({
        title: 'Error',
        description: error.message || 'Failed to save',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="border-green-600 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">Album saved successfully!</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Event Name / Album Title *</label>
          <Input
            {...register('eventName')}
            onChange={handleEventNameChange}
            placeholder="e.g., Annual Conference 2024"
            className={errors.eventName ? 'border-red-500' : ''}
          />
          {errors.eventName && (
            <span className="text-xs text-red-500">{errors.eventName.message?.toString()}</span>
          )}
          <p className="text-xs text-muted-foreground mt-1">Required - Album name</p>
        </div>

        <div>
          <label className="text-sm font-medium">URL Slug (Auto-generated)</label>
          <Input
            {...register('eventSlug')}
            placeholder="auto-generated-slug"
            onBlur={(e) => {
              const cleaned = generateGallerySlug(e.target.value || watch('eventName') || '')
              setValue('eventSlug', cleaned, { shouldValidate: true })
            }}
            className={errors.eventSlug ? 'border-red-500' : ''}
          />
          {errors.eventSlug && (
            <span className="text-xs text-red-500">{errors.eventSlug.message?.toString()}</span>
          )}
          <p className="text-xs text-muted-foreground mt-1">Auto-generated from title when creating new album.</p>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          {...register('description')}
          placeholder="Event description"
          rows={3}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Category *</label>
        <Select value={watch('category') || ''} onValueChange={(value) => setValue('category', value, { shouldValidate: true })}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Events">Events</SelectItem>
            <SelectItem value="Meetings">Meetings</SelectItem>
            <SelectItem value="Awards">Awards</SelectItem>
            <SelectItem value="Training">Training</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">Required - Select album category</p>
      </div>

      <div>
        <label className="text-sm font-medium">Upload Images *</label>
        <p className="text-xs text-muted-foreground mb-2">Required - At least 1 photo must be uploaded</p>
        <div
          className="p-4 border border-dashed rounded-md cursor-pointer bg-background/80 hover:bg-background/90 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <p className="text-sm text-muted-foreground">Drag and drop images here or click to select multiple files.</p>
          <p className="text-xs text-muted-foreground mt-1">Supported: JPEG, PNG, WebP, GIF (max 50MB each)</p>
          {images.length > 0 && (
            <p className="text-xs text-green-600 font-semibold mt-2">✓ {images.length} photo(s) selected</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={handleFilesSelected}
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((image, index) => (
          <div key={`${image.url}-${index}`} className="relative rounded-lg overflow-hidden border border-border">
            <Image
              src={image.url}
              alt={image.caption || `Photo ${index + 1}`}
              width={300}
              height={200}
              className="object-cover w-full h-40"
              loading="lazy"
            />
            <button
              type="button"
              onClick={async () => {
                const removed = images[index]
                setImages((prev) => prev.filter((_, i) => i !== index))
                if (removed?.file) {
                  setUploadQueue((prev) => prev.filter((f) => f !== removed.file))
                }

                if (removed?.publicId) {
                  try {
                    await fetch('/api/gallery/image', {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ publicId: removed.publicId }),
                    })
                    toast({
                      title: 'Deleted',
                      description: 'Image deleted from Cloudinary',
                    })
                  } catch (err) {
                    console.error('Cloudinary delete failed:', err)
                    toast({
                      title: 'Warning',
                      description: 'Image removed locally but Cloudinary delete failed',
                      variant: 'destructive',
                    })
                  }
                }
              }}
              className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {isUploading && (
        <div className="text-sm text-muted-foreground">Uploading: {uploadProgress}%</div>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isUploading}>
          {isSubmitting ? 'Saving...' : item ? 'Update Album' : 'Create Album'}
        </Button>
      </div>
    </form>
  )
}
