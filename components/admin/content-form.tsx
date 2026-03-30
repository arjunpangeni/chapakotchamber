'use client'

import { useState, useEffect, useRef } from 'react'
import RichTextEditor from '@/components/admin/rich-text-editor'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface Props {
  content?: any
  onSave: () => void
  onClose: () => void
}

const normalizeFormState = (source: any) => ({
  title: source?.title ?? '',
  slug: source?.slug ?? '',
  content: source?.content ?? '',
  type: source?.type ?? 'news',
  image: source?.image ?? '',
  authorName: source?.authorName ?? '',
  isPinned: !!source?.isPinned,
  expiresAt: source?.expiresAt ?? '',
  published: source?.published ?? true,
})

export default function ContentForm({ content, onSave, onClose }: Props) {
  const { toast } = useToast()
  const [form, setForm] = useState<any>(normalizeFormState(null))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [draftStatus, setDraftStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'restored'>('idle')
  const [isImageUploading, setIsImageUploading] = useState(false)
  const [imageUploadProgress, setImageUploadProgress] = useState(0)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const draftKey = `content-draft-${content?._id || 'new'}`

  useEffect(() => {
    if (content) {
      setForm(normalizeFormState(content))
    } else {
      const saved = typeof window !== 'undefined' ? localStorage.getItem(draftKey) : null
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setForm(normalizeFormState(parsed))
          setDraftStatus('restored')
        } catch (e) {
          console.error('Draft parse error', e)
        }
      }
    }
  }, [content, draftKey])

  useEffect(() => {
    if (!content && form.title && !form.slug) {
      const slug = form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setForm((prev: any) => ({ ...prev, slug }))
    }
  }, [form.title, content])

  useEffect(() => {
    if (draftStatus === 'restored') return

    setDraftStatus('saving')
    const timer = setTimeout(() => {
      try {
        const payload = {
          title: form.title,
          slug: form.slug,
          content: form.content,
          type: form.type,
          image: form.image,
          authorName: form.authorName,
          isPinned: form.isPinned,
          expiresAt: form.expiresAt || null,
          published: form.published,
          updatedAt: new Date().toISOString(),
        }
        localStorage.setItem(draftKey, JSON.stringify(payload))
        setDraftStatus('saved')
      } catch (err) {
        console.error('Draft save error', err)
        setDraftStatus('error')
      }
    }, 2200)

    return () => clearTimeout(timer)
  }, [form, draftKey])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.type === 'article' && !form.authorName?.trim()) {
      toast({ title: 'Validation error', description: 'Author name is required for articles', variant: 'destructive' })
      return
    }
    setIsSubmitting(true)
    try {
      const payload = {
        ...form,
        isPinned: !!form.isPinned,
        expiresAt: form.expiresAt || null,
      }

      const url = content ? `/api/contents/${content._id}` : '/api/contents'
      const method = content ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save content')
      }

      toast({ title: 'Success', description: 'Content saved successfully' })
      if (typeof window !== 'undefined') {
        localStorage.removeItem(draftKey)
      }
      setDraftStatus('saved')
      onSave()
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to save', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resizeImage = (file: File, maxWidth = 1600): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(img.width * scale))
        canvas.height = Math.max(1, Math.round(img.height * scale))
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas context failed'))
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Blob conversion failed'))
          resolve(blob)
        }, 'image/jpeg', 0.85)
      }
      img.onerror = () => reject(new Error('Image load failed'))
      img.src = URL.createObjectURL(file)
    })
  }

  const uploadImage = async (file: File) => {
    const resizedBlob = await resizeImage(file, 1600)
    const resizedFile = new File([resizedBlob], file.name, { type: 'image/jpeg' })
    const formData = new FormData()
    formData.append('file', resizedFile)
    const response = await fetch(`/api/upload?folder=${encodeURIComponent('contents')}`, {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) {
      throw new Error('Image upload failed')
    }
    return response.json()
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsImageUploading(true)
    setImageUploadProgress(30)
    try {
      const uploaded = await uploadImage(file)
      setForm((prev: any) => ({ ...prev, image: uploaded.secure_url || '' }))
      setImageUploadProgress(100)
      toast({ title: 'Image uploaded', description: 'Photo uploaded to Cloudinary successfully' })
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message || 'Unable to upload image', variant: 'destructive' })
    } finally {
      setTimeout(() => setImageUploadProgress(0), 500)
      setIsImageUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-foreground">Title *</Label>
        <Input value={form.title ?? ''} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
      </div>
      <div>
        <Label className="text-foreground">Slug *</Label>
        <Input value={form.slug ?? ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
      </div>
      <div>
        <Label className="text-foreground">Type *</Label>
        <Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value })}>
          <SelectTrigger><SelectValue placeholder="Choose type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="news">News</SelectItem>
            <SelectItem value="notice">Notice</SelectItem>
            <SelectItem value="article">Article</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-foreground">Featured Image</Label>
        <Input
          type="url"
          value={form.image ?? ''}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          placeholder="https://example.com/photo.jpg"
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => imageInputRef.current?.click()}
            disabled={isImageUploading}
          >
            {isImageUploading ? 'Uploading...' : 'Upload to Cloudinary'}
          </Button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          {imageUploadProgress > 0 && (
            <span className="text-xs text-muted-foreground">Upload: {imageUploadProgress}%</span>
          )}
        </div>
        {form.image && (
          <img
            src={form.image}
            alt="Preview"
            className="mt-3 h-32 w-full rounded-md border object-cover"
          />
        )}
      </div>
      {form.type === 'article' && (
        <div>
          <Label className="text-foreground">Author Name</Label>
          <Input value={form.authorName ?? ''} onChange={(e) => setForm({ ...form, authorName: e.target.value })} required />
        </div>
      )}
      {form.type === 'notice' && (
        <div>
          <Label className="text-foreground">Expires At</Label>
          <Input type="date" value={form.expiresAt ?? ''} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
        </div>
      )}
      <div>
        <Label className="text-foreground">Content (HTML)</Label>
        <RichTextEditor
          value={form.content}
          onChange={(value) => setForm({ ...form, content: value })}
          onSaveStatusChange={(status) => setDraftStatus(status)}
        />
        <p className="mt-1 text-xs text-muted-foreground">Draft status: {draftStatus}</p>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Checkbox checked={form.isPinned} onCheckedChange={(checked) => setForm({ ...form, isPinned: !!checked })} />
          <span className="text-foreground">Pin to top</span>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox checked={form.published} onCheckedChange={(checked) => setForm({ ...form, published: !!checked })} />
          <span className="text-foreground">Published</span>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting || isImageUploading}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
