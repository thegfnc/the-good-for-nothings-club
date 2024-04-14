import Link from 'next/link'
import { sanityFetch, urlFor } from '../../data/client'
import { GFNC_project } from '../../types'
import Image from 'next/image'
import { PortableText } from 'next-sanity'

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
    summary
  }
`

export default async function Project({ params }: ProjectProps) {
  const { slug } = params

  const [projectData] = await Promise.all([
    sanityFetch<GFNC_project[]>({
      query: PROJECT_SLUG_QUERY,
      tags: ['GFNC_project'],
      params: { slug },
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
            <div className='mt-16 flex flex-col gap-16'>
              {projectData.map(project => (
                <div
                  key={project._id}
                  className='grid grid-cols-1 gap-6 lg:grid-cols-2'
                >
                  <Link href={`/projects/${project.slug.current}`}>
                    <Image
                      src={urlFor(project.mainImage).width(2000).url()}
                      width={project.mainImage.asset.metadata.dimensions.width}
                      height={
                        project.mainImage.asset.metadata.dimensions.height
                      }
                      alt={project.mainImage.caption}
                      placeholder={project.mainImage.asset.metadata.lqip}
                      className={`aspect-video w-full border-2 border-black object-cover`}
                    />
                  </Link>
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
                        <h2 className='text-balance text-[32px] sm:text-[40px]'>
                          {project.title}
                        </h2>
                      </Link>
                      <h3 className='text-lg font-medium sm:text-xl'>
                        – {project.clientName}
                      </h3>
                    </div>
                    <div className='text-2xl leading-tight'>
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
