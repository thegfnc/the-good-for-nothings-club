import Link from 'next/link'
import { cmsFetch, getImageUrl } from '../../data/client'
import { GFNC_project } from '../../types'
import Image from 'next/image'
import { PortableText } from 'next-sanity'
import { toPlainText } from '@portabletext/toolkit'
import dynamic from 'next/dynamic'
import { Suspense, memo } from 'react'
import { Metadata, ResolvingMetadata } from 'next'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'

type ProjectProps = {
  params: {
    slug: string
  }
}

type GenerateMetadataParams = {
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
    mainMedia[] {
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

const MediaPlayer = dynamic(() => import('@/app/components/MediaPlayer'), {
  ssr: false,
})

const PhotoGallery = dynamic(() => import('@/app/components/PhotoGallery'), {
  ssr: false,
})

export async function generateMetadata(
  { params: { slug } }: GenerateMetadataParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
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
      images: [getImageUrl(mainImage).width(1200).url()],
    },
  }
}

export default async function Project({ params }: ProjectProps) {
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
        <div className='mx-auto max-w-[1576px] border-b-2 border-black bg-background md:border-x-2'>
          <div className='space-y-4 px-4 py-12 text-center lg:space-y-8 lg:px-12 lg:py-24'>
            <h1 className='text-[48px] leading-none tracking-[-0.04em] lg:text-[96px]'>
              {project.title}
            </h1>
            <h2 className='font-serif text-[32px] font-normal normal-case italic leading-none lg:text-[64px]'>
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
                src={getImageUrl(mainMedia).width(1600).quality(90).url()}
                width={mainMedia.asset.metadata.dimensions.width}
                height={mainMedia.asset.metadata.dimensions.height}
                alt={mainMedia.caption}
                className={`w-full`}
                priority
                // sizes='100vw'
                // quality={90}
                // placeholder={mainMedia.asset.metadata.lqip}
              />
            )}
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
                    image: function CaseStudyImage({ value }) {
                      return (
                        <Image
                          src={getImageUrl(value).width(2000).quality(90).url()}
                          width={value.asset.metadata.dimensions.width}
                          height={value.asset.metadata.dimensions.height}
                          alt={value.caption}
                          className={`w-full`}
                          // sizes='100vw'
                          // quality={90}
                          // placeholder={value.asset.metadata.lqip}
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
