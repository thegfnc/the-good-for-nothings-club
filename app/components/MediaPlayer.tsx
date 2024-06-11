'use client'

import { Suspense } from 'react'
import ReactPlayer from 'react-player'

type MediaPlayerProps = {
  url: string
  playing?: boolean
  controls?: boolean
  loop?: boolean
  playsinline?: boolean
  volume?: number
  muted?: boolean
  className?: string
}

export default function MediaPlayer({
  url,
  playing = false,
  controls = false,
  loop = false,
  playsinline = false,
  volume = 0,
  muted = false,
  className = '',
}: MediaPlayerProps) {
  return (
    <Suspense>
      <div className={className}>
        <ReactPlayer
          url={url}
          playing={playing}
          controls={controls}
          loop={loop}
          playsinline={playsinline}
          volume={volume}
          muted={muted}
          width='100%'
          height='100%'
        />
      </div>
    </Suspense>
  )
}
