'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MemberSchema } from '@/lib/models'
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

const businessTypes = [
  'Supermarket',
  'Retail',
  'Restaurant',
  'Service',
  'Manufacturing',
  'Tourism',
  'Technology',
  'Education',
  'Healthcare',
  'Agriculture',
  'Finance',
  'Other',
]

const wards = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 6', 'Ward 7', 'Ward 8', 'Ward 9', 'Ward 10']

interface MemberFormProps {
  member?: any
  onClose: () => void
}

export default function MemberForm({ member, onClose }: MemberFormProps) {
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
    resolver: zodResolver(MemberSchema),
    defaultValues: member || {
      businessType: 'Retail',
      ward: 'Ward 1',
      membershipStatus: 'active',
    },
  })

  const onSubmit = async (data: any) => {
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)
    try {
      const url = member ? `/api/members/${member._id}` : '/api/members'
      const method = member ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Failed to save member')
        return
      }

      setSuccess(true)
      toast({
        title: 'Success',
        description: member ? 'Member updated successfully' : 'Member created successfully',
      })
      setTimeout(() => onClose(), 1500)
    } catch (error: any) {
      setError(error.message || 'An error occurred while saving')
      toast({
        title: 'Error',
        description: error.message || 'Failed to save member',
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
          <AlertDescription className="text-green-800 text-sm">Member saved successfully!</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Business Name</label>
          <Input
            {...register('businessName')}
            placeholder="Business name"
            className={`h-11 sm:h-10 ${errors.businessName ? 'border-red-500' : ''}`}
          />
          {errors.businessName && (
            <span className="text-xs text-red-500 mt-1 block">{errors.businessName.message?.toString()}</span>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Owner Name</label>
          <Input
            {...register('ownerName')}
            placeholder="Owner name"
            className={`h-11 sm:h-10 ${errors.ownerName ? 'border-red-500' : ''}`}
          />
          {errors.ownerName && (
            <span className="text-xs text-red-500 mt-1 block">{errors.ownerName.message?.toString()}</span>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Email</label>
          <Input
            {...register('email')}
            type="email"
            placeholder="Email"
            className={`h-11 sm:h-10 ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && (
            <span className="text-xs text-red-500 mt-1 block">{errors.email.message?.toString()}</span>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Phone</label>
          <Input
            {...register('phone')}
            placeholder="Phone number"
            className={`h-11 sm:h-10 ${errors.phone ? 'border-red-500' : ''}`}
          />
          {errors.phone && (
            <span className="text-xs text-red-500 mt-1 block">{errors.phone.message?.toString()}</span>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Business Type</label>
          <Select value={watch('businessType') || ''} onValueChange={(value) => setValue('businessType', value)}>
            <SelectTrigger className="h-11 sm:h-10">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {businessTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.businessType && (
            <span className="text-xs text-red-500 mt-1 block">{errors.businessType.message?.toString()}</span>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Ward</label>
          <Select value={watch('ward') || ''} onValueChange={(value) => setValue('ward', value)}>
            <SelectTrigger className="h-11 sm:h-10">
              <SelectValue placeholder="Select ward" />
            </SelectTrigger>
            <SelectContent>
              {wards.map((ward) => (
                <SelectItem key={ward} value={ward}>
                  {ward}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.ward && (
            <span className="text-xs text-red-500 mt-1 block">{errors.ward.message?.toString()}</span>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Address</label>
          <Input
            {...register('address')}
            placeholder="Address"
            className={`h-11 sm:h-10 ${errors.address ? 'border-red-500' : ''}`}
          />
          {errors.address && (
            <span className="text-xs text-red-500 mt-1 block">{errors.address.message?.toString()}</span>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Description</label>
          <Textarea
            {...register('description')}
            placeholder="Business description"
            rows={4}
            className="min-h-[80px] sm:min-h-[60px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Website</label>
          <Input
            {...register('website')}
            placeholder="https://example.com"
            type="url"
            className="h-11 sm:h-10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Membership Status</label>
          <Select value={watch('membershipStatus') || 'active'} onValueChange={(value) => setValue('membershipStatus', value)}>
            <SelectTrigger className="h-11 sm:h-10">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
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
          {isSubmitting ? 'Saving...' : member ? 'Update Member' : 'Add Member'}
        </Button>
      </div>
    </form>
  )
}
