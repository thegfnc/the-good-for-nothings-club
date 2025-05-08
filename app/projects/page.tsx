import Link from 'next/link'
import { cn } from '../../lib/utils'
import { cmsFetch } from '../../data/client'
import type { GFNC_project } from '../../types'
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
  dateStarted,
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
  *[_type == 'GFNC_project' && status == $status ] | order(dateStarted desc) | order(dateCompleted desc) {
    ${PROJECTION}
  }
`

const FILTERED_PROJECTS_QUERY = `
  *[_type == 'GFNC_project' && status == $status && type == $type] | order(dateStarted desc) | order(dateCompleted desc) {
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

  const [
    inProgressProjectsData,
    completedProjectsData,
    pausedProjectsData,
    canceledProjectsData,
  ] = await Promise.all([
    cmsFetch<GFNC_project[]>({
      query: isDefaultType ? ALL_PROJECTS_QUERY : FILTERED_PROJECTS_QUERY,
      tags: ['GFNC_project'],
      params: isDefaultType
        ? { status: 'In Progress' }
        : { status: 'In Progress', type },
    }),
    cmsFetch<GFNC_project[]>({
      query: isDefaultType ? ALL_PROJECTS_QUERY : FILTERED_PROJECTS_QUERY,
      tags: ['GFNC_project'],
      params: isDefaultType
        ? { status: 'Completed' }
        : { status: 'Completed', type },
    }),
    cmsFetch<GFNC_project[]>({
      query: isDefaultType ? ALL_PROJECTS_QUERY : FILTERED_PROJECTS_QUERY,
      tags: ['GFNC_project'],
      params: isDefaultType ? { status: 'Paused' } : { status: 'Paused', type },
    }),
    cmsFetch<GFNC_project[]>({
      query: isDefaultType ? ALL_PROJECTS_QUERY : FILTERED_PROJECTS_QUERY,
      tags: ['GFNC_project'],
      params: isDefaultType
        ? { status: 'Canceled' }
        : { status: 'Canceled', type },
    }),
  ])

  return (
    <main>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='bg-background mx-auto max-w-(--page-max-width) border-y-2 border-black px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <div className='flex flex-col items-center justify-between gap-8 pt-6 md:pt-8'>
            <h1 className='text-[32px] leading-none font-black tracking-[-0.04em] md:text-[48px] lg:text-[96px]'>
              Projects
            </h1>
            <ul className='flex max-w-full overflow-x-scroll border-2 border-black'>
              {menuItems.map(item => (
                <li key={item.name}>
                  <Link
                    className={cn(
                      'block px-2 py-3 font-sans text-sm leading-tight font-black uppercase transition-colors hover:no-underline sm:px-6 sm:py-4 md:text-base lg:px-8',
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
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <InProgressSection projectsData={inProgressProjectsData} />
      </section>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <CompletedSection projectsData={completedProjectsData} />
      </section>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='mx-auto grid max-w-(--page-max-width) grid-cols-1 gap-12 lg:grid-cols-2'>
          <div className='bg-background mx-auto w-full max-w-(--page-max-width) border-y-2 border-black px-4 pt-6 md:border-x-2 md:px-12 md:pt-12'>
            <div className='flex items-center gap-4'>
              <div className='h-5 w-5 rounded-full border-2 border-black bg-yellow-300'></div>
              <h2 className='text-[32px] leading-none font-black tracking-[-0.04em] md:text-[48px] xl:text-[64px]'>
                Paused
              </h2>
            </div>
            <div className='mt-8 grid max-h-[500px] grid-cols-1 gap-4 overflow-y-scroll pb-6 md:mt-12 md:pb-12'>
              {pausedProjectsData.map(project => {
                return <ProjectCardSmall key={project._id} project={project} />
              })}
            </div>
          </div>
          <div className='bg-background mx-auto w-full max-w-(--page-max-width) border-y-2 border-black px-4 pt-6 md:border-x-2 md:px-12 md:pt-12'>
            <div className='flex items-center gap-4'>
              <div className='h-5 w-5 rounded-full border-2 border-black bg-red-300'></div>
              <h2 className='text-[32px] leading-none font-black tracking-[-0.04em] md:text-[48px] xl:text-[64px]'>
                Canceled
              </h2>
            </div>
            <div className='mt-8 grid max-h-[500px] grid-cols-1 gap-4 overflow-y-scroll pb-6 opacity-65 md:mt-12 md:pb-12'>
              {canceledProjectsData.map(project => {
                return <ProjectCardSmall key={project._id} project={project} />
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
