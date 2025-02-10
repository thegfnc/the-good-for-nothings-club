import Link from 'next/link'
import { cn } from '../../lib/utils'
import { cmsFetch } from '../../data/client'
import { GFNC_project } from '../../types'
import { Metadata, ResolvingMetadata } from 'next'
import ProjectCard from '@/components/ProjectCard'

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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const PROJECTION = `
  _id,
  title,
  clientName,
  slug,
  type,
  dateCompleted,
  mainMedia[] {
    ...,
    _type == 'image' => {
      ...,
      asset-> {
        extension,
        url,
        metadata {
          lqip,
          dimensions {
            height,
            width
          }
        }
      }
    },
    _type == 'videoFile' => {
      ...,
      asset-> {
        url,
        metadata {
          lqip,
          dimensions {
            height,
            width
          }
        }
      }
    },
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

export default async function Projects(props: ProjectsProps) {
  const searchParams = await props.searchParams
  // If the search params type is empty or the type is not in the menu items,
  // set the type to the default type
  const isDefaultType =
    !searchParams.type ||
    !menuItems.find(item => item.name === searchParams.type)

  // If the search params type is the default type, set the type to the
  // first menu item, otherwise set the type to the search param type
  const type = isDefaultType ? menuItems[0].name : searchParams.type

  const [projectsData] = await Promise.all([
    cmsFetch<GFNC_project[]>({
      query: isDefaultType ? ALL_PROJECTS_QUERY : FILTERED_PROJECTS_QUERY,
      tags: ['GFNC_project'],
      params: isDefaultType ? {} : { type },
    }),
  ])

  return (
    <main>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='bg-background mx-auto max-w-(--page-max-width) border-y-2 border-black px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <h1 className='pt-6 text-[32px] leading-none tracking-[-0.04em] md:pt-8 md:text-[48px] lg:text-[96px]'>
            Projects
          </h1>
          <div className='mt-10 mb-10 sm:mt-12 md:mt-20'>
            <ul className='flex overflow-x-scroll border-y-2 border-black'>
              {menuItems.map(item => (
                <li key={item.name}>
                  <Link
                    className={cn(
                      'block px-6 py-5 font-sans text-xl leading-tight font-black uppercase transition-colors hover:no-underline',
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
            <div className='mt-16 grid grid-cols-1 gap-x-12 gap-y-20 md:grid-cols-2'>
              {projectsData.map((project, index) => {
                return (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    priority={index < 3}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
