import Link from 'next/link'
import { cn } from '../../lib/utils'
import { cmsFetch } from '../../data/client'
import type { GFNC_projectListItem } from '../../types'
import type { Metadata, ResolvingMetadata } from 'next'
import InProgressSection from './InProgressSection'
import CompletedSection from './CompletedSection'
import ProjectCardSmall from '@/components/ProjectCardSmall'

const menuItems = [
  {
    name: 'All',
  },
  {
    name: 'Audio',
  },
  {
    name: 'Build',
  },
  {
    name: 'Event',
  },
  {
    name: 'Photo',
  },
  {
    name: 'Video',
  },
  {
    name: 'Web',
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
  status,
  mainLink,
  dateStarted,
  dateCompleted,
  "mainImage": mainMedia[_type == 'image'][0] {
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
  "membersCount": count(membersInvolved),
  membersInvolved[]-> {
    _id,
    fullName,
    slug,
    profilePicture {
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
      hotspot {
        x,
        y,
      }
    }
  },
  summary
`

// Single query to get all projects
const ALL_PROJECTS_QUERY = `
  *[_type == 'GFNC_project'] | order(dateStarted desc) | order(dateCompleted desc) {
    ${PROJECTION}
  }
`

const FILTERED_PROJECTS_QUERY = `
  *[_type == 'GFNC_project' && type == $type] | order(dateStarted desc) | order(dateCompleted desc) {
    ${PROJECTION}
  }
`

export async function generateMetadata(
  _props: unknown,
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

export default async function ProjectsOptimized(props: ProjectsProps) {
  const searchParams = await props.searchParams
  const isDefaultType =
    !searchParams.type ||
    !menuItems.find(item => item.name === searchParams.type)

  const type = isDefaultType ? menuItems[0].name : searchParams.type

  // Single API call to get all projects
  const allProjects = await cmsFetch<
    (GFNC_projectListItem & { status: string })[]
  >({
    query: isDefaultType ? ALL_PROJECTS_QUERY : FILTERED_PROJECTS_QUERY,
    tags: ['GFNC_project'],
    params: isDefaultType ? {} : { type },
  })

  // Filter projects by status on the client side
  const inProgressProjectsData = allProjects.filter(
    p => p.status === 'In Progress'
  )
  const completedProjectsData = allProjects.filter(
    p => p.status === 'Completed'
  )
  const pausedProjectsData = allProjects.filter(p => p.status === 'Paused')
  const canceledProjectsData = allProjects.filter(p => p.status === 'Canceled')

  return (
    <main>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='bg-background mx-auto max-w-(--page-max-width) border-y-2 border-black px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <div className='flex flex-col items-center justify-between gap-8 pt-6 md:pt-8'>
            <h1 className='text-[32px] leading-none font-black tracking-[-0.04em] md:text-[48px] lg:text-[96px]'>
              Projects
            </h1>
            <ul className='flex max-w-full overflow-x-scroll rounded-full border-2 border-black'>
              {menuItems.map(item => (
                <li key={item.name}>
                  <Link
                    className={cn(
                      'block px-4 py-3 font-sans text-sm leading-tight font-black uppercase transition-colors hover:no-underline sm:px-6 sm:py-4 md:text-base lg:px-8',
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
          </div>
        </div>
      </section>

      {inProgressProjectsData.length > 0 && (
        <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
          <InProgressSection projectsData={inProgressProjectsData} />
        </section>
      )}

      {completedProjectsData.length > 0 && (
        <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
          <CompletedSection projectsData={completedProjectsData} />
        </section>
      )}

      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='mx-auto grid max-w-(--page-max-width) grid-cols-1 gap-12 lg:grid-cols-2'>
          {pausedProjectsData.length > 0 && (
            <div className='bg-background mx-auto w-full max-w-(--page-max-width) border-y-2 border-black px-4 pt-6 md:border-x-2 md:px-12 md:pt-12'>
              <div className='flex items-center gap-4'>
                <div className='h-5 w-5 rounded-full border-2 border-black bg-yellow-300'></div>
                <h2 className='text-[32px] leading-none font-black tracking-[-0.04em] md:text-[48px] xl:text-[64px]'>
                  Paused
                </h2>
              </div>
              <div className='mt-8 grid max-h-[500px] grid-cols-1 gap-4 overflow-y-scroll pb-6 md:mt-12 md:pb-12'>
                {pausedProjectsData.map(project => (
                  <ProjectCardSmall key={project._id} project={project} />
                ))}
              </div>
            </div>
          )}

          {canceledProjectsData.length > 0 && (
            <div className='bg-background mx-auto w-full max-w-(--page-max-width) border-y-2 border-black px-4 pt-6 md:border-x-2 md:px-12 md:pt-12'>
              <div className='flex items-center gap-4'>
                <div className='h-5 w-5 rounded-full border-2 border-black bg-red-300'></div>
                <h2 className='text-[32px] leading-none font-black tracking-[-0.04em] md:text-[48px] xl:text-[64px]'>
                  Canceled
                </h2>
              </div>
              <div className='mt-8 grid max-h-[500px] grid-cols-1 gap-4 overflow-y-scroll pb-6 opacity-65 md:mt-12 md:pb-12'>
                {canceledProjectsData.map(project => (
                  <ProjectCardSmall key={project._id} project={project} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
