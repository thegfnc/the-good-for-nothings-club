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
}

export default function MediaPlayer({
  url,
  playing = false,
  controls = false,
  loop = false,
  playsinline = false,
  volume = 1,
  muted = false,
}: MediaPlayerProps) {
  return (
    <Suspense>
      <ReactPlayer
        url={url}
        playing={playing}
        controls={controls}
        loop={loop}
        playsinline={playsinline}
        volume={0}
        muted={muted}
        width='100%'
        height='100%'
      />
    </Suspense>
  )
}
