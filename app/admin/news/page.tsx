'use client'

import { useState } from 'react'
import { useContents } from '@/hooks/useApi'
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
import ContentForm from '@/components/admin/content-form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import DeleteConfirmDialog from '@/components/admin/delete-confirm-dialog'
import { useDebounce } from '@/hooks/useDebounce'

export default function AdminContentsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [type, setType] = useState<'all' | 'news' | 'notice' | 'article'>('all')
  const [showForm, setShowForm] = useState(false)
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const [contentToDelete, setContentToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Debounce search input for API calls (300ms delay)
  const debouncedSearch = useDebounce(search, 300)
  
  const { data, mutate, isLoading } = useContents(page, type, debouncedSearch)

  const handleAddNew = () => {
    setSelectedContent(null)
    setShowForm(true)
  }

  const handleEdit = (content: any) => {
    setSelectedContent(content)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!contentToDelete?._id) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/contents/${contentToDelete._id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete content')
      setContentToDelete(null)
      mutate()
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setSelectedContent(null)
    mutate()
  }

  return (
    <div className="p-3 sm:p-4 md:p-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Content Manager</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">Manage news, notices, and articles.</p>
        </div>
        <Button onClick={handleAddNew} className="w-full sm:w-fit gap-2">
          <Plus className="w-4 h-4" />
          <span>Add Content</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Input
            placeholder="Search by title or body..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value as any)
              setPage(1)
            }}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="all">All Types</option>
            <option value="news">News</option>
            <option value="notice">Notice</option>
            <option value="article">Article</option>
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="sm:hidden p-3 space-y-3">
            {isLoading ? (
              <div className="text-center py-8 text-sm text-muted-foreground">Loading...</div>
            ) : data?.contents?.length > 0 ? (
              data.contents.map((item: any) => (
                <div key={item._id} className="rounded-lg border bg-card p-3 space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="min-w-0 flex-1 break-words text-sm font-semibold leading-5">{item.title}</h3>
                      <span className="shrink-0 rounded bg-slate-100 px-2 py-1 text-[11px] font-medium uppercase tracking-wide dark:bg-slate-800">
                        {item.type}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>Published: {item.published ? 'Yes' : 'No'}</span>
                      <span>Pinned: {item.isPinned ? 'Yes' : 'No'}</span>
                      <span>Date: {new Date(item.createdAt).toLocaleDateString()}</span>
                      <span>Expires: {item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : '--'}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="h-9 w-full" onClick={() => handleEdit(item)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" className="h-9 w-full" onClick={() => setContentToDelete(item)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">No content found</div>
            )}
          </div>

          <div className="hidden sm:block w-full overflow-x-auto">
            <Table className="min-w-[860px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[140px]">Title</TableHead>
                  <TableHead className="min-w-[90px]">Type</TableHead>
                  <TableHead className="min-w-[90px]">Published</TableHead>
                  <TableHead className="min-w-[80px]">Pinned</TableHead>
                  <TableHead className="min-w-[100px]">Expires</TableHead>
                  <TableHead className="min-w-[100px]">Date</TableHead>
                  <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : data?.contents?.length > 0 ? (
                  data.contents.map((item: any) => (
                    <TableRow key={item._id}>
                      <TableCell className="max-w-[360px] font-medium">
                        <div className="truncate" title={item.title}>{item.title}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <span className="inline-flex rounded bg-slate-100 px-2 py-1 text-xs font-medium uppercase tracking-wide dark:bg-slate-800">
                          {item.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${item.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                          {item.published ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${item.isPinned ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>
                          {item.isPinned ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{item.expiresAt ? new Date(item.expiresAt).toLocaleDateString() : '--'}</TableCell>
                      <TableCell className="text-sm">{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleEdit(item)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="sm" className="h-8 w-8 p-0" onClick={() => setContentToDelete(item)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No content found
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
          <Button variant="outline" disabled={page === 1} className="w-full sm:w-fit" onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className="flex items-center justify-center px-4 text-sm md:text-base">
            Page {page} of {data.pages}
          </span>
          <Button variant="outline" disabled={page === data.pages} className="w-full sm:w-fit" onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="w-[95vw] sm:w-[90vw] md:max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>{selectedContent ? 'Edit Content' : 'Add Content'}</DialogTitle>
            <DialogDescription>
              Fill in the fields below to {selectedContent ? 'update the content item' : 'create a new content item'}.
            </DialogDescription>
          </DialogHeader>
          <ContentForm content={selectedContent} onSave={handleFormClose} onClose={handleFormClose} />
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={Boolean(contentToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setContentToDelete(null)
        }}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Delete content?"
        itemLabel={contentToDelete?.title || 'this content'}
        description={`This will permanently remove ${contentToDelete?.title || 'this content'} from the content manager.`}
      />
    </div>
  )
}
