import { GFNC_project } from '@/types'
import Image from 'next/image'
import { getImageUrl } from '@/data/client'
import { PortableText } from 'next-sanity'
import { cn } from '@/lib/utils'
import getProjectDateString from '@/lib/getProjectDateString'
import Link from 'next/link'
import MemberAvatarStack from './MemberAvatarStack'
import { Badge } from './ui/badge'

type ProjectCardSmallProps = {
  project: GFNC_project
}

export default function ProjectCardSmall({ project }: ProjectCardSmallProps) {
  const mainMedia = project.mainMedia.find(
    mainMedia => mainMedia._type === 'image'
  )

  if (!mainMedia) return null

  const date = getProjectDateString(project)

  return (
    <div
      key={project._id}
      className='group relative flex flex-col justify-between gap-5 border-1 border-black/15 bg-black/5 p-4 transition-all hover:border-black hover:bg-black/10'
    >
      <div className='flex items-start gap-3'>
        <Image
          src={
            mainMedia.asset.extension === 'gif'
              ? getImageUrl(mainMedia).url()
              : getImageUrl(mainMedia).width(1600).quality(90).url()
          }
          width={mainMedia.asset.metadata.dimensions.width}
          height={mainMedia.asset.metadata.dimensions.height}
          alt={mainMedia.caption}
          className='w-1/4 object-cover'
          priority={false}
          unoptimized
          placeholder={mainMedia.asset.metadata.lqip}
        />
        <div className='space-y-1'>
          <h2 className='relative z-10 text-[16px] leading-[1.1] font-bold sm:text-[20px]'>
            <Link
              href={`/projects/${project.slug.current}`}
              className='block hover:no-underline'
            >
              {project.title}
            </Link>
          </h2>
          <div className='portable-text font-sans text-sm leading-tight font-light tracking-wide'>
            <PortableText value={project.summary} />
          </div>
        </div>
      </div>
      <div className='flex items-end justify-between gap-x-2 gap-y-1'>
        <div className='font-sans leading-none uppercase'>
          <div className='text-sm font-bold text-balance leading-tighter'>{project.clientName}</div>
          <div className='mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs'>
            <Badge className='font-normal'>{project.type}</Badge>
            {date && <span>{date}</span>}
          </div>
        </div>
        {project.membersInvolved && project.membersInvolved.length > 0 && (
          <MemberAvatarStack members={project.membersInvolved} size='sm' />
        )}
      </div>
      <Link
        href={`/projects/${project.slug.current}`}
        className='absolute top-0 right-0 bottom-0 left-0'
      />
    </div>
  )
}
