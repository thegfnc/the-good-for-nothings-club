'use client'

import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/counter.css'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox, {
  RenderSlideProps,
  useLightboxState,
} from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import { SanityAssetDocument } from 'next-sanity'
import { urlFor } from '../data/client'
import Masonry from './Masonry'

type PhotoGalleryProps = {
  photos: SanityAssetDocument[]
}

const LightboxSlide = ({
  slide,
  rect,
  photos,
}: RenderSlideProps & PhotoGalleryProps) => {
  const { currentIndex } = useLightboxState()
  if (!slide.height || !slide.width) return null

  const width = Math.min(rect.width, (rect.height / slide.height) * slide.width)

  const height = Math.min(
    rect.height,
    (rect.width / slide.width) * slide.height
  )

  return (
    <Image
      src={slide.src}
      width={width}
      height={height}
      alt={slide.alt || ''}
      placeholder={photos[currentIndex].asset.metadata.lqip}
    />
  )
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
        plugins={[Counter, Zoom]}
        slides={photos.map(photo => ({
          src: urlFor(photo).width(2400).url(),
          alt: photo.caption,
          height: photo.asset.metadata.dimensions.height,
          width: photo.asset.metadata.dimensions.width,
          placeholder: photo.asset.metadata.lqip,
        }))}
        counter={{
          container: {
            className: 'font-sans',
            style: { top: 'auto', bottom: 0, left: 'auto', right: 0 },
          },
        }}
        render={{
          slide: ({ slide, rect, offset }) => (
            <LightboxSlide
              slide={slide}
              rect={rect}
              offset={offset}
              photos={photos}
            />
          ),
          iconZoomIn: () => null,
          iconZoomOut: () => null,
        }}
      />
    </>
  )
}
