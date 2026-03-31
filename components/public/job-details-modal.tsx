'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Briefcase, MapPin, DollarSign, Calendar, User, FileText } from 'lucide-react'
import { format } from 'date-fns'

interface JobDetailsModalProps {
  job: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function JobDetailsModal({ job, open, onOpenChange }: JobDetailsModalProps) {
  if (!job) return null

  const jobTypeColors: Record<string, string> = {
    'full-time': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
    'part-time': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
    'contract': 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
    'temporary': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{job.title}</DialogTitle>
          <DialogDescription className="text-base font-semibold text-sky-700 dark:text-sky-300 mt-2">
            {job.company}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Job Type Badge */}
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-sm ${jobTypeColors[job.jobType] || jobTypeColors['full-time']}`}>
              <Briefcase className="w-4 h-4" />
              {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
            </span>
            {job.isExpired && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-sm bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200">
                Expired
              </span>
            )}
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
            {job.deadline && (
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Deadline</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">
                    {format(new Date(job.deadline), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            )}

            {job.location && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Location</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{job.location}</p>
                </div>
              </div>
            )}

            {job.salary && (
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Salary</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{job.salary}</p>
                </div>
              </div>
            )}

            {job.postedBy && (
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Posted By</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{job.postedBy}</p>
                </div>
              </div>
            )}
          </div>

          {/* Full Description */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Job Description</h3>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
              <p className="text-slate-700 dark:text-slate-200 whitespace-pre-wrap break-words leading-relaxed">
                {job.description}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
            <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-semibold ${
              job.status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
            }`}>
              {job.status === 'active' ? '✓ Actively Hiring' : '✗ Closed'}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
