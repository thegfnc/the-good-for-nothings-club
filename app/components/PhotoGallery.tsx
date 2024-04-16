'use client'

import Image from 'next/image'
import Masonry from './Masonry'
import { urlFor } from '../data/client'
import { SanityAssetDocument } from 'next-sanity'
import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

type PhotoGalleryProps = {
  photos: SanityAssetDocument[]
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [lightboxIndex, setLighboxIndex] = useState(-1)

  return (
    <>
      <Masonry className='gap-4 md:gap-8'>
        {photos.map((photo, index) => (
          <div key={photo._key} className='overflow-hidden'>
            <Image
              src={urlFor(photo).width(1400).url()}
              width={photo.asset.metadata.dimensions.width}
              height={photo.asset.metadata.dimensions.height}
              alt={photo.caption}
              placeholder={photo.asset.metadata.lqip}
              className={`w-full transition-all duration-1000 hover:scale-105`}
              onClick={() => setLighboxIndex(index)}
            />
          </div>
        ))}
      </Masonry>
      <Lightbox
        open={lightboxIndex > -1}
        close={() => setLighboxIndex(-1)}
        index={lightboxIndex}
        slides={photos.map(photo => ({
          src: urlFor(photo).width(2000).url(),
          alt: photo.caption,
          height: photo.asset.metadata.dimensions.height,
          width: photo.asset.metadata.dimensions.width,
        }))}
      />
    </>
  )
}
