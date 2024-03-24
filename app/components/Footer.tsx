import Link from 'next/link'
import { FaGithub, FaInstagram, FaSpotify } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className='pb-8 pt-8 font-sans md:px-8 md:pt-16 xl:px-16 xl:pb-16'>
      <div className='mx-auto max-w-[1792px] border-y-2 border-black bg-background px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
        <div className='bg-black/5 p-5 text-center text-xl sm:p-10 md:text-left md:text-2xl lg:p-12'>
          Subscribe to our newsletter
        </div>
        <div className='mt-10 flex flex-col-reverse items-center justify-between gap-6 md:flex-row'>
          <div>
            &copy; {new Date().getFullYear()} The Good for Nothings Club LLC.
            All rights reserved.
          </div>
          <div className='flex gap-4 text-2xl'>
            <Link href='https://www.instagram.com/thegfnc/' target='_blank'>
              <FaInstagram />
            </Link>
            <Link
              href='https://open.spotify.com/user/31l4gvropwokzlmzymegi3vqa7py?si=c5fce32011494e91'
              target='_blank'
            >
              <FaSpotify />
            </Link>
            <Link href='https://github.com/thegfnc' target='_blank'>
              <FaGithub />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
