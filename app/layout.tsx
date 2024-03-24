import type { Metadata } from 'next'
import './globals.css'
import { alegreya, rubik, rubikGlitch } from './fonts'
import { cn } from '@/lib/utils'

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
      <body>{children}</body>
    </html>
  )
}
