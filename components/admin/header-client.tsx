'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/theme-toggle'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Menu, LayoutDashboard, Users, Briefcase, Newspaper, Image, Settings, Home, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

type HeaderSession = {
  user?: {
    name?: string | null
    email?: string | null
  }
} | null

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

export default function HeaderClient({ session }: { session: HeaderSession }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const userInitials = session?.user?.name
    ? session.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'AD'

  return (
    <>
      <header className="flex items-center justify-between border-b border-sky-200/60 bg-gradient-to-r from-white/85 via-sky-50/80 to-blue-100/70 px-4 py-4 shadow-sm backdrop-blur-xl dark:border-sky-900/40 dark:from-slate-950/85 dark:via-slate-900/80 dark:to-sky-950/70 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg p-2 transition-colors duration-200 hover:bg-sky-100/80 dark:hover:bg-sky-950/40 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6 text-slate-700 dark:text-slate-100" />
          </button>
          <div>  <h2 className="text-lg font-bold gradient-text md:text-xl">Dashboard</h2>         <p className="text-xs text-slate-600 dark:text-slate-300"></p>  </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/" title="Go to Home">
            <Button
              variant="ghost"
              className="h-10 w-10 rounded-full p-0 transition-colors duration-200 hover:bg-sky-100/80 dark:hover:bg-sky-950/40 md:h-11 md:w-11"
            >
              <Home className="h-5 w-5 text-slate-700 dark:text-slate-100" />
            </Button>
          </Link>
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full transition-colors duration-200 hover:bg-sky-100/80 dark:hover:bg-sky-950/40 md:h-11 md:w-11">
                <Avatar className="h-10 w-10 bg-gradient-to-br from-[#63b7f7] to-blue-500 md:h-11 md:w-11">
                  <AvatarFallback className="bg-transparent text-xs font-bold text-primary-foreground md:text-sm">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border border-sky-200/60 bg-white/95 backdrop-blur-md dark:border-sky-900/50 dark:bg-slate-950/95">
              <div className="px-3 py-2 text-sm font-semibold text-foreground">
                {session?.user?.email}
              </div>
              <DropdownMenuSeparator className="bg-border/20" />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/auth/signin' })} className="cursor-pointer text-red-500 hover:bg-red-50/50 hover:text-red-600 dark:hover:bg-red-950/30">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 border-r border-sky-200/60 bg-gradient-to-b from-white via-sky-50 to-blue-100/80 p-0 dark:border-sky-900/40 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950/90">
          <SheetHeader className="border-b border-sky-200/60 bg-gradient-to-r from-[#63b7f7] to-blue-500 p-6 text-white dark:border-sky-800/50">
            <SheetTitle className="text-xl font-bold text-white">
              <span className="bg-gradient-to-r from-white to-sky-100 bg-clip-text text-transparent"></span>
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
                  onClick={() => setMobileMenuOpen(false)}
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
            <p className="text-center text-xs font-medium text-slate-500 dark:text-slate-400">
               चापाकोट उद्योग वाणिज्य संघ©2026
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
