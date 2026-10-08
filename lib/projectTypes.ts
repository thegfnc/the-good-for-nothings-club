import type { GFNC_projectType } from '@/types'

/** The /projects filter menu, in display order (after "All"). */
export const PROJECT_TYPES: GFNC_projectType[] = [
  'Audio',
  'Build',
  'Event',
  'Photo',
  'Video',
  'Web',
]

const MENU_LINK =
  'block px-4 py-3 font-sans text-sm leading-tight font-black uppercase transition-colors hover:no-underline sm:px-6 sm:py-4 md:text-base lg:px-8'
export const MENU_LINK_ACTIVE = `${MENU_LINK} bg-black text-white hover:bg-black`
export const MENU_LINK_IDLE = `${MENU_LINK} text-black hover:bg-black/10 active:bg-black/20`

/**
 * CSS for the client-side /projects filter (components/ProjectTypeFilter):
 * under data-project-filter="X", hide cards of other types and any status
 * group left with no visible cards. Cards carry data-project-type; groups
 * carry data-project-group.
 */
export function projectTypeFilterCss() {
  return PROJECT_TYPES.map(
    type =>
      `[data-project-filter="${type}"] [data-project-type]:not([data-project-type="${type}"]),` +
      `[data-project-filter="${type}"] [data-project-group]:not(:has([data-project-type="${type}"])){display:none}`
  ).join('\n')
}

/**
 * Inline script for a cold load of /projects?type=X. The prerendered HTML
 * is the unfiltered listing with "All" highlighted; this runs while the
 * HTML is parsed, before first paint, so a filtered URL never flashes the
 * full list. Hydration then takes over (components/ProjectTypeFilter).
 * Client navigations don't need it: useSearchParams resolves at once.
 */
export function projectTypeFilterScript() {
  return `(function(){var t=new URLSearchParams(location.search).get('type');if(${JSON.stringify(PROJECT_TYPES)}.indexOf(t)<0)return;var l=document.getElementById('projects-listing');if(l)l.setAttribute('data-project-filter',t);document.querySelectorAll('[data-project-type-link]').forEach(function(a){a.className=a.getAttribute('data-project-type-link')===t?${JSON.stringify(MENU_LINK_ACTIVE)}:${JSON.stringify(MENU_LINK_IDLE)}})})()`
}
