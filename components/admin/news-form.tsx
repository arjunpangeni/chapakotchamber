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
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">News Title</label>
          <Input
            {...register('title')}
            placeholder="News headline"
            className={`h-11 sm:h-10 ${errors.title ? 'border-red-500' : ''}`}
          />
          {errors.title && (
            <span className="text-xs text-red-500 mt-1 block">{errors.title.message?.toString()}</span>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Excerpt (Short Summary)</label>
          <Textarea
            {...register('excerpt')}
            placeholder="Brief summary for preview"
            rows={3}
            className={`dark:text-foreground min-h-[60px] sm:min-h-[50px] resize-none`}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Content</label>
          <Textarea
            {...register('content')}
            placeholder="Full news article content"
            rows={6}
            className={`dark:text-foreground min-h-[120px] sm:min-h-[100px] resize-none ${errors.content ? 'border-red-500' : ''}`}
          />
          {errors.content && (
            <span className="text-xs text-red-500 mt-1 block">{errors.content.message?.toString()}</span>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Excerpt (Short Summary)</label>
          <Textarea
            {...register('excerpt')}
            placeholder="Brief summary for preview"
            rows={2}
            className="dark:text-foreground"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Content</label>
          <Textarea
            {...register('content')}
            placeholder="Full news article content"
            rows={6}
            className={`dark:text-foreground ${errors.content ? 'border-red-500' : ''}`}
          />
          {errors.content && (
            <span className="text-xs text-red-500">{errors.content.message?.toString()}</span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Category</label>
            <Input
              {...register('category')}
              placeholder="E.g., Events, Announcements, Press Release"
              className="h-11 sm:h-10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Image URL</label>
            <Input
              {...register('image')}
              placeholder="Image URL"
              type="url"
              className="h-11 sm:h-10"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Publish</label>
            <Select value={watch('published') ? 'yes' : 'no'} onValueChange={(value) => setValue('published', value === 'yes')}>
              <SelectTrigger className="h-11 sm:h-10">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Publish Immediately</SelectItem>
                <SelectItem value="no">Keep as Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

          <div>
            <label className="text-sm font-medium text-foreground">Image URL</label>
            <Input
              {...register('image')}
              placeholder="Image URL"
              type="url"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Publish</label>
          <Select value={watch('published') ? 'yes' : 'no'} onValueChange={(value) => setValue('published', value === 'yes')}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Publish Immediately</SelectItem>
              <SelectItem value="no">Keep as Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
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
