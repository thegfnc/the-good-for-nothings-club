import { PostHog } from 'posthog-node'

/**
 * Server-side PostHog error tracking (client-side lives in
 * instrumentation-client.ts). Exceptions surface in PostHog's Error
 * Tracking tab. No-ops in local dev (VERCEL_ENV=development) so dev
 * sessions don't pollute the data, mirroring the client gate.
 *
 * Serverless-shaped: a short-lived client per capture, flushed before
 * return, so events aren't lost when the function instance is recycled.
 *
 * Pass distinctId (the visitor's posthog-js id) when it's known so the
 * exception lands on that person and links to their session replay;
 * without it PostHog records an anonymous, person-less event.
 */
export async function captureServerException(
  error: unknown,
  properties?: Record<string, unknown>,
  distinctId?: string
): Promise<void> {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key || process.env.VERCEL_ENV === 'development') return

  try {
    const posthog = new PostHog(key, {
      host: 'https://us.i.posthog.com',
      flushAt: 1,
      flushInterval: 0,
    })
    posthog.captureException(
      error instanceof Error ? error : new Error(String(error)),
      distinctId,
      properties
    )
    await posthog.shutdown()
  } catch (captureError) {
    // Error reporting must never take down the request that triggered it.
    console.error('PostHog exception capture failed:', captureError)
  }
}
