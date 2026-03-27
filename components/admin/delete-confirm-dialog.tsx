'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Trash2 } from 'lucide-react'

type DeleteConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void | Promise<void>
  title?: string
  description?: string
  itemLabel?: string
  loading?: boolean
}

export default function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = 'Delete item?',
  description,
  itemLabel = 'this item',
  loading = false,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="overflow-hidden rounded-2xl border border-sky-200/70 bg-gradient-to-br from-white via-sky-50 to-blue-100 p-0 shadow-2xl dark:border-sky-900/60 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950">
        <div className="border-b border-sky-200/70 bg-gradient-to-r from-[#63b7f7] via-sky-400 to-blue-500 px-6 py-5 text-white dark:border-sky-800/60">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
              <Trash2 className="h-5 w-5" />
            </div>
            <AlertDialogHeader className="text-left">
              <AlertDialogTitle className="text-xl font-bold text-white">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-white/85">
                {description ?? `This will permanently remove ${itemLabel}.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="rounded-2xl border border-sky-200/80 bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm dark:border-sky-900/50 dark:bg-slate-950/70 dark:text-slate-200">
            This action cannot be undone later.
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={loading}
              className="rounded-xl border-sky-200 bg-white text-slate-700 hover:bg-sky-50 hover:text-sky-700 dark:border-sky-900/50 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-sky-950/60"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              disabled={loading}
              className="rounded-xl bg-gradient-to-r from-[#63b7f7] to-blue-500 text-white shadow-lg hover:from-sky-500 hover:to-blue-600"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
