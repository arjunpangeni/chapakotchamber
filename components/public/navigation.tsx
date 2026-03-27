import { auth } from '@/auth'
import { getActiveJobsCount } from '@/lib/server-data'
import NavigationClient from '@/components/public/navigation-client'

export default async function Navigation() {
  const [session, activeJobsCount] = await Promise.all([auth(), getActiveJobsCount()])
  return <NavigationClient session={session} activeJobsCount={activeJobsCount} />
}
