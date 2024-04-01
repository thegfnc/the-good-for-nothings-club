import { createClient, QueryParams } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

const builder = imageUrlBuilder(client)

type SanityFetchParams = {
  query: string
  params?: QueryParams
  tags?: string[]
}

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags,
}: SanityFetchParams) {
  return client.fetch<QueryResponse>(query, params, {
    next: {
      revalidate: 3600,
      tags,
    },
  })
}

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}
