import Link from 'next/link'

export default function Header() {
  return (
    <header className='text-center font-sans font-black uppercase md:px-8 md:pt-8 xl:px-16 xl:pt-16'>
      <div className='m-auto grid max-w-[1576px] grid-cols-2 border-b-2 border-black bg-background md:grid-cols-4 md:border-2'>
        <Link
          href='/'
          className='border-b-2 border-r-2 border-black px-4 py-5 transition-colors hover:bg-black/10 hover:no-underline active:bg-black/20 md:border-b-0 md:px-8 md:py-8'
        >
          G.F.N.C.
        </Link>
        <Link
          href='/projects'
          className='border-b-2 border-black px-4 py-5 transition-colors hover:bg-black/10 hover:no-underline active:bg-black/20 md:border-b-0 md:border-r-2 md:px-8 md:py-8'
        >
          Projects
        </Link>
        <Link
          href='https://shop.thegoodfornothings.club/'
          className='border-r-2 border-black px-4 py-5 transition-colors hover:bg-black/10 hover:no-underline active:bg-black/20 md:px-8 md:py-8'
        >
          Shop
        </Link>
        <Link
          href='/contact'
          className='px-4 py-5 transition-colors hover:bg-black/10 hover:no-underline active:bg-black/20 md:px-8 md:py-8'
        >
          Contact
        </Link>
      </div>
    </header>
  )
}
