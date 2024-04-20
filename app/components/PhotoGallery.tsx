'use client'

import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/counter.css'

import { useState } from 'react'
import Image from 'next/image'
import PhotoAlbum, { Photo, RenderPhotoProps } from 'react-photo-album'
import Lightbox, {
  RenderSlideProps,
  useLightboxState,
} from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import { SanityAssetDocument } from 'next-sanity'
import { getImageUrl } from '../data/client'
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props'

type PhotoGalleryProps = {
  photos: SanityAssetDocument[]
}

type PhotoAlbumPhotoProps = Photo & {
  placeholder: PlaceholderValue
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
      sizes='100vw'
      quality={100}
    />
  )
}

const PhotoAlbumPhoto = ({
  photo,
  imageProps,
  wrapperStyle,
}: RenderPhotoProps<PhotoAlbumPhotoProps>) => {
  return (
    <div className='overflow-hidden' style={wrapperStyle}>
      <Image
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt={photo.alt || ''}
        placeholder={photo.placeholder}
        className={`w-full cursor-pointer transition-all duration-1000 hover:scale-105`}
        onClick={imageProps.onClick}
        sizes='(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw'
        quality={90}
      />
    </div>
  )
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [lightboxIndex, setLighboxIndex] = useState(-1)

  const photoAlbumPhotos = photos.map(photo => ({
    src: getImageUrl(photo).width(1400).url(),
    alt: photo.caption,
    width: photo.asset.metadata.dimensions.width,
    height: photo.asset.metadata.dimensions.height,
    placeholder: photo.asset.metadata.lqip,
  }))

  return (
    <>
      <PhotoAlbum
        photos={photoAlbumPhotos}
        layout='masonry'
        columns={containerWidth => {
          if (containerWidth > 1280) return 3
          if (containerWidth > 768) return 2
          return 1
        }}
        spacing={containerWidth => (containerWidth > 768 ? 32 : 16)}
        onClick={({ index: current }) => setLighboxIndex(current)}
        defaultContainerWidth={1281}
        renderPhoto={PhotoAlbumPhoto}
      />
      <Lightbox
        open={lightboxIndex > -1}
        close={() => setLighboxIndex(-1)}
        index={lightboxIndex}
        plugins={[Counter, Zoom]}
        slides={photos.map(photo => ({
          src: getImageUrl(photo).width(2400).url(),
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
