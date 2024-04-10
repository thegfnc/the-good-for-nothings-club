import Link from 'next/link'
import { cn } from '../lib/utils'

const menuItems = [
  {
    name: 'All',
    type: 'all',
  },
  {
    name: 'Web',
    type: 'web',
  },
  {
    name: 'Video',
    type: 'video',
  },
  {
    name: 'Photo',
    type: 'photo',
  },
  {
    name: 'Audio',
    type: 'audio',
  },
]

type ProjectsProps = {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Projects({ searchParams }: ProjectsProps) {
  const { type = 'all' } = searchParams

  return (
    <main>
      <section className='pt-8 md:px-8 md:pt-16 xl:px-16'>
        <div className='mx-auto max-w-[1792px] border-y-2 border-black bg-background px-4 py-6 md:border-x-2 md:px-12 md:py-12'>
          <h1 className='pt-6 text-[32px] leading-none tracking-[-0.04em] md:pt-12 md:text-[48px] lg:text-[96px]'>
            Projects
          </h1>
          <div className='mb-10 mt-10 sm:mt-12 md:mt-24'>
            <ul className='flex overflow-x-scroll border-y-2 border-black'>
              {menuItems.map(item => (
                <li key={item.name}>
                  <Link
                    className={cn(
                      'block px-6 py-5 font-sans text-xl font-black uppercase leading-tight transition-colors hover:bg-black hover:text-white hover:no-underline active:bg-black/80',
                      item.type === type ? 'bg-black text-white' : 'text-black'
                    )}
                    href={
                      item.type !== 'all'
                        ? `/projects?type=${item.type}`
                        : '/projects'
                    }
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className='grid grid-cols-1 gap-24 pt-12'>Projects List</div>
          </div>
        </div>
      </section>
    </main>
  )
}
