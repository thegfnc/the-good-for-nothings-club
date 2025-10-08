import { NextResponse } from 'next/server'

import { cmsFetch } from '@/data/client'

export const revalidate = 300

const UPCOMING_EVENT_QUERY = `
  *[_type == "GFNC_project" && type == "Event" && defined(dateCompleted) && dateCompleted >= $today]
    | order(dateCompleted asc)[0] {
      "id": _id,
      title,
      clientName,
      "slug": slug.current,
  mainLink,
      "date": dateCompleted,
      "summary": coalesce(pt::text(summary), ""),
      "image": select(
        defined(mainMedia[_type == "image"][0]) => {
          "url": mainMedia[_type == "image"][0].asset->url,
          "width": mainMedia[_type == "image"][0].asset->metadata.dimensions.width,
          "height": mainMedia[_type == "image"][0].asset->metadata.dimensions.height,
          "lqip": mainMedia[_type == "image"][0].asset->metadata.lqip,
          "caption": mainMedia[_type == "image"][0].caption
        }
      )
    }
`

type UpcomingEventFromCMS = {
  id: string
  title: string
  clientName: string
  slug: string
  mainLink?: string | null
  date: string
  summary: string
  image?: {
    url: string
    width: number
    height: number
    lqip: string
    caption: string
  }
} | null

type UpcomingEventResponse = {
  event:
    | null
    | (NonNullable<UpcomingEventFromCMS> & {
        projectUrl: string
        ctaUrl: string
      })
}

export async function GET() {
  try {
    const today = new Date().toISOString().slice(0, 10)

    const event = await cmsFetch<UpcomingEventFromCMS>({
      query: UPCOMING_EVENT_QUERY,
      tags: ['GFNC_project'],
      params: {
        today,
      },
    })

    const headers = {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
    }

    if (!event) {
      return NextResponse.json<UpcomingEventResponse>(
        { event: null },
        { headers }
      )
    }

    const projectUrl = `/projects/${event.slug}`
    const normalizedMainLink =
      typeof event.mainLink === 'string' ? event.mainLink.trim() : ''
    const ctaUrl =
      normalizedMainLink.length > 0 ? normalizedMainLink : projectUrl

    return NextResponse.json<UpcomingEventResponse>(
      {
        event: {
          ...event,
          projectUrl,
          ctaUrl,
        },
      },
      { headers }
    )
  } catch (error) {
    console.error('Upcoming event error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch upcoming event' },
      { status: 500 }
    )
  }
}
