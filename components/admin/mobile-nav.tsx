'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  LayoutDashboard,
  Users,
  Briefcase,
  Newspaper,
  Image,
  Settings,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

const MobileNavContext = React.createContext<{
  open: boolean
  setOpen: (open: boolean) => void
}>({ open: false, setOpen: () => {} })

export const useMobileNav = () => React.useContext(MobileNavContext)

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/members', label: 'Members', icon: Users },
  { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/admin/news', label: 'News', icon: Newspaper },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminMobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 border-r border-sky-200/60 bg-gradient-to-b from-white via-sky-50 to-blue-100/80 p-0 dark:border-sky-900/40 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950/90">
          <SheetHeader className="border-b border-sky-200/60 bg-gradient-to-r from-[#63b7f7] to-blue-500 p-6 text-white dark:border-sky-800/50">
            <SheetTitle className="text-xl font-bold text-white">
              <span className="bg-gradient-to-r from-white to-sky-100 bg-clip-text text-transparent">`n                ??????? ?????? ??????? ???`n              </span>
            </SheetTitle>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
              Admin Panel
            </p>
          </SheetHeader>

          <nav className="space-y-2 px-3 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-4 py-2.5 font-semibold transition-all duration-300',
                    isActive
                      ? 'bg-gradient-to-r from-[#63b7f7] to-blue-500 text-white shadow-lg shadow-sky-200/70 dark:shadow-sky-950/60'
                      : 'text-slate-700 hover:bg-sky-100/80 hover:text-sky-700 dark:text-slate-200 dark:hover:bg-sky-950/40 dark:hover:text-sky-300'
                  )}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-sky-200/60 p-4 dark:border-sky-900/40">
            <p className="text-center text-xs font-medium text-slate-500 dark:text-slate-400">`n              ??????? ?????? ??????? ??? © 2026`n            </p>
          </div>
        </SheetContent>
      </Sheet>

      <MobileNavContext.Provider value={{ open, setOpen }}>
      </MobileNavContext.Provider>
    </>
  )
}

