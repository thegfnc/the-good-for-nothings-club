'use client'

import { catchError, type ErrorInfo } from 'next/error'
import posthog from 'posthog-js'
import { useEffect } from 'react'

import { Button } from './ui/Button'

type WidgetBoundaryProps = {
  /** What failed, in the sentence "Couldn't load the {label}." */
  label: string
  /** Somewhere to go instead, e.g. the Instagram profile or Google Maps. */
  fallbackHref?: string
  fallbackText?: string
  className?: string
}

/**
 * Error boundary for third-party widgets (Instagram feed, Spotify embed,
 * Google Map, media players). Without it, a widget that throws while
 * rendering takes down the whole page via global-error.tsx. With it, the
 * rest of the page stays up and the widget offers a retry plus a link to
 * the same content elsewhere. notFound() and redirect() pass through.
 */
function WidgetError(
  { label, fallbackHref, fallbackText, className }: WidgetBoundaryProps,
  { error, retry }: ErrorInfo
) {
  useEffect(() => {
    if (posthog.__loaded) {
      posthog.captureException(error, { boundary: 'widget', widget: label })
    }
  }, [error, label])

  return (
    <div
      role='alert'
      className={
        className ??
        'flex flex-col items-center justify-center gap-3 border-2 border-black p-6 text-center font-sans'
      }
    >
      <p className='text-sm'>Couldn&apos;t load the {label}.</p>
      <div className='flex flex-wrap items-center justify-center gap-3'>
        <Button type='button' variant='outline' size='sm' onClick={retry}>
          Try again
        </Button>
        {fallbackHref && (
          <a
            href={fallbackHref}
            target='_blank'
            rel='noopener noreferrer'
            className='text-sm font-bold underline'
          >
            {fallbackText ?? 'Open it elsewhere'}
          </a>
        )}
      </div>
    </div>
  )
}

export default catchError(WidgetError)
