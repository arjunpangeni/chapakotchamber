import { auth } from '@/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default async function SettingsPage() {
  const session = await auth()

  return (
    <div className="p-3 sm:p-4 md:p-8 space-y-4 sm:space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Manage your admin account and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your admin account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-base sm:text-lg font-semibold mt-1 break-all">{session?.user?.email}</p>
          </div>
          <Separator />
          <div>
            <label className="text-sm font-medium text-muted-foreground">Name</label>
            <p className="text-base sm:text-lg font-semibold mt-1">{session?.user?.name || 'Not set'}</p>
          </div>
          <Separator />
          <div>
            <label className="text-sm font-medium text-muted-foreground">Role</label>
            <p className="text-base sm:text-lg font-semibold mt-1 capitalize">
              {session?.user?.role || 'User'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Help & Support</CardTitle>
          <CardDescription>Get assistance with the admin panel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-sm md:text-base">Quick Tips</h3>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-muted-foreground">
              <li>Use the sidebar menu to navigate between different sections</li>
              <li>You can search and filter items in each management page</li>
              <li>All images are stored on Cloudinary for faster loading</li>
              <li>Changes are saved immediately to the database</li>
              <li>Use the theme toggle to switch between light and dark modes</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Current system details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-muted-foreground">Database</label>
              <p className="font-semibold mt-1">MongoDB</p>
            </div>
            <div>
              <label className="text-muted-foreground">Image Storage</label>
              <p className="font-semibold mt-1">Cloudinary</p>
            </div>
            <div>
              <label className="text-muted-foreground">Authentication</label>
              <p className="font-semibold mt-1">NextAuth.js</p>
            </div>
            <div>
              <label className="text-muted-foreground">Framework</label>
              <p className="font-semibold mt-1">Next.js 16</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
