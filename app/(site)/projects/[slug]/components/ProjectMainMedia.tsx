import Image from 'next/image'
import dynamic from 'next/dynamic'
import { ViewTransition } from 'react'
import { projectImageTransition } from '@/lib/viewTransitions'
import { getImageUrl } from '@/data/client'
import { getGifVideo } from '@/data/gifVideos'
import GifVideo from '@/components/GifVideo'
import type { Image as GFNC_image, VideoFile } from '@/types'

const MediaPlayer = dynamic(() => import('@/components/MediaPlayer'))

type ProjectMainMediaProps = {
  mainMedia: GFNC_image | VideoFile
  /** Pairs an image hero with its project card for the morph transition. */
  slug: string
}

/** The hero media block shared by every project detail template. */
export default function ProjectMainMedia({
  mainMedia,
  slug,
}: ProjectMainMediaProps) {
  if (mainMedia._type === 'videoFile') {
    return (
      <MediaPlayer
        url={mainMedia.asset.url}
        playing={mainMedia.playing}
        controls={mainMedia.controls}
        loop={mainMedia.loop}
        playsinline={true}
        volume={0}
        muted={true}
        className={`pointer-events-none aspect-video w-full`}
      />
    )
  }

  // Video heroes don't morph: the card always shows an image, and a still
  // stretching into a player reads as a glitch rather than continuity.
  return (
    <ViewTransition
      name={projectImageTransition(slug)}
      share='morph'
      default='none'
    >
      <HeroImage mainMedia={mainMedia} />
    </ViewTransition>
  )
}

function HeroImage({ mainMedia }: { mainMedia: GFNC_image }) {
  const gifVideo = getGifVideo(mainMedia.asset.url)
  if (gifVideo) {
    return (
      <GifVideo video={gifVideo} alt={mainMedia.caption} className='w-full' />
    )
  }

  return (
    <Image
      src={
        mainMedia.asset.extension === 'gif'
          ? getImageUrl(mainMedia).url()
          : getImageUrl(mainMedia).width(1600).quality(90).url()
      }
      width={mainMedia.asset.metadata.dimensions.width}
      height={mainMedia.asset.metadata.dimensions.height}
      alt={mainMedia.caption}
      className={`w-full`}
      sizes='(min-width: 1440px) 1440px, 100vw'
      loading='eager'
      fetchPriority='high'
      placeholder={mainMedia.asset.metadata.lqip}
    />
  )
}
