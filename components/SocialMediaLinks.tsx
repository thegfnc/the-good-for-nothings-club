import Link from 'next/link'
import { FaGithub, FaInstagram, FaSpotify, FaTiktok, FaThreads } from 'react-icons/fa6'

export default function SocialMediaLinks() {
  return (
    <div className='flex gap-4'>
      <Link
        href='https://www.instagram.com/thegfnc/'
        target='_blank'
        className='transition-opacity hover:opacity-60 active:opacity-100'
      >
        <FaInstagram />
      </Link>
      <Link
        href='https://www.threads.com/@thegfnc'
        target='_blank'
        className='transition-opacity hover:opacity-60 active:opacity-100'
      >
        <FaThreads />
      </Link>
      <Link
        href='https://www.tiktok.com/@thegfnc'
        target='_blank'
        className='transition-opacity hover:opacity-60 active:opacity-100'
      >
        <FaTiktok />
      </Link>
      <Link
        href='https://open.spotify.com/user/31l4gvropwokzlmzymegi3vqa7py?si=c5fce32011494e91'
        target='_blank'
        className='transition-opacity hover:opacity-60 active:opacity-100'
      >
        <FaSpotify />
      </Link>
      <Link
        href='https://github.com/thegfnc'
        target='_blank'
        className='transition-opacity hover:opacity-60 active:opacity-100'
      >
        <FaGithub />
      </Link>
    </div>
  )
}
