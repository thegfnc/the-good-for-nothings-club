import { GFNC_member } from '@/types'
import { getImageUrl } from '@/data/client'
import Image from 'next/image'
import Link from 'next/link'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type MemberAvatarStackProps = {
  members: GFNC_member[]
  size?: 'sm' | 'md' | 'lg'
}

const sizeConfig = {
  sm: {
    width: 32,
    textSize: 'text-xs',
    spacing: '-ml-2'
  },
  md: {
    width: 40,
    textSize: 'text-sm',
    spacing: '-ml-3'
  },
  lg: {
    width: 48,
    textSize: 'text-base',
    spacing: '-ml-4'
  }
}

export default function MemberAvatarStack({
  members,
  size = 'md'
}: MemberAvatarStackProps) {
  if (!members || members.length === 0) return null

  const config = sizeConfig[size]
  const displayMembers = members.slice(0, 4) // Show max 4 avatars
  const remainingCount = members.length - displayMembers.length

  return (
    <TooltipProvider>
      <div className="flex items-center">
        <div className="flex items-center">
          {displayMembers.map((member, index) => (
            <Tooltip key={member._id}>
              <TooltipTrigger asChild>
                <Link
                  href={`/members/${member.slug.current}`}
                  className={`relative rounded-full border-2 border-black hover:border-gray-600 transition-colors ${index > 0 ? config.spacing : ''}`}
                  style={{
                    zIndex: displayMembers.length - index,
                    width: config.width,
                    height: config.width, // Use width for both to ensure perfect circle
                    display: 'block'
                  }}
                >
                  <Image
                    src={getImageUrl(member.profilePicture).width(config.width * 2).quality(90).url()}
                    width={config.width}
                    height={config.width} // Use width for both to ensure perfect circle
                    alt={member.fullName}
                    className="rounded-full object-cover w-full h-full"
                    placeholder="blur"
                    blurDataURL={member.profilePicture.asset.metadata.lqip}
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{member.fullName}</p>
              </TooltipContent>
            </Tooltip>
          ))}
          {remainingCount > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`flex items-center justify-center rounded-full border-2 border-black bg-gray-100 ${config.spacing} ${config.textSize} font-medium text-gray-600`}
                  style={{
                    width: config.width,
                    height: config.width, // Use width for both to ensure perfect circle
                    zIndex: 0
                  }}
                >
                  +{remainingCount}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="max-w-xs">
                  <p className="font-medium mb-1">Additional members:</p>
                  <p>{members.slice(4).map(m => m.fullName).join(', ')}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}
