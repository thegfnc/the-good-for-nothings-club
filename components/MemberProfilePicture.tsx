'use client'

import Image from 'next/image'
import Link from 'next/link'
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
      <Link href={`/members/${member.slug.current}`} className="block group">
        <Image
          src={profilePictureUrl}
          width={profilePicture.asset.metadata.dimensions.width}
          height={profilePicture.asset.metadata.dimensions.height}
          alt={profilePicture.caption}
          className={`aspect-square border-2 border-black object-cover md:h-auto lg:aspect-auto transition-colors group-hover:border-gray-600 ${isHovering ? 'hidden' : 'block'}`}
          style={{
            objectPosition,
          }}
          priority={true}
          unoptimized
          placeholder={profilePicture.asset.metadata.lqip}
        />
        <Image
          src={hoverProfilePictureUrl}
          width={hoverProfilePicture.asset.metadata.dimensions.width}
          height={hoverProfilePicture.asset.metadata.dimensions.height}
          alt={hoverProfilePicture.caption}
          className={`aspect-square border-2 border-black object-cover md:h-auto lg:aspect-auto transition-colors group-hover:border-gray-600 ${isHovering ? 'block' : 'hidden'}`}
          style={{
            objectPosition,
          }}
          priority={true}
          placeholder={hoverProfilePicture.asset.metadata.lqip}
          unoptimized
        />
        <h3 className='mt-4 text-[24px] group-hover:underline'>{member.fullName}</h3>
        <div className='mt-1'>
          <p className='text-sm leading-tight'>
            Member #{String(member.memberNumber).padStart(3, '0')} - since{' '}
            {new Date(member.startDate).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
              timeZone: 'UTC',
            })}
          </p>
          <p className='text-sm leading-tight font-light'>
            <em>{member.roles.join(', ').toLowerCase()}</em>
          </p>
        </div>
      </Link>
    </li>
  )
}
