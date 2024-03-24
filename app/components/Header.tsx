import Link from 'next/link'

export default function Header() {
  return (
    <header className='text-center font-sans font-black uppercase md:px-8 md:pt-8 xl:px-16 xl:pt-16'>
      <div className='m-auto grid max-w-[1792px] grid-cols-3 border-b-2 border-black bg-background md:border-2'>
        <Link
          href='/'
          className='border-r-2 border-black p-8 underline-offset-2 hover:underline'
        >
          G.F.N.C.
        </Link>
        <Link
          href='/projects'
          className='border-r-2 border-black p-8 underline-offset-2 hover:underline'
        >
          Projects
        </Link>
        <Link
          href='/contact'
          className='p-8 underline-offset-2 hover:underline'
        >
          Contact
        </Link>
      </div>
    </header>
  )
}
