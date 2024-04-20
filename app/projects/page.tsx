import Link from 'next/link'
import { cn } from '../lib/utils'
import { sanityFetch, urlFor } from '../data/client'
import { GFNC_project } from '../types'
import Image from 'next/image'
import { PortableText } from 'next-sanity'
import { Metadata, ResolvingMetadata } from 'next'

const menuItems = [
  {
    name: 'All',
  },
  {
    name: 'Web',
  },
  {
    name: 'Video',
  },
  {
    name: 'Photo',
  },
  {
    name: 'Audio',
  },
]

type ProjectsProps = {
  searchParams: { [key: string]: string | string[] | undefined }
}

const PROJECTION = `
  _id,
  title,
  clientName,
  slug,
  type,
  dateCompleted,
  mainImage {
    asset-> {
      url,
      metadata {
        lqip,
        dimensions {
          height,
          width
        }
      }
    },
    caption
  },
  summary
`

const ALL_PROJECTS_QUERY = `
  *[_type == 'GFNC_project'] | order(dateCompleted desc) {
    ${PROJECTION}
  }
`

const FILTERED_PROJECTS_QUERY = `
  *[_type == 'GFNC_project' && type == $type] | order(dateCompleted desc) {
    ${PROJECTION}
  }
`

export async function generateMetadata(
  params: {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { openGraph } = await parent
  const pathname = '/projects'

  return {
    title: 'Projects',
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      ...openGraph,
      url: pathname,
    },
  }
}

export default async function Projects({ searchParams }: ProjectsProps) {
  // If the search params type is empty or the type is not in the menu items,
  // set the type to the default type
  const isDefaultType =
    !searchParams.type ||
    !menuItems.find(item => item.name === searchParams.type)

  // If the search params type is the default type, set the type to the
  // first menu item, otherwise set the type to the search param type
  const type = isDefaultType ? menuItems[0].name : searchParams.type

  const [projectsData] = await Promise.all([
    sanityFetch<GFNC_project[]>({
      query: isDefaultType ? ALL_PROJECTS_QUERY : FILTERED_PROJECTS_QUERY,
      tags: ['GFNC_project'],
      params: isDefaultType ? {} : { type },
    }),
  ])

  return (
    <main>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='mx-auto max-w-[1792px] border-y-2 border-black bg-background px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <h1 className='pt-6 text-[32px] leading-none tracking-[-0.04em] md:pt-12 md:text-[48px] lg:text-[96px]'>
            Projects
          </h1>
          <div className='mb-10 mt-10 sm:mt-12 md:mt-24'>
            <ul className='flex overflow-x-scroll border-y-2 border-black'>
              {menuItems.map(item => (
                <li key={item.name}>
                  <Link
                    className={cn(
                      'block px-6 py-5 font-sans text-xl font-black uppercase leading-tight transition-colors hover:no-underline',
                      item.name === type
                        ? 'bg-black text-white hover:bg-black'
                        : 'text-black hover:bg-black/10 active:bg-black/20'
                    )}
                    href={
                      item.name !== menuItems[0].name
                        ? `/projects?type=${item.name}`
                        : '/projects'
                    }
                    scroll={false}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className='mt-16 flex flex-col gap-16'>
              {projectsData.map((project, index) => (
                <div
                  key={project._id}
                  className='grid grid-cols-1 gap-6 lg:grid-cols-2'
                >
                  <div>
                    {/* ^ div prevents grid item from filling height of row in the event text is taller than image */}
                    <div className='overflow-hidden border-2 border-black'>
                      <Link href={`/projects/${project.slug.current}`}>
                        <Image
                          src={urlFor(project.mainImage).width(1600).url()}
                          width={
                            project.mainImage.asset.metadata.dimensions.width
                          }
                          height={
                            project.mainImage.asset.metadata.dimensions.height
                          }
                          alt={project.mainImage.caption}
                          placeholder={project.mainImage.asset.metadata.lqip}
                          className={`aspect-video w-full object-cover transition-all duration-1000 hover:scale-105`}
                          sizes='(max-width: 1024px) 100vw, 50vw'
                          quality={90}
                          priority={index < 3}
                        />
                      </Link>
                    </div>
                  </div>
                  <div className='space-y-4'>
                    <div className='flex items-center gap-2 font-sans text-sm font-bold uppercase'>
                      <span>{project.type}</span>
                      <span>·</span>
                      <span>
                        {new Date(project.dateCompleted).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            timeZone: 'UTC',
                          }
                        )}
                      </span>
                    </div>
                    <div>
                      <Link
                        href={`/projects/${project.slug.current}`}
                        className='block'
                      >
                        <h2 className='text-[32px] sm:text-[40px]'>
                          {project.title}
                        </h2>
                      </Link>
                      <h3 className='text-lg font-medium sm:text-xl'>
                        – {project.clientName}
                      </h3>
                    </div>
                    <div className='portable-text text-2xl leading-tight'>
                      <PortableText value={project.summary} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
