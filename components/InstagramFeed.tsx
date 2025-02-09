'use client'

import type * as Behold from '@behold/types'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function InstagramFeed({ feedId }: { feedId: string }) {
  const [feed, setFeed] = useState<Behold.Feed | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchFeed() {
      try {
        const rawFeed = await fetch(`/api/instagram-feed?feedId=${feedId}`, {
          signal: controller.signal,
        })

        if (!rawFeed.ok) {
          const errorMessage = await rawFeed.text()
          throw new Error(errorMessage)
        }

        const feedJSON: Behold.Feed = await rawFeed.json()
        setFeed(feedJSON)
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error:', err)
        }
      }
    }

    fetchFeed()

    return () => {
      controller.abort()
    }
  }, [feedId])

  if (!feed) {
    return <div>Loading...</div>
  }

  const postEls = feed.posts.map(post => {
    // IMAGE or CAROUSEL_ALBUM
    let mediaEl = (
      <Image
        src={post.sizes.medium.mediaUrl}
        alt={post.prunedCaption}
        fill
        className='object-cover'
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      />
    )

    // VIDEO
    if (post.mediaType === 'VIDEO') {
      mediaEl = (
        <video
          poster={post.sizes.medium.mediaUrl}
          src={post.mediaUrl}
          muted={true}
          autoPlay={true}
          loop={true}
        ></video>
      )
    }

    return (
      <a
        key={post.id}
        href={post.permalink}
        target='_blank'
        rel='noopener noreferrer'
        className='relative aspect-square overflow-hidden'
      >
        <figure
          key={post.id}
          className='transition-transform duration-300 hover:scale-105'
        >
          {mediaEl}
        </figure>
      </a>
    )
  })

  return (
    <div className='flex flex-col justify-between bg-black/10 p-4 font-sans'>
      <div className='flex'>
        <div className='w-28 shrink-0'>
          <Image
            src={feed.profilePictureUrl}
            alt='@thegfnc Profile Picture'
            width={100}
            height={100}
            className='aspect-square rounded-full'
          />
        </div>
        <div className='flex flex-col items-start justify-center gap-1'>
          <a
            href={`https://www.instagram.com/${feed.username}`}
            className='font-bold'
          >
            @{feed.username}
          </a>
          <div className='text-xs'>{feed.biography}</div>
          <div className='text-sm font-medium'>
            {feed.followersCount} followers
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
        {postEls}
      </div>
      <a
        href={`https://www.instagram.com/${feed.username}`}
        className='bg-primary text-primary-foreground hover:bg-primary/90 items-center justify-center p-2 text-center font-sans text-xs tracking-[2px] whitespace-nowrap uppercase transition-colors hover:no-underline'
        target='_blank'
      >
        Follow us on Instagram
      </a>
    </div>
  )
}
