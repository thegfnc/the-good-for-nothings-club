import type { Metadata } from 'next'
import { alegreya, rubik, rubikGlitch } from './styles/fonts'
import { cn } from '@/app/lib/utils'
import { Analytics } from '@vercel/analytics/react'

import './styles/globals.css'
import Header from '@/app/components/Header'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: 'The Good for Nothings Club',
  description:
    'The Good for Nothings Club is a creators club from ATX made up of designers, engineers, filmmakers, musicians, and writers. Good for nothings. Great at everything.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      className={cn(alegreya.variable, rubik.variable, rubikGlitch.variable)}
    >
      <body>
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
