'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { JobSchema } from '@/lib/models'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { useToast } from '@/hooks/use-toast'
import { useMembersAll } from '@/hooks/useApi'
import { useMemo, useState } from 'react'
import { AlertCircle, Check, CheckCircle, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface JobFormProps {
  job?: any
  onClose: () => void
}

export default function JobForm({ job, onClose }: JobFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [companyOpen, setCompanyOpen] = useState(false)
  const [companySearch, setCompanySearch] = useState('')
  const { data: membersData } = useMembersAll()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(JobSchema.partial()),
    defaultValues: job || {
      jobType: 'full-time',
      status: 'active',
    },
    mode: 'onChange',
  })

  const companyValue = watch('company') || ''
  const companyNames = useMemo<string[]>(() => {
    const names = (membersData?.members || [])
      .map((member: any) => String(member.businessName || '').trim())
      .filter((name: string) => !!name)
    return Array.from(new Set(names))
  }, [membersData?.members])
  const filteredCompanyNames = useMemo(() => {
    const q = companySearch.trim().toLowerCase()
    if (!q) return companyNames.slice(0, 5)
    return companyNames.filter((name) => name.toLowerCase().includes(q))
  }, [companyNames, companySearch])

  const onSubmit = async (data: any) => {
    setError(null)
    setSuccess(false)
    
    // Validate all required fields before submission
    const validationErrors: string[] = []
    
    if (!data.title?.trim()) {
      validationErrors.push('Job title is required')
    }
    
    if (!data.company?.trim()) {
      validationErrors.push('Company is required - please select from the dropdown')
    }
    
    if (!data.description?.trim()) {
      validationErrors.push('Job description is required')
    }
    
    if (!data.deadline) {
      validationErrors.push('Deadline is required')
    }
    
    if (validationErrors.length > 0) {
      setError(validationErrors.join(' | '))
      return
    }

    setIsSubmitting(true)
    try {
      const url = job ? `/api/jobs/${job._id}` : '/api/jobs'
      const method = job ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          salary: data.salary?.trim() || 'Negotiable',
          postedBy: data.postedBy || 'admin',
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Failed to save job')
        return
      }

      setSuccess(true)
      toast({
        title: 'Success',
        description: job ? 'Job updated successfully' : 'Job posted successfully',
      })
      setTimeout(() => onClose(), 1500)
    } catch (error: any) {
      setError(error.message || 'An error occurred while saving')
      toast({
        title: 'Error',
        description: error.message || 'Failed to save job',
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
          <AlertDescription className="text-green-800 text-sm">Job saved successfully!</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Job Title *</label>
          <Input
            {...register('title')}
            placeholder="E.g., Sales Manager"
            className={`h-11 sm:h-10 ${errors.title ? 'border-red-500' : ''}`}
          />
          {errors.title && (
            <span className="text-xs text-red-500 mt-1 block">{errors.title.message?.toString()}</span>
          )}
          <p className="text-xs text-muted-foreground">Minimum 3 characters required</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Company *</label>
          <Popover
            open={companyOpen}
            onOpenChange={(open) => {
              setCompanyOpen(open)
              if (!open) setCompanySearch('')
            }}
          >
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={companyOpen}
                className={cn(
                  'w-full justify-between font-normal h-11 sm:h-10',
                  !companyValue && error?.includes('Company') ? 'border-red-500 ring-2 ring-red-200' : errors.company ? 'border-red-500' : ''
                )}
              >
                <span className={!companyValue ? 'text-muted-foreground' : ''}>
                  {companyValue || 'Select a company'}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2 sm:p-3" align="start">
              <Command shouldFilter={false} className="rounded-lg border">
                <CommandInput
                  placeholder="Search company..."
                  value={companySearch}
                  onValueChange={setCompanySearch}
                  className="border-b dark:border-b-slate-700"
                />
                <CommandList className="max-h-[300px]">
                  <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">No company found.</CommandEmpty>
                  {filteredCompanyNames.map((companyName) => (
                    <CommandItem
                      key={companyName}
                      value={companyName}
                      onSelect={() => {
                        setValue('company', companyName, { shouldValidate: true })
                        setCompanySearch('')
                        setCompanyOpen(false)
                        setError(null)
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          companyValue === companyName ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {companyName}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground">
            Select a company from the list. Shows 5 companies by default.
          </p>
          {!companyValue && error?.includes('Company') && (
            <span className="text-xs text-red-500 mt-1 block font-semibold">⚠️ {error.split(' | ')[0]}</span>
          )}
          {errors.company && (
            <span className="text-xs text-red-500 mt-1 block">{errors.company.message?.toString()}</span>
          )}
          <input {...register('company')} type="hidden" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Job Type</label>
          <Select value={watch('jobType') || 'full-time'} onValueChange={(value) => setValue('jobType', value)}>
            <SelectTrigger className="h-11 sm:h-10">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="temporary">Temporary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Location</label>
          <Input
            {...register('location')}
            placeholder="Job location"
            className="h-11 sm:h-10"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Salary (Optional)</label>
          <Input
            {...register('salary')}
            placeholder="E.g., Rs. 50,000 - 80,000 (Leave empty for 'Negotiable')"
            className="h-11 sm:h-10"
          />
          <p className="text-xs text-muted-foreground">If left empty, will default to 'Negotiable'</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Deadline *</label>
          <Input
            {...register('deadline')}
            type="date"
            className={`h-11 sm:h-10 ${errors.deadline ? 'border-red-500' : ''}`}
          />
          {errors.deadline && (
            <span className="text-xs text-red-500 mt-1 block">{errors.deadline.message?.toString()}</span>
          )}
          <p className="text-xs text-muted-foreground">Application deadline is mandatory</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Job Description *</label>
          <Textarea
            {...register('description')}
            placeholder="Detailed job description, requirements, and benefits"
            rows={5}
            className={`min-h-[100px] sm:min-h-[80px] resize-none ${errors.description ? 'border-red-500' : ''}`}
          />
          {errors.description && (
            <span className="text-xs text-red-500 mt-1 block">{errors.description.message?.toString()}</span>
          )}
          <p className="text-xs text-muted-foreground">Minimum 20 characters. Be detailed - applicants will see the full description in a modal</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground block">Status</label>
          <Select value={watch('status') || 'active'} onValueChange={(value) => setValue('status', value)}>
            <SelectTrigger className="h-11 sm:h-10">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
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
          {isSubmitting ? 'Saving...' : job ? 'Update Job' : 'Post Job'}
        </Button>
      </div>
    </form>
  )
}
