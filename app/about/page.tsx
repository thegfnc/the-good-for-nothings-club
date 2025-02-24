import Link from 'next/link'

import ContactUsForm from '../contact/ContactUsForm'
import SocialMediaLinks from '../../components/SocialMediaLinks'
import Map from '../../components/Map'
import { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(
  params: {},
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { openGraph } = await parent
  const pathname = '/about'

  return {
    title: 'About',
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      ...openGraph,
      url: pathname,
    },
  }
}

export default async function About() {
  return (
    <main>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='bg-background mx-auto max-w-(--page-max-width) border-y-2 border-black px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <h1 className='pt-6 text-center text-[32px] leading-none tracking-[-0.04em] md:pt-8 md:text-[48px] lg:text-[96px]'>
            About
          </h1>
          <div className='mt-10 gap-24 border-t-2 border-black pt-12 sm:mt-12 md:mt-20 lg:gap-12'>
            <div className='prose prose-xl prose-li:my-1 prose-ol:my-1 mx-auto leading-snug'>
              <h2>Overview</h2>
              <p>
                The Good for Nothings Club is a creators club based in Austin,
                TX made up of designers, engineers, filmmakers, musicians, and
                writers. Club members bring projects and meet weekly to lend
                expertise, collaborate, and hold each other accountable on
                progress.
              </p>
              <p>
                As members, we have always tried to strike a balance between
                work and pursuing our passions such as film, music, app
                development, and more. In the Good for Nothings Club (GFNC), our
                objective should be to dedicate half of our time towards
                generating sufficient income, while allocating the other half to
                our more ambitious projects that have the potential to yield
                even greater long term. Our growth should be deliberate and
                gradual, focusing on retaining most of the work within our team
                and close friends. It is crucial to avoid building a business
                solely focused on infinite revenue and scale, as it tends to
                consume all of our time, preventing us from pursuing our
                creative endeavors.
              </p>

              <h3>What Members Can Expect From GFNC</h3>

              <ol>
                <li>
                  Meet weekly for ~1 hour – in person, remote, or hybrid
                  <ol type='a'>
                    <li>
                      In person meetings should be prioritized over remote. The
                      organic conversations that happen after the meeting tend
                      to be the most impactful.
                    </li>
                    <li>
                      The first half of the meeting (~30 min) should be spent on
                      meeting agenda topics.
                    </li>
                    <li>
                      The second half of the meeting (~30 min) should be spent
                      on tasks related to works in progress.
                    </li>
                  </ol>
                </li>

                <li>
                  Provide and receive help breaking down tasks and identifying
                  the next one in line
                </li>
                <li>
                  Accountability for completing tasks
                  <ol type='a'>
                    <li>
                      The goal should be to provide pressure but not inflict
                      burn out or be cruel.
                    </li>
                  </ol>
                </li>

                <li>
                  Critical feedback on in progress and completed work
                  <ol type='a'>
                    <li>
                      The goal is to push people to get better at their craft
                      and provide constructive criticism, guidance, or
                      suggestions, not to be an asshole about it.
                    </li>
                  </ol>
                </li>
                <li>
                  We are not managers or delegators.
                  <ol type='a'>
                    <li>
                      Every member is expected to generate their own work
                      through tasks in their solely owned or co-owned
                      projects{' '}
                    </li>
                    <li>
                      Optionally, members can volunteer to help with tasks in
                      other projects that they don’t own.
                    </li>
                  </ol>
                </li>
              </ol>

              <h3>What GFNC Expects From Members</h3>
              <ol>
                <li>
                  Members should try to attend all weekly meetings, missing no
                  more than one a month – averaged out over the lifetime of
                  their membership.
                </li>
                <li>
                  Notify the group ahead of time when you&apos;re not able to
                  attend a meeting and inquire about possibly rescheduling
                </li>
                <li>
                  Keep your tasks organized and representative of the current
                  work in progress + future work that has already been
                  identified
                </li>
                <li>
                  Share demos of your work with the group and be open to
                  critical feedback
                </li>
                <li>
                  Members should always have at least one project that they are
                  owning/co-owning, almost like a &quot;hero quest&quot;.
                  <ol type='a'>
                    <li>
                      Members can take on as many side quests as they want, i.e.
                      pitching in on someone else&apos;s project.
                    </li>
                    <li>
                      There is no cap on total projects that a member can have
                      in-flight at any given time.{' '}
                    </li>
                    <li>
                      Feedback should be given if a member takes on too many
                      projects and has too much on their plate.
                    </li>
                  </ol>
                </li>
                <li>
                  Identify at least one task to do each week.
                  <ol type='a'>
                    <li>
                      Do not take advantage of this by only doing the bare
                      minimum for an extended period of time. Other members are
                      encouraged to flag this behavior and help construct
                      appropriate tasks to mitigate.
                    </li>
                  </ol>
                </li>
              </ol>

              <h3>Guidance</h3>
              <ol>
                <li>
                  Do not assign tasks to a person until they are ready to be
                  completed in the upcoming week or staged for the following
                  week to keep the My Tasks as minimal as possible
                </li>
                <li>
                  Add milestones as sections to a project once they&apos;re
                  identified
                </li>
                <li>
                  Keep the number of assigned tasks in a week to a reasonably
                  completable number so as not to overwhelm
                </li>
                <li>
                  Within a project, only add dates on future tasks that are
                  required by a specific date, otherwise just keep the tasks
                  stacked in priority order
                </li>
                <li>
                  Try to assign one small task to complete on weeks where
                  you&apos;re prohibitively busy or on vacation
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
