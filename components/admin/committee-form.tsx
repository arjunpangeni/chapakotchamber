'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CommitteeMemberSchema } from '@/lib/models'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useState, useRef } from 'react'
import { AlertCircle, CheckCircle, Upload, X } from 'lucide-react'
import Image from 'next/image'

interface CommitteeFormProps {
  member?: any
  onClose: () => void
  onSuccess?: () => void
}

export default function CommitteeForm({ member, onClose, onSuccess }: CommitteeFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(CommitteeMemberSchema),
    defaultValues: member || {
      name: '',
      role: '',
      image: '',
      type: 'current',
      tenure: '',
      priority: 50,
    },
  })

  const type = watch('type')

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setValue('image', data.url)
      toast({
        title: 'Image uploaded',
        description: 'Image has been uploaded successfully.',
      })
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const url = member ? `/api/committee/${member._id}` : '/api/committee'
      const method = member ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save committee member')
      }

      setSuccess(true)
      toast({
        title: 'Success',
        description: `Committee member ${member ? 'updated' : 'created'} successfully.`,
      })

      if (onSuccess) onSuccess()
      onClose()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Name</label>
          <Input {...register('name')} placeholder="Enter name" className="h-11 sm:h-10" />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Role</label>
          <Input {...register('role')} placeholder="Enter role" className="h-11 sm:h-10" />
          {errors.role && (
            <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Type</label>
        <Select onValueChange={(value) => setValue('type', value)} defaultValue={type}>
          <SelectTrigger className="h-11 sm:h-10">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Committee</SelectItem>
            <SelectItem value="past">Past President</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
        )}
      </div>

      {type === 'past' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Tenure</label>
          <Input {...register('tenure')} placeholder="e.g., 2076-2080" className="h-11 sm:h-10" />
          {errors.tenure && (
            <p className="text-sm text-red-500 mt-1">{errors.tenure.message}</p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Display Priority</label>
        <Input
          {...register('priority', { valueAsNumber: true })}
          type="number"
          placeholder="1-100 (lower number = higher priority)"
          className="h-11 sm:h-10"
          min="1"
          max="100"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Lower numbers appear first. President should have priority 1, Vice President 2, etc.
        </p>
        {errors.priority && (
          <p className="text-sm text-red-500 mt-1">{errors.priority.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Image</label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver ? 'border-sky-500 bg-sky-50 dark:bg-sky-950' : 'border-gray-300 dark:border-gray-600'
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            const file = e.dataTransfer.files[0]
            if (file) handleImageUpload({ target: { files: [file] } } as any)
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          {watch('image') ? (
            <div className="space-y-2">
              <div className="relative w-24 h-24 mx-auto">
                <Image
                  src={watch('image')}
                  alt="Preview"
                  fill
                  className="object-cover rounded"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setValue('image', '')
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Click to change or drag new image</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 mx-auto text-gray-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {uploading ? 'Uploading...' : 'Click to upload or drag and drop image'}
              </p>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <Input {...register('image')} placeholder="Or enter image URL" className="mt-2" />
        {errors.image && (
          <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Committee member saved successfully!</AlertDescription>
        </Alert>
      )}

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
          {isSubmitting ? 'Saving...' : member ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  )
}