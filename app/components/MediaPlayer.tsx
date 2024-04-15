'use client'

import { Suspense } from 'react'
import ReactPlayer from 'react-player'

type MediaPlayerProps = {
  url: string
}

export default function MediaPlayer({ url }: MediaPlayerProps) {
  return (
    <Suspense>
      <ReactPlayer url={url} width='100%' height='100%' />
    </Suspense>
  )
}
