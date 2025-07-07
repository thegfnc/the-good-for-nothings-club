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
    width: 28,
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

  return (
    <TooltipProvider>
      <div className="flex items-center">
        <div className="flex items-center">
          {members.map((member, index) => (
            <Tooltip key={member._id}>
              <TooltipTrigger asChild>
                <Link
                  href={`/members/${member.slug.current}`}
                  className={`relative rounded-full border-1 border-black/40 hover:border-gray-600 transition-colors ${index > 0 ? config.spacing : ''}`}
                  style={{
                    zIndex: members.length - index,
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
        </div>
      </div>
    </TooltipProvider>
  )
}
