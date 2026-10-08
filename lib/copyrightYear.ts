import { cacheLife } from 'next/cache'

/** Captured once a day rather than per request, so the footer stays in
 * every page's static shell. */
export async function copyrightYear() {
  'use cache'
  cacheLife('days')
  return new Date().getFullYear()
}
