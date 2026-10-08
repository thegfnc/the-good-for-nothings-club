import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server'
import type { Metadata } from 'next'
import { connection } from 'next/server'
import { ReactNode } from 'react'

import AdminNav from '@/components/admin/AdminNav'
import AdminProviders from '@/components/admin/AdminProviders'

// The Convex Auth provider reads the session cookies and checks token
// expiry with Date.now(), so every admin page renders per request. That's
// fine for a private, auth-gated app: let it block rather than stream a
// public static shell. connection() marks the render as request-time up
// front, which is what lets the provider read the clock.
export const instant = false

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

/**
 * Full-screen app shell, outside the (site) route group so none of the
 * marketing Header, Footer, or page-width card applies. On desktop the
 * shell is exactly one viewport tall: the sidebar stays put and the main
 * column scrolls on its own. On mobile it falls back to normal document
 * scrolling under a sticky nav bar.
 */
export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  await connection()
  return (
    <ConvexAuthNextjsServerProvider>
      <AdminProviders>
        <div className='bg-background flex min-h-dvh flex-col md:h-dvh md:flex-row'>
          <AdminNav />
          <main className='min-w-0 flex-1 px-4 py-6 md:overflow-y-auto md:px-8 md:py-8'>
            {children}
          </main>
        </div>
      </AdminProviders>
    </ConvexAuthNextjsServerProvider>
  )
}
