import { fetchQuery } from 'convex/nextjs'
import { cacheLife, cacheTag } from 'next/cache'

import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { leadershipSlugs, pastMemberSlugs } from '@/data/leadership'
import type {
  GFNC_member,
  GFNC_memberCard,
  GFNC_project,
  GFNC_projectListItem,
} from '@/types'

/**
 * Cached reads of the public Convex content (projects and members).
 *
 * Convex's fetchQuery always sends `cache: 'no-store'`, so calling it
 * straight from a page makes the page render on every request. Every
 * public page reads through these helpers instead. Each one is a
 * 'use cache' function, so pages that use them prerender at build time and
 * refresh hourly (the 'hours' profile: revalidate after 1 hour, expire
 * after a day).
 *
 * Content is edited outside the site (Convex dashboard, scripts), so
 * nothing invalidates these on save. To publish an edit right away, use
 * "Refresh public site" in /admin/content, which expires CONTENT_TAG.
 *
 * The casts cover Convex's loose portable-text typing; the shapes mirror
 * the queries' projections (see types/index.ts).
 */

export const CONTENT_TAG = 'content'

/** Leadership and past members, the only member pages the site links to. */
export const listedMemberSlugs = [...leadershipSlugs, ...pastMemberSlugs]

function cached() {
  cacheLife('hours')
  cacheTag(CONTENT_TAG)
}

export async function getProject(slug: string) {
  'use cache'
  cached()
  return (await fetchQuery(api.projects.bySlug, {
    slug,
  })) as unknown as GFNC_project | null
}

type ProjectsListPage = {
  members: GFNC_memberCard[]
  projects: (Omit<GFNC_projectListItem, 'membersInvolved'> & {
    memberIds: string[]
  })[]
}

/** Card projection for /projects (all types; the page filters in the
 * browser). */
export async function getProjectsListPage() {
  'use cache'
  cached()
  return (await fetchQuery(
    api.projects.listPage,
    {}
  )) as unknown as ProjectsListPage
}

export async function getProjectsByMember(memberId: string) {
  'use cache'
  cached()
  return (await fetchQuery(api.projects.byMemberId, {
    memberId: memberId as Id<'members'>,
  })) as unknown as GFNC_project[]
}

export async function getMember(slug: string) {
  'use cache'
  cached()
  return (await fetchQuery(api.members.bySlug, {
    slug,
  })) as unknown as GFNC_member | null
}

/** Leadership and past members, ordered by member number. */
export async function getListedMembers() {
  'use cache'
  cached()
  return (await fetchQuery(api.members.bySlugs, {
    slugs: listedMemberSlugs,
  })) as unknown as GFNC_member[]
}

export async function getProjectsForSitemap() {
  'use cache'
  cached()
  return fetchQuery(api.projects.forSitemap, {})
}

export async function getMembersForSitemap() {
  'use cache'
  cached()
  return fetchQuery(api.members.forSitemap, { slugs: listedMemberSlugs })
}
