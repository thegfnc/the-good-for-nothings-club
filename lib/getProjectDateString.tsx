import { GFNC_project } from '@/types'

export default function getProjectDateString(project: GFNC_project) {
  let date = ''

  if (project.dateStarted) {
    date = new Date(project.dateStarted).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    })
  }

  if (project.dateStarted && project.dateCompleted) {
    date += ' - '
  }

  if (project.dateCompleted) {
    date += new Date(project.dateCompleted).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    })
  }

  return date
}
