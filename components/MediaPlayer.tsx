'use client'

import { Suspense, use, useState } from 'react'
import { browser } from 'react-dom'
import ReactPlayer from 'react-player'

import WidgetBoundary from './WidgetBoundary'

type MediaPlayerProps = {
  url: string
  playing?: boolean
  controls?: boolean
  loop?: boolean
  playsinline?: boolean
  volume?: number
  muted?: boolean
  className?: string
  /**
   * Show a poster button and only mount the player (and start streaming the
   * file) after the user clicks. Video files served from Convex storage are
   * raw file egress per viewer, so autoplaying them is expensive — case study
   * videos opt in to this instead of `playing`.
   */
  clickToPlay?: boolean
}

/**
 * react-player v3 SSRs its players as web components with declarative
 * shadow DOM (<youtube-video> etc). Hydrating that markup is timing-
 * sensitive (slow clients, render bots especially, hit React #418 and the
 * whole tree gets client-regenerated anyway), so the player renders in the
 * browser only. The Suspense fallback is the server HTML and keeps the box.
 * A player that throws shows a retry instead of taking down the page.
 */
export default function MediaPlayer(props: MediaPlayerProps) {
  const className = props.className ?? 'w-full'
  return (
    <WidgetBoundary
      label='video'
      fallbackHref={props.url}
      fallbackText='Open the video'
      className='flex aspect-video w-full flex-col items-center justify-center gap-3 border-2 border-black p-6 text-center font-sans'
    >
      <Suspense fallback={<div className={className} />}>
        <BrowserPlayer {...props} className={className} />
      </Suspense>
    </WidgetBoundary>
  )
}

function BrowserPlayer({
  url,
  playing = false,
  controls = false,
  loop = false,
  playsinline = false,
  volume = 0,
  muted = false,
  className = 'w-full',
  clickToPlay = false,
}: MediaPlayerProps) {
  use(browser('react-player hydration is timing-sensitive'))
  const [started, setStarted] = useState(false)

  if (clickToPlay && !started) {
    return (
      <div className={className}>
        <button
          type='button'
          onClick={() => setStarted(true)}
          aria-label='Play video'
          className='group flex h-full w-full cursor-pointer items-center justify-center gap-4 bg-black text-white'
        >
          <svg
            viewBox='0 0 24 24'
            fill='currentColor'
            aria-hidden='true'
            className='h-12 w-12 transition-transform group-hover:scale-110'
          >
            <path d='M8 5v14l11-7z' />
          </svg>
          <span className='font-sans text-sm font-black tracking-[1px] uppercase'>
            Play video
          </span>
        </button>
      </div>
    )
  }

  return (
    <Suspense>
      <div className={className}>
        <ReactPlayer
          src={url}
          playing={clickToPlay ? true : playing}
          controls={clickToPlay ? true : controls}
          loop={loop}
          playsInline={playsinline}
          volume={volume}
          muted={muted}
          width='100%'
          height='100%'
        />
      </div>
    </Suspense>
  )
}
