import Link from 'next/link'
import { cn } from '../../lib/utils'
import { cmsFetch, getImageUrl } from '../../data/client'
import { GFNC_project } from '../../types'
import { Metadata, ResolvingMetadata } from 'next'
import ProjectCard from '@/components/ProjectCard'
import { PortableText } from 'next-sanity'
import Image from 'next/image'

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
          <div className='flex items-center justify-between gap-12 py-6 md:py-8'>
            <h1 className='text-[32px] leading-none tracking-[-0.04em] md:text-[48px] lg:text-[96px]'>
              Projects
            </h1>
            <ul className='flex grow justify-end overflow-x-scroll border-y-2 border-black'>
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
          </div>
        </div>
      </section>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='bg-background mx-auto max-w-(--page-max-width) border-y-2 border-black px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <div className='flex items-center gap-4'>
            <div className='h-5 w-5 rounded-full border-2 border-black bg-[#70FFA8]'></div>
            <h2 className='text-[32px] leading-none tracking-[-0.04em] md:text-[48px] lg:text-[64px]'>
              In Progress
            </h2>
          </div>
          <div className='mt-12 grid grid-cols-1 gap-8 md:grid-cols-3'>
            {projectsData.slice(0, 10).map(project => {
              const mainMedia = project.mainMedia.find(
                mainMedia => mainMedia._type === 'image'
              )

              if (!mainMedia) return null

              return (
                <div
                  key={project._id}
                  className='flex flex-col justify-between gap-4 bg-black/10 p-4'
                >
                  <div className='flex items-start gap-4'>
                    <Image
                      src={
                        mainMedia.asset.extension === 'gif'
                          ? getImageUrl(mainMedia).url()
                          : getImageUrl(mainMedia).width(1600).quality(90).url()
                      }
                      width={mainMedia.asset.metadata.dimensions.width}
                      height={mainMedia.asset.metadata.dimensions.height}
                      alt={mainMedia.caption}
                      className={cn(
                        project.type === 'Audio'
                          ? 'aspect-square'
                          : 'aspect-video',
                        `w-16 object-cover`
                      )}
                      priority={false}
                      unoptimized
                      placeholder={mainMedia.asset.metadata.lqip}
                    />
                    <div className='space-y-2'>
                      <h2 className='text-[16px] font-bold sm:text-[20px]'>
                        {project.title}
                      </h2>
                      <div className='portable-text font-sans text-sm leading-tight font-light tracking-wide'>
                        <PortableText value={project.summary} />
                      </div>
                    </div>
                  </div>
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
                    <span>·</span>
                    <span>{project.clientName}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='bg-background mx-auto max-w-(--page-max-width) border-y-2 border-black px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <div className='flex items-center gap-4'>
            <div className='h-5 w-5 rounded-full border-2 border-black bg-blue-300'></div>
            <h2 className='text-[32px] leading-none tracking-[-0.04em] md:text-[48px] lg:text-[64px]'>
              Completed
            </h2>
          </div>
          <div className='mt-12 grid grid-cols-1 gap-x-12 gap-y-20 md:grid-cols-2'>
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
      </section>
      <section className='mx-auto grid max-w-(--page-max-width) grid-cols-2 gap-12 pt-8 md:pt-16'>
        <div className='bg-background mx-auto max-w-(--page-max-width) border-y-2 border-black px-4 pt-6 md:border-x-2 md:px-12 md:pt-12'>
          <div className='flex items-center gap-4'>
            <div className='h-5 w-5 rounded-full border-2 border-black bg-yellow-300'></div>
            <h2 className='text-[32px] leading-none tracking-[-0.04em] md:text-[48px] lg:text-[64px]'>
              Paused
            </h2>
          </div>
          <div className='mt-12 grid max-h-[500px] grid-cols-1 gap-4 overflow-y-scroll pb-6 md:pb-12'>
            {projectsData.slice(0, 5).map(project => {
              const mainMedia = project.mainMedia.find(
                mainMedia => mainMedia._type === 'image'
              )

              if (!mainMedia) return null

              return (
                <div
                  key={project._id}
                  className='flex flex-col justify-between gap-3 bg-black/10 p-4'
                >
                  <div className='flex items-start gap-3'>
                    <Image
                      src={
                        mainMedia.asset.extension === 'gif'
                          ? getImageUrl(mainMedia).url()
                          : getImageUrl(mainMedia).width(1600).quality(90).url()
                      }
                      width={mainMedia.asset.metadata.dimensions.width}
                      height={mainMedia.asset.metadata.dimensions.height}
                      alt={mainMedia.caption}
                      className={cn(
                        project.type === 'Audio'
                          ? 'aspect-square'
                          : 'aspect-video',
                        `w-12 object-cover`
                      )}
                      priority={false}
                      unoptimized
                      placeholder={mainMedia.asset.metadata.lqip}
                    />
                    <div className='space-y-1.5'>
                      <h2 className='text-[12px] font-bold sm:text-[16px]'>
                        {project.title}
                      </h2>
                      <div className='portable-text font-sans text-xs leading-tight font-light tracking-wide'>
                        <PortableText value={project.summary} />
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 font-sans text-xs font-bold uppercase'>
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
                    <span>·</span>
                    <span>{project.clientName}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className='bg-background mx-auto max-w-(--page-max-width) border-y-2 border-black px-4 pt-6 md:border-x-2 md:px-12 md:pt-12'>
          <div className='flex items-center gap-4'>
            <div className='h-5 w-5 rounded-full border-2 border-black bg-red-300'></div>
            <h2 className='text-[32px] leading-none tracking-[-0.04em] md:text-[48px] lg:text-[64px]'>
              Canceled
            </h2>
          </div>
          <div className='mt-12 grid max-h-[500px] grid-cols-1 gap-4 overflow-y-scroll pb-6 md:pb-12'>
            {projectsData.slice(0, 4).map(project => {
              const mainMedia = project.mainMedia.find(
                mainMedia => mainMedia._type === 'image'
              )

              if (!mainMedia) return null

              return (
                <div
                  key={project._id}
                  className='flex flex-col justify-between gap-3 bg-black/10 p-4 opacity-65'
                >
                  <div className='flex items-start gap-3'>
                    <Image
                      src={
                        mainMedia.asset.extension === 'gif'
                          ? getImageUrl(mainMedia).url()
                          : getImageUrl(mainMedia).width(1600).quality(90).url()
                      }
                      width={mainMedia.asset.metadata.dimensions.width}
                      height={mainMedia.asset.metadata.dimensions.height}
                      alt={mainMedia.caption}
                      className={cn(
                        project.type === 'Audio'
                          ? 'aspect-square'
                          : 'aspect-video',
                        `w-12 object-cover`
                      )}
                      priority={false}
                      unoptimized
                      placeholder={mainMedia.asset.metadata.lqip}
                    />
                    <div className='space-y-1.5'>
                      <h2 className='text-[12px] font-bold sm:text-[16px]'>
                        {project.title}
                      </h2>
                      <div className='portable-text font-sans text-xs leading-tight font-light tracking-wide'>
                        <PortableText value={project.summary} />
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 font-sans text-xs font-bold uppercase'>
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
                    <span>·</span>
                    <span>{project.clientName}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
