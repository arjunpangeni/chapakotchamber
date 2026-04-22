'use client'

import Link from 'next/link'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/theme-toggle'
import { Menu, X, ChevronDown, Settings, Bell } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type NavigationSession = {
  user?: {
    name?: string | null
    email?: string | null
    role?: string
  }
} | null

function getInitials(name?: string | null): string {
  if (!name) return 'U'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatBadgeCount(count: number): string {
  if (count > 99) return '99+'
  return String(count)
}

function JobsNotification({ count }: { count: number }) {
  if (count <= 0) return null

  return (
    <span className="relative inline-block ml-2">
      <Bell className="h-4 w-4 text-current" />
      <span className="absolute top-0 right-0 inline-flex -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-red-600 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white motion-safe:animate-pulse dark:border-slate-900">
        {formatBadgeCount(count)}
      </span>
    </span>
  )
}

export default function NavigationClient({
  activeJobsCount = 0,
}: {
  activeJobsCount?: number
}) {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (!target) return
      if (drawerRef.current?.contains(target)) return
      setMobileOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [mobileOpen])

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`)

  const mainLinks = [
    { href: '/', label: 'Home' },
    { href: '/members', label: 'Members' },
    { href: '/jobs', label: 'Jobs' },
    { href: '/news', label: 'News' },
    { href: '/gallery', label: 'Gallery' },
  ]

  const aboutLinks = [
    { href: '/about/introduction', label: 'Introduction' },
    { href: '/about/committee', label: 'Executive Committee' },
    { href: '/about/past-presidents', label: 'Past Presidents' },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/55 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/55 dark:shadow-[0_10px_30px_rgba(2,6,23,0.55)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3">
        <Link
          href="/"
          className="hover:opacity-95 transition-opacity flex-shrink-0 inline-flex items-center gap-2 sm:gap-3 min-w-0"
          aria-label="चापाकोट उद्योग वाणिज्य संघ"
        >
          <Image
            src="/logo.svg"
            alt="चापाकोट उद्योग वाणिज्य संघ"
            width={220}
            height={68}
            priority
            className="h-8 sm:h-9 md:h-10 lg:h-11 w-auto dark:invert shrink-0"
          />
          <span className="block text-xs sm:text-sm md:text-base font-semibold leading-tight text-slate-800 dark:text-slate-100 max-w-[120px] sm:max-w-[140px] md:max-w-none">
            चापाकोट उद्योग वाणिज्य संघ
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10 flex-1 justify-center">
          {mainLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm md:text-base font-semibold transition-all duration-300 relative group ${
                isActive(item.href)
                  ? 'text-primary'
                  : 'text-foreground/70 hover:text-primary'
              }`}
            >
              <span className="inline-flex items-center">
                {item.label}
                {item.href === '/jobs' && <JobsNotification count={activeJobsCount} />}
              </span>
              <span className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300 ${
                isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center gap-2 text-sm md:text-base font-semibold transition-all duration-300 relative group ${
                  isActive('/about')
                    ? 'text-primary'
                    : 'text-foreground/70 hover:text-primary'
                }`}
                aria-label="About menu"
              >
                About
                <ChevronDown className="h-5 w-5 transition-transform duration-300 group-data-[state=open]:rotate-180" aria-hidden="true" />
                <span className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300 ${
                  isActive('/about') ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass border-border/40">
              {aboutLinks.map((item) => (
                <DropdownMenuItem key={item.href} className={`cursor-pointer transition-colors ${isActive(item.href) ? 'bg-primary/10 text-primary' : ''}`}>
                  <Link href={item.href} className="w-full">{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="/contact"
            className={`text-sm md:text-base font-semibold transition-all duration-300 relative group ${
              isActive('/contact')
                ? 'text-primary'
                : 'text-foreground/70 hover:text-primary'
            }`}
          >
            Contact
            <span className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300 ${
              isActive('/contact') ? 'w-full' : 'w-0 group-hover:w-full'
            }`} />
          </Link>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
          <ThemeToggle />

          {session ? (
            <>
              {session.user?.role === 'admin' && (
                <Link href="/admin" title="Admin Dashboard">
                  <button className="p-2.5 rounded-xl hover:bg-primary/10 text-primary transition-all duration-300 hover-lift">
                    <Settings className="h-5 w-5" />
                  </button>
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="btn-modern gap-2 bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-4">
                    {getInitials(session.user?.name)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass border-border/40">
                  <div className="px-3 py-2 text-sm font-semibold text-foreground">
                    {session.user?.name || 'User'}
                  </div>
                  <div className="px-3 py-1 text-xs text-foreground/60">
                    {session.user?.email}
                  </div>
                  <DropdownMenuSeparator className="bg-border/20" />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="text-destructive cursor-pointer">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/auth/signin">
              <Button className="btn-modern bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-4 md:px-6">
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-xl transition-colors duration-300 hover:bg-primary/10 active:scale-95"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-250 ${mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        <button
          aria-label="Close mobile menu"
          className="absolute inset-0 bg-slate-900/45 backdrop-blur-[1px]"
          onClick={() => setMobileOpen(false)}
        />
        <div
          id="mobile-nav-drawer"
          className={`absolute left-0 right-0 top-0 p-3 pt-16 transition-transform duration-250 sm:p-4 sm:pt-20 ${mobileOpen ? 'translate-y-0' : '-translate-y-4'}`}
        >
          <div
            ref={drawerRef}
            className="relative mx-auto w-full max-w-[88vw] rounded-2xl border border-sky-200/70 bg-gradient-to-br from-white via-sky-50 to-blue-100/90 p-2 shadow-[0_20px_50px_rgba(14,116,144,0.18)] backdrop-blur-xl dark:border-sky-900/50 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950/90 sm:max-w-lg sm:p-2.5"
          >
            <button
              type="button"
              aria-label="Close mobile menu"
              onClick={() => setMobileOpen(false)}
              className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-sky-200 bg-white/90 text-slate-700 transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>

            {mainLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-xl px-2.5 py-2 font-semibold transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-sky-100/80 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200'
                    : 'text-foreground/80 hover:bg-white/70 dark:hover:bg-slate-800/70'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <span className="inline-flex items-center">
                  {item.label}
                  {item.href === '/jobs' && <JobsNotification count={activeJobsCount} />}
                </span>
              </Link>
            ))}

            <div className="mt-2 space-y-1 border-t border-sky-200/70 pt-2 dark:border-slate-700">
              <span className="block px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-foreground/50">About</span>
              {aboutLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-xl px-2.5 py-2 text-sm transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-sky-100/80 text-sky-800 font-semibold dark:bg-sky-900/40 dark:text-sky-200'
                      : 'text-foreground/80 hover:bg-white/70 dark:hover:bg-slate-800/70'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <Link
              href="/contact"
              className={`mt-1 block rounded-xl px-2.5 py-2 font-semibold transition-all duration-200 ${
                isActive('/contact')
                  ? 'bg-sky-100/80 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200'
                  : 'text-foreground/80 hover:bg-white/70 dark:hover:bg-slate-800/70'
              }`}
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>

            {session?.user?.role === 'admin' && (
              <Link
                href="/admin"
                className="mt-2 block rounded-xl border-t border-sky-200/70 px-2.5 pb-2 pt-2 font-semibold text-sky-700 transition-all duration-200 hover:bg-white/70 dark:border-slate-700 dark:text-sky-300 dark:hover:bg-slate-800/70"
                onClick={() => setMobileOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
