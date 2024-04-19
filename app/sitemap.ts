import { MetadataRoute } from 'next'
import { sanityFetch } from './data/client'
import { GFNC_project } from './types'

const defaultPage: MetadataRoute.Sitemap[0] = {
  url: 'https://www.thegoodfornothings.club',
  lastModified: new Date(),
  changeFrequency: 'weekly',
  priority: 1,
}

const projectsPage: MetadataRoute.Sitemap[0] = {
  url: 'https://www.thegoodfornothings.club/projects',
  lastModified: new Date(),
  changeFrequency: 'weekly',
  priority: 0.9,
}

const contactPage: MetadataRoute.Sitemap[0] = {
  url: 'https://www.thegoodfornothings.club/contact',
  lastModified: new Date(),
  changeFrequency: 'weekly',
  priority: 0.9,
}

const ALL_PROJECTS_QUERY = `
  *[_type == 'GFNC_project'] | order(dateCompleted desc) {
    _updatedAt,
    slug
  }
`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projectsData = await sanityFetch<GFNC_project[]>({
    query: ALL_PROJECTS_QUERY,
    tags: ['GFNC_project'],
  })

  const projectPages: MetadataRoute.Sitemap = projectsData.map(project => ({
    url: `https://www.thegoodfornothings.club/projects/${project.slug.current}`,
    lastModified: new Date(project._updatedAt),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  return [defaultPage, projectsPage, ...projectPages, contactPage]
}
