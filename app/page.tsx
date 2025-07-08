import SpotifyPlaylistEmbed from '../components/SpotifyPlaylistEmbed'
import InstagramFeed from '@/components/InstagramFeed'
import { cmsFetch } from '../data/client'
import { Suspense } from 'react'
import type { GFNC_member, GFNC_project } from '../types'
import Link from 'next/link'
import HeroBanner from '../components/HeroBanner'
import MemberProfilePicture from '../components/MemberProfilePicture'
import { FaCaretRight } from 'react-icons/fa'

import ProjectCard from '@/components/ProjectCard'

const FEATURED_PROJECTS_QUERY = `
  *[_type == 'GFNC_project' && featured == true] | order(dateCompleted desc) {
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
        },
        caption
      }
    },
    summary
  }
`

const MEMBERS_QUERY = `
  *[_type == 'GFNC_member'] | order(startDate) {
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
        <div className='mx-auto max-w-(--page-max-width)'>
          <h1 className='visually-hidden'>Good For Nothings</h1>
          <HeroBanner />
        </div>
      </section>
      <section className='md:px-8 xl:px-16'>
        <div className='bg-background mx-auto max-w-(--page-max-width) border-y-2 border-black px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <p className='font-serif text-2xl leading-tight sm:text-[32px] 2xl:text-[48px] 2xl:leading-[1.16]'>
            <em>The Good for Nothings Club</em> is a creators club from Austin,
            TX made up of designers, engineers, filmmakers, musicians, and
            writers. Club members bring projects and meet weekly to lend
            expertise, collaborate, and hold each other accountable on progress.
            Good for nothings. Great at everything.
          </p>
        </div>
        <div className='bg-background mx-auto max-w-(--page-max-width) border-b-2 border-black md:border-x-2'>
          <Link
            className='group flex w-full items-center justify-center gap-0.5 py-4 text-center font-sans text-sm leading-none font-extrabold uppercase transition-colors hover:bg-black/10 hover:no-underline active:bg-black/20 md:py-8 md:text-base'
            href='/about'
          >
            <span>Learn More</span>{' '}
            <FaCaretRight className='size-4.5 transition-transform duration-500 group-hover:translate-x-1' />
          </Link>
        </div>
      </section>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='bg-background mx-auto max-w-(--page-max-width) border-y-2 border-black px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <h2 className='pt-6 text-[32px] font-black tracking-[-0.04em] md:pt-8 md:text-[48px] lg:text-[84px]'>
            Projects
          </h2>
          <div className='mt-10 md:mt-18'>
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
              {featuredProjectsData.map(project => {
                return <ProjectCard key={project._id} project={project} />
              })}
            </div>
          </div>
        </div>
        <div className='bg-background mx-auto max-w-(--page-max-width) border-b-2 border-black md:border-x-2'>
          <Link
            className='group flex w-full items-center justify-center gap-0.5 py-4 text-center font-sans text-sm leading-none font-extrabold uppercase transition-colors hover:bg-black/10 hover:no-underline active:bg-black/20 md:py-8 md:text-base'
            href='/projects'
          >
            <span>View All Projects</span>
            <FaCaretRight className='size-4.5 transition-transform duration-500 group-hover:translate-x-1' />
          </Link>
        </div>
      </section>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='bg-background mx-auto max-w-(--page-max-width) border-y-2 border-black px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <h2 className='pt-6 text-[32px] font-black tracking-[-0.04em] md:pt-8 md:text-[48px] lg:text-[84px]'>
            Members
          </h2>
          <div className='mt-10 md:mt-18'>
            <ul className='grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:grid-cols-3 2xl:grid-cols-5'>
              {membersData.map(member => (
                <MemberProfilePicture key={member._id} member={member} />
              ))}
            </ul>
          </div>
        </div>
        <div className='bg-background mx-auto max-w-(--page-max-width) border-b-2 border-black md:border-x-2'>
          <Link
            className='group flex w-full items-center justify-center gap-0.5 py-4 text-center font-sans text-sm leading-none font-extrabold uppercase transition-colors hover:bg-black/10 hover:no-underline active:bg-black/20 md:py-8 md:text-base'
            href='/about'
          >
            <span>Learn More</span>
            <FaCaretRight className='size-4.5 transition-transform duration-500 group-hover:translate-x-1' />
          </Link>
        </div>
      </section>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='bg-background mx-auto max-w-(--page-max-width) border-y-2 border-black px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <h2 className='pt-6 text-[32px] font-black tracking-[-0.04em] md:pt-8 md:text-[48px] lg:text-[84px]'>
            Find Us Online
          </h2>
          <div className='mt-10 grid grid-cols-1 gap-8 md:mt-18 lg:grid-cols-2'>
            <Suspense fallback={<div>Loading...</div>}>
              <InstagramFeed feedId='y09WG1s5frlBs5IYL0XM' />
              <SpotifyPlaylistEmbed />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  )
}
