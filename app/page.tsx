import Image from 'next/image'
import InstagramFeedEmbed from './components/InstagramFeedEmbed'
import SpotifyPlaylistEmbed from './components/SpotifyPlaylistEmbed'
import { cmsFetch, getImageUrl } from './data/client'
import { Suspense } from 'react'
import { GFNC_member, GFNC_project } from './types'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import HeroBanner from './components/HeroBanner'
import MemberProfilePicture from './components/MemberProfilePicture'
import MediaPlayer from './components/MediaPlayer'

const FEATURED_PROJECTS_QUERY = `
  *[_type == 'GFNC_project' && featured == true] | order(dateCompleted desc) {
    _id,
    title,
    clientName,
    slug,
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
    summary
  }
`

const MEMBERS_QUERY = `
  *[_type == 'GFNC_member'] | order(startDate) {
    _id,
    fullName,
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
      },
      caption
    },
    hoverProfilePicture {
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
    roles,
    startDate,
    memberNumber
  }
`

export default async function Home() {
  const [featuredProjectsData, membersData] = await Promise.all([
    cmsFetch<GFNC_project[]>({
      query: FEATURED_PROJECTS_QUERY,
      tags: ['GFNC_project'],
    }),
    cmsFetch<GFNC_member[]>({
      query: MEMBERS_QUERY,
      tags: ['GFNC_member'],
    }),
  ])

  return (
    <main>
      <section className='py-14 text-center md:px-8 md:py-20 xl:px-16'>
        <div className='mx-auto max-w-[1576px]'>
          <h1 className='visually-hidden'>Good For Nothings</h1>
          <HeroBanner />
        </div>
      </section>
      <section className='md:px-8 xl:px-16'>
        <div className='mx-auto max-w-[1576px] border-y-2 border-black bg-background px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <p className='text-2xl leading-tight sm:text-[32px] 2xl:text-[48px] 2xl:leading-[1.16]'>
            <em>The Good for Nothings Club</em> is a creators club from Austin,
            TX made up of designers, engineers, filmmakers, musicians, and
            writers. Club members bring projects and meet weekly to lend
            expertise, collaborate, and hold each other accountable on progress.
            Good for nothings. Great at everything.
          </p>
        </div>
      </section>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='mx-auto max-w-[1576px] border-y-2 border-black bg-background px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <h2 className='pt-6 text-[32px] tracking-[-0.04em] md:pt-12 md:text-[48px] lg:text-[96px]'>
            Projects
          </h2>
          <div className='mt-12 md:mt-24'>
            <ul className='flex flex-col gap-12 md:gap-24'>
              {featuredProjectsData.map(project => {
                const mainMedia =
                  project.mainMedia.find(
                    mainMedia => mainMedia._type === 'videoFile'
                  ) ||
                  project.mainMedia.find(
                    mainMedia => mainMedia._type === 'image'
                  )

                if (!mainMedia) return null

                return (
                  <li
                    key={project._id}
                    className='flex flex-col gap-6 md:gap-8'
                  >
                    <div className='overflow-hidden border-2 border-black'>
                      <div className='relative'>
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
                            src={getImageUrl(mainMedia)
                              .width(2000)
                              .quality(90)
                              .url()}
                            width={mainMedia.asset.metadata.dimensions.width}
                            height={mainMedia.asset.metadata.dimensions.height}
                            alt={mainMedia.caption}
                            className={`aspect-video w-full object-cover`}
                            // sizes='100vw'
                            // quality={90}
                            // placeholder={mainMedia.asset.metadata.lqip}
                          />
                        )}
                        <Link
                          href={`/projects/${project.slug.current}`}
                          className='absolute left-0 top-0 h-full w-full bg-black opacity-0 transition-opacity duration-500 hover:opacity-15 active:opacity-30'
                        ></Link>
                      </div>
                    </div>
                    <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                      <div className='flex flex-col gap-1 md:gap-2'>
                        <Link
                          href={`/projects/${project.slug.current}`}
                          className='text-[28px] leading-none md:text-5xl'
                        >
                          <h3>{project.title}</h3>
                        </Link>
                        <h4 className='text-base font-semibold md:text-xl'>
                          {project.clientName}
                        </h4>
                      </div>
                      <div className='portable-text text-xl'>
                        <PortableText value={project.summary} />
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
        <div className='mx-auto max-w-[1576px] border-b-2 border-black bg-background md:border-x-2'>
          <Link
            className='block w-full py-4 text-center font-sans text-sm font-black uppercase transition-colors hover:bg-black/10 hover:no-underline active:bg-black/20 md:py-8 md:text-base'
            href='/projects'
          >
            View All
          </Link>
        </div>
      </section>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='mx-auto max-w-[1576px] border-y-2 border-black bg-background px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <h2 className='pt-6 text-[32px] tracking-[-0.04em] md:pt-12 md:text-[48px] lg:text-[96px]'>
            Members
          </h2>
          <div className='mt-12 md:mt-24'>
            <ul className='grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8 xl:grid-cols-4'>
              {membersData.map(member => (
                <MemberProfilePicture key={member._id} member={member} />
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='mx-auto max-w-[1576px] border-y-2 border-black bg-background px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <h2 className='pt-6 text-[32px] tracking-[-0.04em] md:pt-12 md:text-[48px] lg:text-[96px]'>
            Happenings
          </h2>
          <div className='mt-12 grid grid-cols-1 gap-6 md:mt-24 md:gap-12 lg:grid-cols-2'>
            <Suspense fallback={<div>Loading...</div>}>
              <InstagramFeedEmbed />
              <SpotifyPlaylistEmbed />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  )
}
