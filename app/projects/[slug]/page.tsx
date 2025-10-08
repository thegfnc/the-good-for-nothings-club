import { cmsFetch, getImageUrl } from '../../../data/client'
import { GFNC_project } from '../../../types'
import { toPlainText } from '@portabletext/toolkit'
import { Metadata, ResolvingMetadata } from 'next'
import { SanityImageSource } from '@sanity/image-url/lib/types/types'
import {
  WebProject,
  VideoProject,
  PhotoProject,
  AudioProject,
  EventProject,
  BuildProject,
} from './components'

type ProjectProps = {
  params: Promise<{
    slug: string
  }>
}

const PROJECT_SLUG_QUERY = `
  *[_type == 'GFNC_project' && slug.current == $slug] {
    _id,
    title,
    clientName,
    slug,
    type,
    status,
    mainLink,
    dateStarted,
    dateCompleted,
    mainMedia[] {
      ...,
      _type == 'image' => {
        ...,
        asset-> {
          extension,
          url,
          metadata {
            lqip,
            dimensions {
              height,
              width
            }
          }
        }
      },
      _type == 'videoFile' => {
        ...,
        asset-> {
          url,
          metadata {
            lqip,
            dimensions {
              height,
              width
            }
          }
        }
      },
    },
    membersInvolved[]-> {
      _id,
      fullName,
      slug,
      profilePicture {
        asset-> {
          url,
          metadata {
            lqip,
            dimensions {
              height,
              width
            }
          }
        },
        hotspot {
          x,
          y,
        },
        caption
      }
    },
    summary,
    overview,
    photoGallery[] {
      ...,
      _type == 'image' => {
        ...,
        asset-> {
          url,
          metadata {
            lqip,
            dimensions {
              height,
              width
            }
          }
        }
      },
    },
    caseStudy[] {
      ...,
      _type == 'image' => {
        ...,
        asset-> {
          url,
          metadata {
            lqip,
            dimensions {
              height,
              width
            }
          }
        }
      },
      _type == 'videoFile' => {
        ...,
        asset-> {
          url,
          metadata {
            lqip,
            dimensions {
              height,
              width
            }
          }
        }
      },
    }
  }
`

export async function generateMetadata(
  props: ProjectProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params

  const { slug } = params

  const { openGraph } = await parent
  const pathname = '/projects/' + slug

  const [projectData] = await Promise.all([
    cmsFetch<GFNC_project[]>({
      query: PROJECT_SLUG_QUERY,
      tags: ['GFNC_project'],
      params: { slug },
    }),
  ])

  const project = projectData[0]
  const mainImage = project.mainMedia.find(
    mainMedia => mainMedia._type === 'image'
  ) as SanityImageSource

  return {
    title: `${project.title} – ${project.clientName}`,
    description: toPlainText(project.summary),
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      ...openGraph,
      url: pathname,
      images: [getImageUrl(mainImage).width(1200).quality(90).url()],
    },
  }
}

export default async function Project(props: ProjectProps) {
  const params = await props.params
  const { slug } = params

  const [projectData] = await Promise.all([
    cmsFetch<GFNC_project[]>({
      query: PROJECT_SLUG_QUERY,
      tags: ['GFNC_project'],
      params: { slug },
    }),
  ])

  const project = projectData[0]

  // Route to the appropriate component based on project type
  switch (project.type) {
    case 'Web':
      return <WebProject project={project} />
    case 'Video':
      return <VideoProject project={project} />
    case 'Photo':
      return <PhotoProject project={project} />
    case 'Audio':
      return <AudioProject project={project} />
    case 'Event':
      return <EventProject project={project} />
    case 'Build':
      return <BuildProject project={project} />
    default:
      return <WebProject project={project} /> // fallback to Web project layout
  }
}
