'use client'

import Image from 'next/image'
import Masonry from './Masonry'
import { urlFor } from '../data/client'
import { SanityAssetDocument } from 'next-sanity'

type PhotoGalleryProps = {
  photos: SanityAssetDocument[]
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  return (
    <Masonry className='gap-4 md:gap-8'>
      {photos.map(photo => (
        <div key={photo._key} className='overflow-hidden'>
          <Image
            src={urlFor(photo).width(1400).url()}
            width={photo.asset.metadata.dimensions.width}
            height={photo.asset.metadata.dimensions.height}
            alt={photo.caption}
            placeholder={photo.asset.metadata.lqip}
            className={`w-full transition-all duration-1000 hover:scale-105`}
          />
        </div>
      ))}
    </Masonry>
  )
}
