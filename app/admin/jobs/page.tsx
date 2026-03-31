'use client'

import { useEffect, useState } from 'react'
import { useJobs } from '@/hooks/useApi'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import JobForm from '@/components/admin/job-form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import DeleteConfirmDialog from '@/components/admin/delete-confirm-dialog'
import { useDebounce } from '@/hooks/useDebounce'

export default function JobsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [jobToDelete, setJobToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Debounce search input for API calls (300ms delay)
  const debouncedSearch = useDebounce(search, 300)
  
  const { data, mutate, isLoading } = useJobs(page, debouncedSearch, 'all', true)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable
      if (isTyping) return

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setPage((prev) => Math.max(1, prev - 1))
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        setPage((prev) => Math.min(data?.pages || prev, prev + 1))
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [data?.pages])

  const handleAddNew = () => {
    setSelectedJob(null)
    setShowForm(true)
  }

  const handleEdit = (job: any) => {
    setSelectedJob(job)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!jobToDelete?._id) return
    setIsDeleting(true)
    try {
      await fetch(`/api/jobs/${jobToDelete._id}`, { method: 'DELETE' })
      setJobToDelete(null)
      mutate()
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setSelectedJob(null)
    mutate()
  }

  return (
    <div className="p-3 sm:p-4 md:p-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Job Listings</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">Manage job postings</p>
        </div>
        <Button onClick={handleAddNew} className="w-full sm:w-fit gap-2">
          <Plus className="w-4 h-4" />
          <span>Post Job</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by title, company, or description..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="sm:hidden p-3 space-y-3">
            {isLoading ? (
              <div className="text-center py-8 text-sm text-muted-foreground">Loading...</div>
            ) : data?.jobs?.length > 0 ? (
              data.jobs.map((job: any) => (
                <div key={job._id} className="rounded-lg border bg-card p-3 space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-medium leading-5">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.company}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="rounded bg-blue-100 px-2 py-1 text-blue-800">{job.jobType}</span>
                      <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                      <span className={`rounded px-2 py-1 ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {job.status}
                      </span>
                      {job.isExpired && (
                        <span className="rounded bg-red-100 px-2 py-1 text-red-800 font-medium">
                          Expired
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="h-9 w-full" onClick={() => handleEdit(job)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" className="h-9 w-full" onClick={() => setJobToDelete(job)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">No jobs found</div>
            )}
          </div>

          <div className="hidden sm:block w-full overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Title</TableHead>
                  <TableHead className="min-w-[120px]">Company</TableHead>
                  <TableHead className="min-w-[100px]">Type</TableHead>
                  <TableHead className="min-w-[130px]">Deadline</TableHead>
                  <TableHead className="min-w-[100px]">Status</TableHead>
                  <TableHead className="min-w-[80px]">Expired</TableHead>
                  <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : data?.jobs?.length > 0 ? (
                  data.jobs.map((job: any) => (
                    <TableRow key={job._id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {job.jobType}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{new Date(job.deadline).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            job.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {job.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        {job.isExpired && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Expired
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleEdit(job)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setJobToDelete(job)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No jobs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {data?.pages && data.pages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center gap-2">
          <Button
            variant="outline"
            disabled={page === 1}
            className="w-full sm:w-fit"
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center justify-center px-4 text-sm md:text-base">
            Page {page} of {data.pages}
          </span>
          <Button
            variant="outline"
            disabled={page === data.pages}
            className="w-full sm:w-fit"
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="w-[95vw] sm:w-[90vw] md:max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>
              {selectedJob ? 'Edit Job' : 'Post New Job'}
            </DialogTitle>
            <DialogDescription>
              Provide the job details and save to publish to the listings.
            </DialogDescription>
          </DialogHeader>
          <JobForm
            job={selectedJob}
            onClose={handleFormClose}
          />
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={Boolean(jobToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setJobToDelete(null)
        }}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Delete job listing?"
        itemLabel={jobToDelete?.title || 'this job listing'}
        description={`This will permanently remove ${jobToDelete?.title || 'this job listing'} from the admin panel.`}
      />
    </div>
  )
}
