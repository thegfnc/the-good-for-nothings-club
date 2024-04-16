'use client'

import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { useRef } from 'react'
import SocialMediaLinks from './SocialMediaLinks'

export default function Footer() {
  const ref = useRef<HTMLInputElement>(null)

  const handleSubmit = async () => {
    const email = ref.current?.value
    if (!email) return

    const response = await fetch('/api/newsletter-sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (response.ok) {
      console.log('Success!')
    } else {
      console.error('Failed to subscribe')
    }
  }

  return (
    <footer className='pb-8 pt-8 font-sans md:px-8 md:pt-16 xl:px-16 xl:pb-16'>
      <div className='mx-auto max-w-[1792px] border-y-2 border-black bg-background px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
        <div className='flex flex-col items-center justify-between gap-5 bg-black/5 p-5 text-center text-xl sm:p-10 md:text-left md:text-2xl lg:flex-row lg:p-12'>
          <div className=''>Subscribe to our newsletter</div>
          <div className='flex w-full max-w-96 flex-grow'>
            <Input placeholder='Enter your email' ref={ref} />
            <Button onClick={handleSubmit}>Subscribe</Button>
          </div>
        </div>
        <div className='mt-10 flex flex-col-reverse items-center justify-between gap-6 md:flex-row'>
          <div className='text-center'>
            &copy; {new Date().getFullYear()} The Good for Nothings Club LLC.
            All rights reserved.
          </div>
          <div className='text-2xl'>
            <SocialMediaLinks />
          </div>
        </div>
      </div>
    </footer>
  )
}
