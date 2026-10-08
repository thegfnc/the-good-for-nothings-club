import { cacheLife } from 'next/cache'
import { STATIC_MARKDOWN, aboutMarkdown } from '@/lib/markdown/pages'
import { llmsTxt } from '@/lib/markdown/site'

/**
 * llms-full.txt: the agent index followed by the full text of every static
 * page. Convex-backed pages (about's member list, projects, members) are
 * linked rather than inlined so this file stays static and small.
 */
export async function GET() {
  return new Response(await fullText(), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

/** Rebuilt daily, like /events, so its upcoming dates roll forward. */
async function fullText() {
  'use cache'
  cacheLife('days')
  const order = [
    '/',
    '/facilities',
    '/services',
    '/events',
    '/membership',
    '/about',
    '/contact',
  ]
  const sections = order.map(path =>
    path === '/about' ? aboutMarkdown() : STATIC_MARKDOWN[path]()
  )
  return [llmsTxt(), ...sections].join('\n\n\n')
}
