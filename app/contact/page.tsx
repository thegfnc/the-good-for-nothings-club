import Link from 'next/link'
import { Label } from '../components/ui/Label'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'

export default async function Contact() {
  return (
    <main>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='mx-auto max-w-[1792px] border-y-2 border-black bg-background px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <h1 className='pt-6 text-[32px] leading-none tracking-[-0.04em] md:pt-12 md:text-[48px] lg:text-[96px]'>
            Contact
          </h1>
          <div className='mt-10 grid grid-cols-1 gap-12 border-t-2 border-black pt-12 sm:mt-12 md:mt-24 lg:grid-cols-2'>
            <div>
              <h3 className='text-[32px] leading-none'>Say Hello</h3>
              <form>
                <Label htmlFor='name'>Name</Label>
                <Input
                  type='text'
                  id='name'
                  name='name'
                  required
                  maxLength={256}
                  autoComplete='name'
                />
                <Label htmlFor='email'>Email</Label>
                <Input
                  type='email'
                  id='email'
                  name='email'
                  required
                  maxLength={256}
                  autoComplete='email'
                />
                <Label htmlFor='phone-number'>Phone Number (optional)</Label>
                <Input
                  type='tel'
                  id='phone-number'
                  name='phone-number'
                  maxLength={256}
                  autoComplete='tel'
                />
                <Label htmlFor='website'>Website (optional)</Label>
                <Input
                  type='url'
                  id='website'
                  name='website'
                  maxLength={256}
                  autoComplete='url'
                />
                <Label htmlFor='subject'>Subject</Label>
                <Input
                  type='text'
                  id='subject'
                  name='subject'
                  required
                  maxLength={256}
                />
                <Label htmlFor='message'>Message</Label>
                <Textarea
                  id='message'
                  name='message'
                  rows={6}
                  required
                  maxLength={5000}
                />
              </form>
            </div>
            <div>
              <h3 className='text-[32px] leading-none'>Email</h3>
              <div>
                <Link href='mailto:hello@thegoodfornothings.club'>
                  hello@thegoodfornothings.club
                </Link>
              </div>
              <h3 className='text-[32px] leading-none'>Social</h3>
              <h3 className='text-[32px] leading-none'>Location</h3>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
