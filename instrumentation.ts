import type { Instrumentation } from 'next'

/**
 * Uncaught errors in server code (RSC renders, route handlers, server
 * actions) flow to PostHog Error Tracking. The browser never sees these:
 * it only gets a sanitized message plus error.digest, which the error
 * boundaries (app/global-error.tsx, app/admin/error.tsx) report too, so
 * the digest property ties the client and server events together.
 * Deliberate catches that need reporting call captureServerException
 * directly.
 *
 * Reads env straight from process.env; never import a 'server-only'
 * module here, it throws when loaded from instrumentation.
 */
export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context
) => {
  if (
    process.env.NEXT_RUNTIME !== 'nodejs' ||
    process.env.NODE_ENV !== 'production'
  ) {
    return
  }

  try {
    const { captureServerException } = await import('./lib/posthog-server')
    const digest =
      error && typeof error === 'object' && 'digest' in error
        ? error.digest
        : undefined

    await captureServerException(
      error,
      {
        digest,
        path: request.path,
        method: request.method,
        routePath: context.routePath,
        routeType: context.routeType,
        renderSource: context.renderSource,
      },
      distinctIdFromCookie(request.headers.cookie)
    )
  } catch (reportError) {
    // Error reporting must never take down the request that triggered it.
    console.error('PostHog onRequestError capture failed:', reportError)
  }
}

/**
 * posthog-js persists the visitor's id in a `ph_<project key>_posthog`
 * cookie (URI-encoded JSON). Reading it attributes the server exception
 * to the same person the browser SDK tracks.
 */
function distinctIdFromCookie(
  cookieHeader: string | string[] | undefined
): string | undefined {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key || !cookieHeader) return undefined

  const header = Array.isArray(cookieHeader)
    ? cookieHeader.join('; ')
    : cookieHeader
  const name = `ph_${key}_posthog=`
  const raw = header
    .split(/;\s*/)
    .find(part => part.startsWith(name))
    ?.slice(name.length)
  if (!raw) return undefined

  try {
    const id = JSON.parse(decodeURIComponent(raw))?.distinct_id
    return typeof id === 'string' ? id : undefined
  } catch {
    return undefined
  }
}
