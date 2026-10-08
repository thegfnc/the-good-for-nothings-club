'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { type ReactNode, ViewTransition } from 'react'

import { PROJECT_TYPES } from '@/lib/projectTypes'
import { cn } from '@/lib/utils'
import type { GFNC_projectType } from '@/types'

const ALL = 'All'

/**
 * /projects filtering happens here, in the browser, so the page itself can
 * be fully static: the server renders every project once (cached Convex
 * data) and the ?type= filter only toggles a data attribute that the CSS
 * from projectTypeFilterCss() (lib/projectTypes.ts) keys off. Switching types is a client
 * navigation with no server render.
 *
 * During the prerender useSearchParams() suspends, so the static HTML is
 * the Suspense fallback: the unfiltered listing and the "All" menu. A
 * filtered URL loaded cold shows everything until hydration applies the
 * filter; the canonical /projects is unaffected.
 */
function useSelectedType() {
  const type = useSearchParams().get('type')
  return PROJECT_TYPES.find(t => t === type)
}

export function TypeMenu({ selected }: { selected?: GFNC_projectType }) {
  const active = selected ?? ALL
  return (
    <ul className='flex max-w-full overflow-x-scroll rounded-full border-2 border-black'>
      {[ALL, ...PROJECT_TYPES].map(name => (
        <li key={name}>
          <Link
            className={cn(
              'block px-4 py-3 font-sans text-sm leading-tight font-black uppercase transition-colors hover:no-underline sm:px-6 sm:py-4 md:text-base lg:px-8',
              name === active
                ? 'bg-black text-white hover:bg-black'
                : 'text-black hover:bg-black/10 active:bg-black/20'
            )}
            href={name === ALL ? '/projects' : `/projects?type=${name}`}
            scroll={false}
          >
            {name}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function SelectedTypeMenu() {
  return <TypeMenu selected={useSelectedType()} />
}

/** Wraps the full listing; hides everything but the selected type. */
export function FilteredListing({ children }: { children: ReactNode }) {
  const type = useSelectedType()

  // Switching the type crossfades the listing: same place, different
  // content. The key makes old and new an exit/enter pair.
  return (
    <ViewTransition
      key={type ?? ALL}
      name='projects-listing'
      share='auto'
      enter='auto'
      default='none'
    >
      <div data-project-filter={type}>{children}</div>
    </ViewTransition>
  )
}
