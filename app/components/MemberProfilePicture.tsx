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

  const imageAsset = isHovering
    ? member.hoverProfilePicture
    : member.profilePicture

  const imageUrl = getImageUrl(imageAsset).width(1400).url()

  return (
    <li>
      <Image
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        src={imageUrl}
        width={imageAsset.asset.metadata.dimensions.width}
        height={imageAsset.asset.metadata.dimensions.height}
        alt={imageAsset.caption}
        placeholder={imageAsset.asset.metadata.lqip}
        className={`h-[600px] border-2 border-black object-cover md:h-auto`}
        sizes='(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 33vw'
        quality={90}
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
