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
