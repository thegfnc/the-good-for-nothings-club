import Image from 'next/image'
import InstagramFeedEmbed from './components/InstagramFeedEmbed'
import SpotifyPlaylistEmbed from './components/SpotifyPlaylistEmbed'
import { sanityFetch, urlFor } from './data/client'
import { Suspense } from 'react'
import { GFNC_member } from './types'

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
            aspectRatio,
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
  const membersData = await sanityFetch<GFNC_member[]>({
    query: MEMBERS_QUERY,
    tags: ['GFNC_member'],
  })

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
