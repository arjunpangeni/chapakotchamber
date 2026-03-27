'use client'

import { useState } from 'react'
import { useCommitteeMembers } from '@/hooks/useApi'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Pencil, Trash2, MoreHorizontal } from 'lucide-react'
import CommitteeForm from '@/components/admin/committee-form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import DeleteConfirmDialog from '@/components/admin/delete-confirm-dialog'

export default function CommitteePage() {
  const [showForm, setShowForm] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [memberToDelete, setMemberToDelete] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { data, mutate, isLoading } = useCommitteeMembers()

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
      await fetch(`/api/committee/${memberToDelete._id}`, { method: 'DELETE' })
      setMemberToDelete(null)
      mutate()
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const members = data?.members || []

  return (
    <div className="p-3 sm:p-4 md:p-8 space-y-4 sm:space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Committee Management</h1>
          <p className="text-muted-foreground">Manage current committee members and past presidents.</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Committee Members</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8">Loading...</p>
          ) : members.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              No committee members found. Add your first member.
            </p>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead>Name</TableHead>
                       <TableHead>Role</TableHead>
                       <TableHead>Type</TableHead>
                       <TableHead>Priority</TableHead>
                       <TableHead>Tenure</TableHead>
                       <TableHead className="w-[100px]">Actions</TableHead>
                     </TableRow>
                   </TableHeader>
                  <TableBody>
                    {members.map((member: any) => (
                      <TableRow key={member._id}>
                       <TableCell className="font-medium">{member.name}</TableCell>
                         <TableCell>{member.role}</TableCell>
                         <TableCell>
                           <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                             member.type === 'current'
                               ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                               : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                           }`}>
                             {member.type === 'current' ? 'Current' : 'Past'}
                           </span>
                         </TableCell>
                         <TableCell>
                           <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded">
                             {member.priority || 50}
                           </span>
                         </TableCell>
                         <TableCell>{member.tenure || '-'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(member)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setMemberToDelete(member)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden grid grid-cols-1 gap-4">
                {members.map((member: any) => (
                  <Card key={member._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                           <div className="flex items-center gap-2 mt-2">
                             <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                               member.type === 'current'
                                 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                 : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                             }`}>
                               {member.type === 'current' ? 'Current' : 'Past'}
                             </span>
                             <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 rounded">
                               Priority: {member.priority || 50}
                             </span>
                             {member.tenure && (
                               <span className="text-xs text-muted-foreground">{member.tenure}</span>
                             )}
                           </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(member)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setMemberToDelete(member)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto w-[95vw] sm:w-[90vw] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>
              {selectedMember ? 'Edit Committee Member' : 'Add Committee Member'}
            </DialogTitle>
            <DialogDescription>
              {selectedMember ? 'Update the committee member details.' : 'Add a new committee member.'}
            </DialogDescription>
          </DialogHeader>
          <CommitteeForm
            member={selectedMember}
            onClose={() => setShowForm(false)}
            onSuccess={() => mutate()}
          />
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!memberToDelete}
        onOpenChange={() => setMemberToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Committee Member"
        description={`Are you sure you want to delete ${memberToDelete?.name}? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </div>
  )
}