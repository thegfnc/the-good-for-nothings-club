'use server'

import { isAuthenticatedNextjs } from '@convex-dev/auth/nextjs/server'
import { updateTag } from 'next/cache'

import { CONTENT_TAG } from '@/lib/content'

/**
 * Expires the cached project and member data behind the public pages
 * (lib/content.ts), so an edit made in Convex shows on the next visit
 * instead of within the hour.
 */
export async function refreshPublicContent() {
  if (!(await isAuthenticatedNextjs())) throw new Error('Not signed in')
  updateTag(CONTENT_TAG)
}
