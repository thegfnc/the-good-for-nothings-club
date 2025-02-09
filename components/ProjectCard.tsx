import { GFNC_project } from '@/app/types'
import MediaPlayer from './MediaPlayer'
import Image from 'next/image'
import { getImageUrl } from '@/app/data/client'
import Link from 'next/link'
import { PortableText } from 'next-sanity'

type ProjectCardProps = {
  project: GFNC_project
  priority?: boolean
}

export default function ProjectCard({
  project,
  priority = false,
}: ProjectCardProps) {
  const mainMedia =
    project.mainMedia.find(mainMedia => mainMedia._type === 'videoFile') ||
    project.mainMedia.find(mainMedia => mainMedia._type === 'image')

  if (!mainMedia) return null

  return (
    <div key={project._id} className='grid grid-cols-1 gap-6'>
      <div>
        {/* ^ div prevents grid item from filling height of row in the event text is taller than image */}
        <div className='overflow-hidden border-2 border-black'>
          <div className='relative transition-all duration-1000 hover:scale-[1.05]'>
            {mainMedia._type === 'videoFile' ? (
              <MediaPlayer
                url={mainMedia.asset.url}
                playing={mainMedia.playing}
                controls={mainMedia.controls}
                loop={mainMedia.loop}
                playsinline={true}
                volume={0}
                muted={true}
                className={`pointer-events-none aspect-video w-full`}
              />
            ) : (
              <Image
                src={
                  mainMedia.asset.extension === 'gif'
                    ? getImageUrl(mainMedia).url()
                    : getImageUrl(mainMedia).width(1600).quality(90).url()
                }
                width={mainMedia.asset.metadata.dimensions.width}
                height={mainMedia.asset.metadata.dimensions.height}
                alt={mainMedia.caption}
                className={`aspect-video w-full object-cover object-top`}
                priority={priority}
                unoptimized
                placeholder={mainMedia.asset.metadata.lqip}
                // sizes='(max-width: 1024px) 100vw, 50vw'
              />
            )}
            <Link
              href={`/projects/${project.slug.current}`}
              className='absolute top-0 left-0 h-full w-full bg-black opacity-0 transition-opacity duration-500 hover:opacity-10 active:opacity-20'
            ></Link>
          </div>
        </div>
      </div>
      <div className='space-y-4'>
        <div className='flex items-center gap-2 font-sans text-sm font-bold uppercase'>
          <span>{project.type}</span>
          <span>·</span>
          <span>
            {new Date(project.dateCompleted).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              timeZone: 'UTC',
            })}
          </span>
        </div>
        <div>
          <Link href={`/projects/${project.slug.current}`} className='block'>
            <h2 className='text-[32px] sm:text-[40px]'>{project.title}</h2>
          </Link>
          <h3 className='text-lg font-medium sm:text-xl'>
            – {project.clientName}
          </h3>
        </div>
        <div className='portable-text text-2xl leading-tight'>
          <PortableText value={project.summary} />
        </div>
      </div>
    </div>
  )
}
