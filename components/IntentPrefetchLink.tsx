'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ComponentProps } from 'react'

/**
 * A <Link> that loads the full destination page when the visitor shows
 * intent (hover, keyboard focus, touch), not just its App Shell. That way
 * the page is on the client when the click lands, which is what lets the
 * card image morph into the project hero (lib/viewTransitions.ts). Plain
 * per-link prefetch would do the same for every visible card, about 30 KB
 * each, for links nobody clicks.
 */
export default function IntentPrefetchLink({
  href,
  onMouseEnter,
  onFocus,
  onTouchStart,
  ...props
}: ComponentProps<typeof Link> & { href: string }) {
  const router = useRouter()
  const warm = () => router.prefetch(href)

  return (
    <Link
      href={href}
      onMouseEnter={event => {
        warm()
        onMouseEnter?.(event)
      }}
      onFocus={event => {
        warm()
        onFocus?.(event)
      }}
      onTouchStart={event => {
        warm()
        onTouchStart?.(event)
      }}
      {...props}
    />
  )
}
