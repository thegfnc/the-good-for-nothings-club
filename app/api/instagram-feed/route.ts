import { NextRequest, NextResponse } from 'next/server'
import type * as Behold from '@behold/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Allow query-string access without static rendering

export async function GET(request: NextRequest) {
  try {
    const feedId = request.nextUrl.searchParams.get('feedId')

    if (!feedId) {
      return NextResponse.json(
        { error: 'Feed ID is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`https://feeds.behold.so/${feedId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    })

    if (!response.ok) {
      throw new Error(`Behold API error: ${response.statusText}`)
    }

    const data: Behold.Feed = await response.json()

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    })
  } catch (error) {
    console.error('Instagram feed error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Instagram feed' },
      { status: 500 }
    )
  }
}
