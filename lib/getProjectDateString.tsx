import { GFNC_project } from '@/types'

export default function getProjectDateString(project: GFNC_project) {
  if (!project.dateStarted && !project.dateCompleted) {
    return ''
  }

  if (project.dateStarted && !project.dateCompleted) {
    return new Date(project.dateStarted).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    })
  }

  if (!project.dateStarted && project.dateCompleted) {
    return new Date(project.dateCompleted).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    })
  }

  // Both dates exist
  const startDate = new Date(project.dateStarted!)
  const endDate = new Date(project.dateCompleted!)

  const startYear = startDate.getUTCFullYear()
  const endYear = endDate.getUTCFullYear()

  if (startYear === endYear) {
    // Same year, format as "Mar 3 - Jun 9, 2025"
    const startPart = startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    })
    const endPart = endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    })

    return `${startPart} - ${endPart}`
  } else {
    // Different years, format as "Mar 3, 2024 - Jun 9, 2025"
    const startPart = startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    })
    const endPart = endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    })

    return `${startPart} - ${endPart}`
  }
}
