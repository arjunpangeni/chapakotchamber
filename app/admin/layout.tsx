import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import Header from '@/components/admin/header'
import Sidebar from '@/components/admin/sidebar'

export const metadata = {
  title: 'चापाकोट उद्योग वाणिज्य संघ - Admin Dashboard',
  description: 'Admin panel for Chapakot Chamber of Commerce',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session || session.user?.role !== 'admin') {
    redirect('/auth/signin')
  }

  return (
    <div className="admin-panel flex h-screen bg-[radial-gradient(circle_at_top,_rgba(99,183,247,0.22),_transparent_34%),linear-gradient(180deg,rgba(240,249,255,0.92)_0%,rgba(224,242,254,0.68)_42%,rgba(248,250,252,1)_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(99,183,247,0.18),_transparent_30%),linear-gradient(180deg,rgba(2,6,23,1)_0%,rgba(8,47,73,0.84)_100%)]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="lg:hidden">
          <Header />
        </div>
        <main className="flex-1 overflow-auto bg-transparent p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
