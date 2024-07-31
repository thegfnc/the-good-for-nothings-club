'use client'

import Image from 'next/image'
import { getImageUrl } from '../data/client'
import { GFNC_member } from '../types'
import { useState } from 'react'

type MemberProfilePictureProps = {
  member: GFNC_member
}

export default function MemberProfilePicture({
  member,
}: MemberProfilePictureProps) {
  const [isHovering, setIsHovering] = useState(false)

  const { profilePicture, hoverProfilePicture } = member

  const profilePictureUrl = getImageUrl(profilePicture)
    .width(1400)
    .quality(90)
    .url()

  const hoverProfilePictureUrl = getImageUrl(hoverProfilePicture)
    .width(1400)
    .quality(90)
    .url()

  const objectPosition = `${(profilePicture.hotspot?.x || 1) * 100}% ${(profilePicture.hotspot?.y || 1) * 100}%`

  return (
    <li
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Image
        src={profilePictureUrl}
        width={profilePicture.asset.metadata.dimensions.width}
        height={profilePicture.asset.metadata.dimensions.height}
        alt={profilePicture.caption}
        className={`aspect-square border-2 border-black object-cover md:h-auto xl:aspect-auto ${isHovering ? 'hidden' : 'block'}`}
        style={{
          objectPosition,
        }}
        priority={true}
        unoptimized
        // sizes='(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 33vw'
        // quality={90}
        // placeholder={profilePicture.asset.metadata.lqip}
      />
      <Image
        src={hoverProfilePictureUrl}
        width={hoverProfilePicture.asset.metadata.dimensions.width}
        height={hoverProfilePicture.asset.metadata.dimensions.height}
        alt={hoverProfilePicture.caption}
        className={`aspect-square border-2 border-black object-cover md:h-auto xl:aspect-auto ${isHovering ? 'block' : 'hidden'}`}
        style={{
          objectPosition,
        }}
        priority={true}
        unoptimized
        // sizes='(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 33vw'
        // quality={90}
        // placeholder={hoverProfilePicture.asset.metadata.lqip}
      />
      <h3 className='mt-6 text-[32px]'>{member.fullName}</h3>
      <div className='text-xl leading-tight'>
        <p className='mt-4'>
          Member #{String(member.memberNumber).padStart(3, '0')} - since{' '}
          {new Date(member.startDate).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC',
          })}
        </p>
        <p>
          <em>{member.roles.join(', ').toLowerCase()}</em>
        </p>
      </div>
    </li>
  )
}
