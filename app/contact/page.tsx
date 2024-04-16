import Link from 'next/link'

import ContactForm from './ContactUsForm'
import SocialMediaLinks from '../components/SocialMediaLinks'
import Map from '../components/Map'

export default async function Contact() {
  return (
    <main>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='mx-auto max-w-[1792px] border-y-2 border-black bg-background px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <h1 className='pt-6 text-[32px] leading-none tracking-[-0.04em] md:pt-12 md:text-[48px] lg:text-[96px]'>
            Contact
          </h1>
          <div className='mb-10 mt-10 grid grid-cols-1 gap-24 border-t-2 border-black pt-12 sm:mt-12 md:mt-24 lg:grid-cols-2 lg:gap-12'>
            <div>
              <h3 className='text-[32px]'>Say Hello</h3>
              <div className='mt-6'>
                <ContactForm />
              </div>
            </div>
            <div className='space-y-12'>
              <div className='space-y-6'>
                <h3 className='text-[32px]'>Email</h3>
                <div>
                  <Link
                    href='mailto:hello@thegoodfornothings.club'
                    className='text-2xl'
                  >
                    hello@thegoodfornothings.club
                  </Link>
                </div>
              </div>
              <div className='space-y-6'>
                <h3 className='text-[32px]'>Social</h3>
                <div className='text-[32px]'>
                  <SocialMediaLinks />
                </div>
              </div>
              <div className='space-y-6'>
                <h3 className='text-[32px]'>Location</h3>
                <div className='aspect-video'>
                  <Map />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
