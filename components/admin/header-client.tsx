'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Menu,
  LayoutDashboard,
  Users,
  Briefcase,
  Newspaper,
  Image,
  Settings,
  Home,
  Crown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/members', label: 'Members', icon: Users },
  { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/admin/news', label: 'News', icon: Newspaper },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/committee', label: 'Committee', icon: Crown },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

function getCurrentSection(pathname: string) {
  if (pathname === '/admin') return 'Dashboard'

  return (
    menuItems.find(
      (item) =>
        item.href !== '/admin' &&
        (pathname === item.href || pathname.startsWith(`${item.href}/`))
    )?.label ?? 'Dashboard'
  )
}

export default function HeaderClient() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const currentSection = getCurrentSection(pathname)

  return (
    <>
      <header className="px-3 pt-3 md:px-4">
        <div className="flex items-center justify-between rounded-2xl border border-sky-200/70 bg-white/80 px-3.5 py-3 shadow-[0_12px_35px_rgba(99,183,247,0.16)] backdrop-blur-xl dark:border-sky-900/40 dark:bg-slate-950/72">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 text-sky-700 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:from-sky-200 hover:to-blue-200 dark:from-sky-950/80 dark:to-slate-900 dark:text-sky-200 dark:hover:from-sky-900 dark:hover:to-slate-800"
              aria-label="Open admin menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700/75 dark:text-sky-300/70">
                Admin Menu
              </p>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-50 md:text-lg">
                {currentSection}
              </h2>
            </div>
          </div>

          <div className="hidden min-[360px]:inline-flex items-center rounded-full border border-sky-200/70 bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600 dark:border-sky-900/50 dark:bg-slate-900/60 dark:text-slate-300">
            Quick Nav
          </div>
        </div>
      </header>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="left"
          className="inset-y-3 left-3 h-auto w-[min(86vw,340px)] max-w-none overflow-hidden rounded-[28px] border border-sky-200/70 bg-gradient-to-b from-white/96 via-sky-50/95 to-blue-100/88 p-0 shadow-[0_24px_70px_rgba(14,116,144,0.25)] dark:border-sky-900/40 dark:from-slate-950/98 dark:via-slate-900/96 dark:to-sky-950/92"
        >
          <SheetHeader className="gap-2 border-b border-sky-200/70 bg-gradient-to-r from-[#63b7f7] via-sky-500 to-blue-500 p-5 pr-12 text-white dark:border-sky-800/50">
            <SheetTitle className="text-xl font-bold text-white">
              Admin Navigation
            </SheetTitle>
          </SheetHeader>

          <div className="flex min-h-0 flex-1 flex-col">
            <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-3">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(`${item.href}/`))

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 font-semibold transition-all duration-300',
                      isActive
                        ? 'bg-gradient-to-r from-[#63b7f7] to-blue-500 text-white shadow-[0_12px_30px_rgba(59,130,246,0.28)]'
                        : 'text-slate-700 hover:bg-white/75 hover:text-sky-700 dark:text-slate-200 dark:hover:bg-slate-800/70 dark:hover:text-sky-300'
                    )}
                  >
                    <span
                      className={cn(
                        'inline-flex h-10 w-10 items-center justify-center rounded-xl',
                        isActive
                          ? 'bg-white/18'
                          : 'bg-sky-100/80 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300'
                      )}
                    >
                      <Icon size={18} className="flex-shrink-0" />
                    </span>
                    <div className="min-w-0">
                      <span className="block text-sm">{item.label}</span>
                      <span
                        className={cn(
                          'block text-xs',
                          isActive ? 'text-white/75' : 'text-slate-500 dark:text-slate-400'
                        )}
                      >
                        {item.href === '/'
                          ? 'Public website'
                          : `Go to ${item.label.toLowerCase()}`}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </nav>

            <div className="border-t border-sky-200/70 bg-white/55 p-4 dark:border-sky-900/40 dark:bg-slate-900/35">
              <p className="text-center text-xs font-medium text-slate-500 dark:text-slate-400">
                Chapakot Chamber of Commerce Admin
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
