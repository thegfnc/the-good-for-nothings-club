'use client'

import posthog from 'posthog-js'
import { useEffect } from 'react'

type GlobalErrorProps = {
  error: Error & { digest?: string }
  /** Re-fetches and re-renders, unlike reset(), which only re-renders on
   * the client and can't recover from a failed server render. */
  retry: () => void
}

export default function GlobalError({ error, retry }: GlobalErrorProps) {
  useEffect(() => {
    if (posthog.__loaded) {
      posthog.captureException(error, {
        digest: error.digest,
        boundary: 'global-error',
      })
    }
  }, [error])

  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => retry()}>Try again</button>
      </body>
    </html>
  )
}
