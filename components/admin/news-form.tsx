'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { NewsSchema } from '@/lib/models'
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
import { generateNewsSlug } from '@/lib/slug-generator'
import { useState } from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface NewsFormProps {
  news?: any
  onClose: () => void
}

export default function NewsForm({ news, onClose }: NewsFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(NewsSchema.partial()),
    defaultValues: news || {
      published: true,
    },
  })

  const titleValue = watch('title') || ''

  // Auto-generate slug from title when title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    if (title && !news) {
      // Only auto-generate for new news, not edits
      const slug = generateNewsSlug(title)
      setValue('slug', slug)
    }
  }

  const onSubmit = async (data: any) => {
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)
    try {
      const url = news ? `/api/news/${news._id}` : '/api/news'
      const method = news ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          author: data.author || 'Admin',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Failed to save news')
        return
      }

      setSuccess(true)
      toast({
        title: 'Success',
        description: news ? 'News updated successfully' : 'News created successfully',
      })
      setTimeout(() => onClose(), 1500)
    } catch (error: any) {
      setError(error.message || 'An error occurred while saving')
      toast({
        title: 'Error',
        description: error.message || 'Failed to save news',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="border-green-600 bg-green-50 mb-4">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 text-sm">News saved successfully!</AlertDescription>
        </Alert>
      )}
      <div className="space-y-4 sm:space-y-6">
        {/* Title Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">News Title</label>
          <Input
            {...register('title')}
            onChange={handleTitleChange}
            placeholder="News headline"
            className={`h-11 sm:h-10 ${errors.title ? 'border-red-500' : ''}`}
          />
          {errors.title && (
            <span className="text-xs text-red-500 mt-1 block">{errors.title.message?.toString()}</span>
          )}
        </div>

        {/* Slug Section - Auto-generated, editable */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">URL Slug (Auto-generated from title)</label>
          <Input
            {...register('slug')}
            placeholder="url-slug-auto-generated"
            className="h-11 sm:h-10 font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">Auto-generated from title when creating new news. You can edit this manually if needed.</p>
        </div>

        {/* Excerpt Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Excerpt (Short Summary)</label>
          <Textarea
            {...register('excerpt')}
            placeholder="Brief summary for preview (shows in news list)"
            rows={2}
            className={`min-h-[60px] resize-none ${errors.excerpt ? 'border-red-500' : ''}`}
          />
          {errors.excerpt && (
            <span className="text-xs text-red-500 mt-1 block">{errors.excerpt.message?.toString()}</span>
          )}
          <p className="text-xs text-muted-foreground">100-150 characters recommended</p>
        </div>

        {/* Content Section - Enhanced for better editing */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Full Content</label>
          <div className="rounded-lg border border-input bg-slate-50 dark:bg-slate-900 p-3">
            <Textarea
              {...register('content')}
              placeholder="Write your full news article here. You can include HTML formatting if needed."
              rows={8}
              className={`min-h-[200px] sm:min-h-[240px] resize-none bg-white dark:bg-slate-800 font-mono text-sm ${errors.content ? 'border-red-500' : ''}`}
            />
            {errors.content && (
              <span className="text-xs text-red-500 mt-2 block">{errors.content.message?.toString()}</span>
            )}
            <p className="text-xs text-muted-foreground mt-2">💡 Tip: Use &lt;strong&gt;, &lt;em&gt;, or &lt;br&gt; tags for formatting</p>
          </div>
        </div>

        {/* Category and Image Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Category (Optional)</label>
            <Input
              {...register('category')}
              placeholder="E.g., Events, Announcements, Press Release"
              className="h-11 sm:h-10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Cover Image URL (Optional)</label>
            <Input
              {...register('image')}
              placeholder="https://example.com/image.jpg"
              type="url"
              className="h-11 sm:h-10"
            />
            <p className="text-xs text-muted-foreground">Leave blank for default image</p>
          </div>
        </div>

        {/* Publish Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Publish Status</label>
          <Select value={watch('published') ? 'yes' : 'no'} onValueChange={(value) => setValue('published', value === 'yes')}>
            <SelectTrigger className="h-11 sm:h-10">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">📢 Publish Immediately</SelectItem>
              <SelectItem value="no">📝 Keep as Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="h-11 sm:h-10 w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 sm:h-10 w-full sm:w-auto"
        >
          {isSubmitting ? 'Saving...' : news ? 'Update News' : 'Create News'}
        </Button>
      </div>
    </form>
  )
}
