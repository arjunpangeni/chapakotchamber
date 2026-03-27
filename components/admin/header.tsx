import { auth } from '@/auth'
import HeaderClient from '@/components/admin/header-client'

export default async function Header() {
  const session = await auth()
  return <HeaderClient session={session} />
}
