import Link from 'next/link'
import { cmsFetch, getImageUrl } from '../../../data/client'
import { GFNC_project } from '../../../types'
import Image from 'next/image'
import { PortableText } from 'next-sanity'
import { toPlainText } from '@portabletext/toolkit'
import dynamic from 'next/dynamic'
import { Suspense, memo } from 'react'
import { Metadata, ResolvingMetadata } from 'next'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

type ProjectProps = {
  params: Promise<{
    slug: string
  }>
}

const PROJECT_SLUG_QUERY = `
  *[_type == 'GFNC_project' && slug.current == $slug] {
    _id,
    title,
    clientName,
    slug,
    type,
    status,
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
    summary,
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
    }
  }
`

const MediaPlayer = dynamic(() => import('@/components/MediaPlayer'))

const PhotoGallery = dynamic(() => import('@/components/PhotoGallery'))

export async function generateMetadata(
  props: ProjectProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params

  const { slug } = params

  const { openGraph } = await parent
  const pathname = '/projects/' + slug

  const [projectData] = await Promise.all([
    cmsFetch<GFNC_project[]>({
      query: PROJECT_SLUG_QUERY,
      tags: ['GFNC_project'],
      params: { slug },
    }),
  ])

  const project = projectData[0]
  const mainImage = project.mainMedia.find(
    mainMedia => mainMedia._type === 'image'
  ) as SanityImageSource

  return {
    title: `${project.title} – ${project.clientName}`,
    description: toPlainText(project.summary),
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      ...openGraph,
      url: pathname,
      images: [getImageUrl(mainImage).width(1200).quality(90).url()],
    },
  }
}

export default async function Project(props: ProjectProps) {
  const params = await props.params
  const { slug } = params

  const [projectData] = await Promise.all([
    cmsFetch<GFNC_project[]>({
      query: PROJECT_SLUG_QUERY,
      tags: ['GFNC_project'],
      params: { slug },
    }),
  ])

  const project = projectData[0]

  const mainMedia =
    project.mainMedia.find(mainMedia => mainMedia._type === 'videoFile') ||
    project.mainMedia.find(mainMedia => mainMedia._type === 'image')

  if (!mainMedia) return null

  return (
    <main>
      <section className='md:px-8 xl:px-16'>
        <div className='bg-background mx-auto max-w-(--page-max-width) border-b-2 border-black md:border-x-2'>
          <div className='space-y-4 px-4 py-12 text-center lg:space-y-8 lg:px-12 lg:py-24'>
            <h1 className='text-[48px] leading-none font-black tracking-[-0.04em] lg:text-[96px]'>
              {project.title}
            </h1>
            <h2 className='font-serif text-[32px] leading-none font-normal normal-case italic lg:text-[64px]'>
              {project.clientName}
            </h2>
          </div>
          <div className='flex items-center justify-center border-y-2 border-black'>
            {mainMedia._type === 'videoFile' ? (
              <MediaPlayer
                url={mainMedia.asset.url}
                playing={mainMedia.playing}
                controls={mainMedia.controls}
                loop={mainMedia.loop}
                playsinline={true}
                volume={0}
                muted={true}
                className={`pointer-events-none aspect-video w-full`}
              />
            ) : (
              <Image
                src={
                  mainMedia.asset.extension === 'gif'
                    ? getImageUrl(mainMedia).url()
                    : getImageUrl(mainMedia).width(1600).quality(90).url()
                }
                width={mainMedia.asset.metadata.dimensions.width}
                height={mainMedia.asset.metadata.dimensions.height}
                alt={mainMedia.caption}
                className={`w-full`}
                priority
                unoptimized
                placeholder={mainMedia.asset.metadata.lqip}
                // sizes='100vw'
              />
            )}
          </div>
          <div className='mx-4 my-6 flex flex-col justify-between gap-6 md:mx-12 md:my-12 md:gap-16 lg:flex-row'>
            <div className='space-y-2 md:space-y-6'>
              <h3>Overview</h3>
              <div className='portable-text space-y-4 text-[20px] leading-[1.17] md:text-[24px] lg:text-[24px] xl:text-[28px] 2xl:leading-tight'>
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
                <h3>Project Status</h3>
                <div className='flex'>
                  <div className='block rounded-full bg-black px-4 py-3 font-sans text-white transition-colors'>
                    {project.status}
                  </div>
                </div>
              </div>
              {project.dateStarted && (
                <div className='space-y-2 md:space-y-6'>
                  <h3>Date Started</h3>
                  <div className='text-[20px] leading-none md:text-[24px] lg:text-[24px] xl:text-[28px] 2xl:text-[32px]'>
                    {new Date(project.dateStarted).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      timeZone: 'UTC',
                    })}
                  </div>
                </div>
              )}
              {project.dateCompleted && (
                <div className='space-y-2 md:space-y-6'>
                  <h3>Date Ended</h3>
                  <div className='text-[20px] leading-none md:text-[24px] lg:text-[24px] xl:text-[28px] 2xl:text-[32px]'>
                    {new Date(project.dateCompleted).toLocaleDateString(
                      'en-US',
                      {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        timeZone: 'UTC',
                      }
                    )}
                  </div>
                </div>
              )}
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
                    image: function CaseStudyImage({ value }) {
                      return (
                        <Image
                          src={getImageUrl(value).width(2000).quality(90).url()}
                          width={value.asset.metadata.dimensions.width}
                          height={value.asset.metadata.dimensions.height}
                          alt={value.caption}
                          className={`w-full`}
                          unoptimized
                          placeholder={value.asset.metadata.lqip}
                          // sizes='100vw'
                        />
                      )
                    },
                    videoFile: function CaseStudyVideoFile({ value }) {
                      return (
                        <div className='flex aspect-video justify-center'>
                          <MediaPlayer
                            url={value.asset.url}
                            playing={value.playing}
                            controls={value.controls}
                            loop={value.loop}
                            playsinline={true}
                            volume={0}
                            muted={true}
                          />
                        </div>
                      )
                    },
                    embedUrl: function CaseStudyEmbedUrl({ value }) {
                      return (
                        <div className='flex aspect-video justify-center'>
                          <MediaPlayer url={value.url} />
                        </div>
                      )
                    },
                    embedCode: memo(function CaseStudyEmbedCode({ value }) {
                      return (
                        <Suspense>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: value.code.code,
                            }}
                            className='flex justify-center'
                          />
                        </Suspense>
                      )
                    }),
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
