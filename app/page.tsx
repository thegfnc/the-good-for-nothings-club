import Image from 'next/image'
import InstagramFeedEmbed from './components/InstagramFeedEmbed'
import SpotifyPlaylistEmbed from './components/SpotifyPlaylistEmbed'
import { sanityFetch, urlFor } from './data/client'
import { Suspense } from 'react'
import { GFNC_member, GFNC_project } from './types'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'

const FEATURED_PROJECTS_QUERY = `
  *[_type == 'GFNC_project' && featured == true] | order(dateCompleted desc) {
    _id,
    title,
    clientName,
    slug,
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
      caption
    },
    roles,
    startDate,
    memberNumber
  }
`

export default async function Home() {
  const [featuredProjectsData, membersData] = await Promise.all([
    sanityFetch<GFNC_project[]>({
      query: FEATURED_PROJECTS_QUERY,
      tags: ['GFNC_project'],
    }),
    sanityFetch<GFNC_member[]>({
      query: MEMBERS_QUERY,
      tags: ['GFNC_member'],
    }),
  ])

  return (
    <main>
      <section className='py-16 text-center md:px-8 md:py-24 xl:px-16'>
        <div className='mx-auto max-w-[1792px]'>
          <h1 className='text-hero-banner-heading leading-[83.33%] tracking-[-0.06em]'>
            <span>Good For</span>
            <br /> <span className='font-sansGlitch font-normal'>Nothings</span>
          </h1>
        </div>
      </section>
      <section className='md:px-8 xl:px-16'>
        <div className='mx-auto max-w-[1792px] border-y-2 border-black bg-background px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
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
        <div className='mx-auto max-w-[1792px] border-y-2 border-black bg-background px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <h2 className='pt-6 text-[32px] tracking-[-0.04em] md:pt-12 md:text-[48px] lg:text-[96px]'>
            Projects
          </h2>
          <div className='mt-12 md:mt-24'>
            <ul className='flex flex-col gap-12 md:gap-24'>
              {featuredProjectsData.map(project => (
                <li key={project._id} className='flex flex-col gap-6 md:gap-8'>
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
                  <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 '>
                    <div className='flex flex-col gap-1 md:gap-2'>
                      <Link
                        href={`/projects/${project.slug.current}`}
                        className='text-[28px] leading-none md:text-5xl '
                      >
                        <h3>{project.title}</h3>
                      </Link>
                      <h4 className='text-base font-semibold md:text-xl'>
                        {project.clientName}
                      </h4>
                    </div>
                    <div className='text-xl'>
                      <PortableText value={project.summary} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <Link
            className='block w-full border-b-2 border-black bg-background py-4 text-center font-sans text-sm font-black uppercase md:border-x-2 md:py-8 md:text-base'
            href='/projects'
          >
            View All
          </Link>
        </div>
      </section>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='mx-auto max-w-[1792px] border-y-2 border-black bg-background px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <h2 className='pt-6 text-[32px] tracking-[-0.04em] md:pt-12 md:text-[48px] lg:text-[96px]'>
            Members
          </h2>
          <div className='mt-12 md:mt-24'>
            <ul className='grid grid-cols-1 gap-12 md:gap-8 lg:grid-cols-2 xl:grid-cols-3'>
              {membersData.map(member => (
                <li key={member._id}>
                  <Image
                    src={urlFor(member.profilePicture).width(1400).url()}
                    width={
                      member.profilePicture.asset.metadata.dimensions.width
                    }
                    height={
                      member.profilePicture.asset.metadata.dimensions.height
                    }
                    alt={member.profilePicture.caption}
                    placeholder={member.profilePicture.asset.metadata.lqip}
                    className={`h-[312px] border-2 border-black object-cover sm:h-[468px]`}
                  />
                  <h3 className='mt-6 text-[32px]'>{member.fullName}</h3>
                  <div className='text-xl leading-tight'>
                    <p className='mt-4'>
                      Member #{String(member.memberNumber).padStart(3, '0')} -
                      since{' '}
                      {new Date(member.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                        timeZone: 'UTC',
                      })}
                    </p>
                    <p>
                      <em>{member.roles.join(', ').toLowerCase()}</em>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='mx-auto max-w-[1792px] border-y-2 border-black bg-background px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
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
