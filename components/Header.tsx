'use client'

import Link from 'next/link'
import { cn } from '../lib/utils'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const MENU_ITEMS = [
  { href: '/', text: 'Home' },
  {
    href: '/projects',
    text: 'Projects',
    showOnMobile: true,
  },
  { href: 'https://shop.thegoodfornothings.club/', text: 'Shop' },
  { href: '/about', text: 'About' },
  { href: '/contact', text: 'Contact', showOnMobile: true },
]

export default function Header() {
  const pathname = usePathname()
  const [isMenuSheetVisible, setIsMenuSheetVisible] = useState(false)
  const [hoveredMenuItemIndex, setHoveredMenuItemIndex] = useState(-1)

  useEffect(() => {
    setIsMenuSheetVisible(false)
  }, [pathname])

  return (
    <header
      className='relative text-center font-sans font-black uppercase md:px-8 md:pt-8 xl:px-16 xl:pt-16'
      onMouseOut={() => setHoveredMenuItemIndex(-1)}
    >
      <div className='bg-background relative z-10 m-auto grid max-w-(--page-max-width) grid-cols-[64px_1fr_1fr] border-b-2 border-black md:grid-cols-5 md:border-2'>
        <Sheet open={isMenuSheetVisible} onOpenChange={setIsMenuSheetVisible}>
          <SheetTrigger className='flex cursor-pointer items-center justify-center transition-colors hover:bg-black/10 active:bg-black/20 md:hidden'>
            <Menu height='28px' width='28px' />
          </SheetTrigger>
          <SheetContent side='left'>
            <SheetHeader>
              <SheetTitle className='font-normal'>Menu</SheetTitle>
            </SheetHeader>
            <ul className='flex flex-col gap-4 py-12 font-sans text-3xl font-black uppercase'>
              {MENU_ITEMS.map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className='block'
                    onClick={() => setIsMenuSheetVisible(false)}
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </SheetContent>
        </Sheet>

        {MENU_ITEMS.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              !item.showOnMobile && 'hidden md:block',
              'border-black px-4 py-5 transition-colors not-first-of-type:border-l-2 hover:bg-black/10 hover:no-underline active:bg-black/20 md:border-b-0 md:px-6 md:py-6 xl:px-8 xl:py-8'
            )}
            onMouseOver={() => setHoveredMenuItemIndex(index)}
          >
            {item.text}
          </Link>
        ))}
      </div>
      <div
        className={cn(
          'bg-background pointer-events-none absolute top-full right-0 left-0 mx-auto grid max-w-(--page-max-width) -translate-y-full grid-cols-4 p-4 opacity-0 transition-all',
          hoveredMenuItemIndex === 1 &&
            'pointer-events-auto translate-y-0 opacity-100'
        )}
      >
        <div>In Progress</div>
        <div>Completed</div>
        <div>Paused</div>
        <div>Cancelled</div>
      </div>
    </header>
  )
}
