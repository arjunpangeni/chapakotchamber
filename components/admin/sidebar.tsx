'use client'

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
  Crown,
} from 'lucide-react'

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

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 flex-col border-r border-sky-200/60 bg-gradient-to-b from-white via-sky-50 to-blue-100/80 shadow-[0_0_35px_rgba(99,183,247,0.12)] backdrop-blur-xl dark:border-sky-900/40 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950/90">
      <div className="border-b border-sky-200/60 bg-gradient-to-r from-[#63b7f7] to-blue-500 p-6 text-white dark:border-sky-800/50">
        <h1 className="text-xl font-bold">
          <span className="bg-gradient-to-r from-white to-sky-100 bg-clip-text text-transparent"> चापाकोट उद्योग वाणिज्य संघ.</span>
        </h1>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
          Admin Panel
        </p>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
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
        <p className="text-center text-xs font-medium text-slate-500 dark:text-slate-400"> चापाकोट उद्योग वाणिज्य संघ.@2026 </p>
      </div>
    </aside>
  )
}

