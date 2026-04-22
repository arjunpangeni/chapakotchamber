import type { Metadata } from 'next'
import { Noto_Sans_Devanagari } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import NavigationClient from '@/components/public/navigation-client'
import './globals.css'

const noto = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Chapakot Chamber of Commerce',
  description: 'Official website of Chapakot Chamber of Commerce',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${noto.className} font-sans antialiased site-sky-bg`}>
        <Providers>
          {/* Navigation is outside Suspense boundary - stays fixed during page transitions */}
          <NavigationClient />
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
