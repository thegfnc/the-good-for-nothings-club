import Link from 'next/link'
import { sanityFetch, urlFor } from '../../data/client'
import { GFNC_project } from '../../types'
import Image from 'next/image'
import { PortableText } from 'next-sanity'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

type ProjectProps = {
  params: {
    slug: string
  }
}

const PROJECT_SLUG_QUERY = `
  *[_type == 'GFNC_project' && slug.current == $slug] {
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
    overview,
    photoGallery[] {
      ...,
      _type == 'image' => {
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
    caseStudy[] {
      ...,
      _type == 'image' => {
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
    }
  }
`

const MediaPlayer = dynamic(() => import('@/app/components/MediaPlayer'), {
  ssr: false,
})

const PhotoGallery = dynamic(() => import('@/app/components/PhotoGallery'), {
  ssr: false,
})

export default async function Project({ params }: ProjectProps) {
  const { slug } = params

  const [projectData] = await Promise.all([
    sanityFetch<GFNC_project[]>({
      query: PROJECT_SLUG_QUERY,
      tags: ['GFNC_project'],
      params: { slug },
    }),
  ])

  const project = projectData[0]

  return (
    <main>
      <section className='md:px-8 xl:px-16'>
        <div className='mx-auto max-w-[1792px] border-b-2 border-black bg-background md:border-x-2'>
          <div className='space-y-4 px-4 py-12 text-center lg:space-y-8 lg:px-12 lg:py-24'>
            <h1 className='text-[48px] leading-none tracking-[-0.04em] lg:text-[96px]'>
              {project.title}
            </h1>
            <h2 className='font-serif text-[32px] font-normal normal-case italic leading-none lg:text-[64px]'>
              {project.clientName}
            </h2>
          </div>
          <div className='flex items-center justify-center border-y-2 border-black'>
            <Image
              src={urlFor(project.mainImage).width(2000).url()}
              width={project.mainImage.asset.metadata.dimensions.width}
              height={project.mainImage.asset.metadata.dimensions.height}
              alt={project.mainImage.caption}
              placeholder={project.mainImage.asset.metadata.lqip}
              className={`w-full`}
            />
          </div>
          <div className='mx-4 my-6 flex flex-col justify-between gap-6 md:mx-12 md:my-12 md:gap-12 lg:flex-row'>
            <div className='space-y-2 md:space-y-6'>
              <h3>Overview</h3>
              <div className='portable-text space-y-4 text-[20px] leading-[1.17] md:text-[24px] lg:text-[24px] xl:text-[28px] 2xl:text-[32px] 2xl:leading-tight'>
                <PortableText value={project.overview} />
              </div>
            </div>
            <div className='w-full max-w-[300px] space-y-6 md:space-y-12'>
              <div className='space-y-2 md:space-y-6'>
                <h3>Project Type</h3>
                <div className='flex'>
                  <Link
                    href={`/projects?type=${project.type}`}
                    className='block rounded-full bg-black px-4 py-3 font-sans text-white transition-colors hover:bg-black/80 hover:no-underline active:bg-black/70'
                  >
                    {project.type}
                  </Link>
                </div>
              </div>
              <div className='space-y-2 md:space-y-6'>
                <h3>Date Completed</h3>
                <div className='text-[20px] leading-none md:text-[24px] lg:text-[24px] xl:text-[28px] 2xl:text-[32px]'>
                  {new Date(project.dateCompleted).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    timeZone: 'UTC',
                  })}
                </div>
              </div>
            </div>
          </div>
          {project.photoGallery && (
            <div className='border-t-2 border-black px-4 py-6 md:px-12 md:py-12'>
              <PhotoGallery photos={project.photoGallery} />
            </div>
          )}
          {project.caseStudy && (
            <div className='portable-text border-t-2 border-black px-4 py-6 md:px-12 md:py-12'>
              <PortableText
                value={project.caseStudy}
                components={{
                  types: {
                    image: ({ value }) => (
                      <Image
                        src={urlFor(value).width(2000).url()}
                        width={value.asset.metadata.dimensions.width}
                        height={value.asset.metadata.dimensions.height}
                        alt={value.caption}
                        placeholder={value.asset.metadata.lqip}
                        className={`w-full`}
                      />
                    ),
                    embedUrl: ({ value }) => {
                      return (
                        <div className='flex aspect-video justify-center'>
                          <MediaPlayer url={value.url} />
                        </div>
                      )
                    },
                    embedCode: ({ value }) => (
                      <Suspense>
                        <div
                          dangerouslySetInnerHTML={{ __html: value.code.code }}
                          className='flex justify-center'
                        />
                      </Suspense>
                    ),
                  },
                }}
              />
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
