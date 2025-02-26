'use client'

const PROMO_VERSION = 1 // Increment this to show the promo popup again
const PROMO_POPUP_KEY = `promoPopupDismissed_V${PROMO_VERSION}`
const POPUP_DELAY = 1000

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const hasSeenPromo = localStorage.getItem(PROMO_POPUP_KEY)

    if (!hasSeenPromo) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, POPUP_DELAY)

      return () => clearTimeout(timer) // Cleanup timeout on unmount
    }
  }, [])

  function handleOpenChange(open: boolean) {
    if (!open) {
      localStorage.setItem(PROMO_POPUP_KEY, 'true')
    }

    setIsOpen(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='max-h-screen overflow-y-scroll'>
        <DialogHeader>
          <DialogTitle>Keep It Local, Yokels</DialogTitle>
        </DialogHeader>
        <Image
          src='https://cdn.sanity.io/images/ojzttvlq/production/8b350ca9ef64e4df3a7ab74391b4b54542639982-2000x2997.png'
          alt='Flyer for Keep It Local, Yokels event'
          height={2997}
          width={2000}
        />
        <div className='flex justify-center'>
          <Link
            href='https://partiful.com/e/gBLpBXdII2sEThii00b8'
            target='_blank'
            className='rounded-md border-2 border-black bg-green-300 px-8 py-2 font-sans text-lg font-medium whitespace-nowrap text-black transition-colors hover:bg-black hover:text-white hover:no-underline'
          >
            RSVP HERE
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
