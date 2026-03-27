'use client'

import { useState } from 'react'
import { useMembers } from '@/hooks/useApi'
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
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import MemberForm from '@/components/admin/member-form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import DeleteConfirmDialog from '@/components/admin/delete-confirm-dialog'
import { useDebounce } from '@/hooks/useDebounce'

const wards = ['all', 'Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5', 'Ward 6', 'Ward 7', 'Ward 8', 'Ward 9', 'Ward 10']

export default function MembersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [ward, setWard] = useState('all')
  const [membershipStatus, setMembershipStatus] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [memberToDelete, setMemberToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Debounce search input for API calls (300ms delay)
  const debouncedSearch = useDebounce(search, 300)
  
  const { data, mutate, isLoading } = useMembers(page, debouncedSearch, 'all', ward, membershipStatus)

  const handleAddNew = () => {
    setSelectedMember(null)
    setShowForm(true)
  }

  const handleEdit = (member: any) => {
    setSelectedMember(member)
    setShowForm(true)
  }

  const handleDelete = async () => {
    if (!memberToDelete?._id) return
    setIsDeleting(true)
    try {
      await fetch(`/api/members/${memberToDelete._id}`, { method: 'DELETE' })
      setMemberToDelete(null)
      mutate()
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setSelectedMember(null)
    mutate()
  }

  return (
    <div className="p-3 sm:p-4 md:p-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Members</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">Manage chamber members</p>
        </div>
        <Button onClick={handleAddNew} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      {/* Enhanced Search Bar */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm sm:sticky sm:top-0 sm:z-10 dark:border-slate-700 dark:bg-slate-900">
        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
              <div className="relative sm:col-span-2 lg:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  placeholder="Search members by name, business, email..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setPage(1)
                  }}
                  className="w-full rounded-md border-gray-300 pl-10 pr-10 text-sm sm:text-base h-10 sm:h-11 md:h-12 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:border-sky-400 dark:focus:ring-sky-400"
                />
                {search && (
                  <button
                    onClick={() => {
                      setSearch('')
                      setPage(1)
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 transition-colors hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-slate-300">Ward</label>
                <Select
                  value={ward}
                  onValueChange={(value) => {
                    setWard(value)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="h-10 sm:h-11 md:h-12 w-full">
                    <SelectValue placeholder="All wards" />
                  </SelectTrigger>
                  <SelectContent>
                    {wards.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item === 'all' ? 'All Wards' : item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="mb-1 block text-xs sm:text-sm font-medium text-gray-700 dark:text-slate-300">Status</label>
                <Select
                  value={membershipStatus}
                  onValueChange={(value) => {
                    setMembershipStatus(value)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="h-10 sm:h-11 md:h-12 w-full">
                    <SelectValue placeholder="All status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2 text-sm">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                {(search || ward !== 'all' || membershipStatus !== 'all') && (
                  <span>Filtered results</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 whitespace-nowrap dark:text-slate-300">
                  <span className="sm:hidden">Total:</span>
                  <span className="hidden sm:inline">Total members:</span>
                </span>
                <span className="rounded-md bg-gray-100 px-2 py-1 font-semibold text-gray-900 dark:bg-slate-800 dark:text-slate-100">
                  {data?.total || 0}
                </span>
              </div>
            </div>
            {(search || ward !== 'all' || membershipStatus !== 'all') && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                {search && (
                  <span className="rounded bg-blue-50 px-2 py-1 font-medium text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
                    Search: "{search}"
                  </span>
                )}
                {ward !== 'all' && (
                  <span className="rounded bg-blue-50 px-2 py-1 font-medium text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
                    Ward: {ward}
                  </span>
                )}
                {membershipStatus !== 'all' && (
                  <span className="rounded bg-blue-50 px-2 py-1 font-medium text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
                    Status: {membershipStatus === 'active' ? 'Active' : 'Inactive'}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="sm:hidden p-3 space-y-3">
            {isLoading ? (
              <div className="text-center py-8 text-sm text-muted-foreground">Loading members...</div>
            ) : data?.members?.length > 0 ? (
              data.members.map((member: any) => (
                <div key={member._id} className="rounded-lg border bg-card p-3 space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-medium leading-5">{member.businessName}</h3>
                    <p className="text-sm text-muted-foreground">Owner: {member.ownerName}</p>
                    <p className="text-xs text-muted-foreground break-all">{member.email}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded bg-blue-100 px-2 py-1 text-blue-800">{member.businessType}</span>
                      <span className={`rounded px-2 py-1 ${member.membershipStatus === 'inactive' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {member.membershipStatus === 'inactive' ? 'Inactive' : 'Active'}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="h-9 w-full" onClick={() => handleEdit(member)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" className="h-9 w-full" onClick={() => setMemberToDelete(member)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {search ? 'No members found for this search' : 'No members found'}
              </div>
            )}
          </div>

          <div className="hidden sm:block w-full overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px] sm:min-w-[150px] text-xs sm:text-sm">Business Name</TableHead>
                  <TableHead className="min-w-[100px] sm:min-w-[120px] text-xs sm:text-sm">Owner</TableHead>
                  <TableHead className="min-w-[140px] sm:min-w-[180px] text-xs sm:text-sm">Email</TableHead>
                  <TableHead className="min-w-[80px] sm:min-w-[100px] text-xs sm:text-sm">Type</TableHead>
                  <TableHead className="min-w-[70px] sm:min-w-[80px] text-xs sm:text-sm">Status</TableHead>
                  <TableHead className="text-right min-w-[80px] sm:min-w-[100px] text-xs sm:text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-gray-600">Loading members...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : data?.members?.length > 0 ? (
                  data.members.map((member: any) => (
                    <TableRow key={member._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-xs sm:text-sm py-3 px-2 sm:px-4">
                        <div className="max-w-[120px] sm:max-w-none truncate" title={member.businessName}>
                          {member.businessName}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm py-3 px-2 sm:px-4">
                        <div className="max-w-[100px] sm:max-w-none truncate" title={member.ownerName}>
                          {member.ownerName}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm py-3 px-2 sm:px-4">
                        <div className="max-w-[140px] sm:max-w-none truncate" title={member.email}>
                          {member.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm py-3 px-2 sm:px-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {member.businessType}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 px-2 sm:px-4">
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                          <span
                            className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full flex-shrink-0 ${
                              member.membershipStatus === 'inactive' ? 'bg-red-500' : 'bg-green-500'
                            }`}
                            aria-hidden="true"
                          />
                          <span
                            className={`text-xs font-medium ${
                              member.membershipStatus === 'inactive' ? 'text-red-700' : 'text-green-700'
                            }`}
                          >
                            {member.membershipStatus === 'inactive' ? 'Inactive' : 'Active'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-3 px-2 sm:px-4">
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(member)}
                            className="h-8 w-8 sm:h-9 sm:w-9 p-0 touch-manipulation"
                            aria-label={`Edit ${member.businessName}`}
                          >
                            <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setMemberToDelete(member)}
                            className="h-8 w-8 sm:h-9 sm:w-9 p-0 touch-manipulation"
                            aria-label={`Delete ${member.businessName}`}
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <Search className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900 mb-1">No members found</p>
                          <p className="text-xs text-gray-500">
                            {search ? 'Try adjusting your search terms' : 'Get started by adding your first member'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {data?.pages && data.pages > 1 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
              <span>Showing page</span>
              <span className="font-semibold text-gray-900 dark:text-slate-100">{page}</span>
              <span>of</span>
              <span className="font-semibold text-gray-900 dark:text-slate-100">{data.pages}</span>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="flex-1 sm:flex-none px-4 h-9 text-sm"
                size="sm"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={page === data.pages}
                onClick={() => setPage(page + 1)}
                className="flex-1 sm:flex-none px-4 h-9 text-sm"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto w-[95vw] sm:w-[90vw] rounded-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>
              {selectedMember ? 'Edit Member' : 'Add New Member'}
            </DialogTitle>
            <DialogDescription>
              Enter the member details and save to update the directory.
            </DialogDescription>
          </DialogHeader>
          <MemberForm
            member={selectedMember}
            onClose={handleFormClose}
          />
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={Boolean(memberToDelete)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setMemberToDelete(null)
        }}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Delete member?"
        itemLabel={memberToDelete?.businessName || 'this member'}
        description={`This will permanently remove ${memberToDelete?.businessName || 'this member'} from the admin panel.`}
      />
    </div>
  )
}
