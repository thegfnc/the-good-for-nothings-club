import { TypedObject } from '@portabletext/types'
import { SanityAssetDocument } from 'next-sanity'

export type Image = {
  _type: 'image'
  asset: {
    extension: string
    url: string
    metadata: {
      lqip: `data:image/${string}`
      dimensions: {
        aspectRatio: number
        height: number
        width: number
      }
    }
  }
  hotspot?: {
    x: number
    y: number
  }
  caption: string
}

type VideoFile = {
  _type: 'videoFile'
  asset: {
    url: string
  }
  caption: string
  controls: boolean
  loop: boolean
  playing: boolean
}

export type GFNC_member = {
  _id: string
  fullName: string
  profilePicture: Image
  hoverProfilePicture: Image
  roles: string[]
  startDate: string
  memberNumber: number
}

export type GFNC_project = {
  _id: string
  _updatedAt: string
  title: string
  clientName: string
  slug: {
    current: string
  }
  type: 'Web' | 'Video' | 'Photo' | 'Audio'
  status: 'In Progress' | 'Completed' | 'Paused' | 'Canceled'
  dateStarted: string
  dateCompleted: string
  mainMedia: Array<Image | VideoFile>
  summary: TypedObject[]
  overview: TypedObject[]
  photoGallery: SanityAssetDocument[]
  caseStudy: TypedObject[]
}
