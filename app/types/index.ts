import { TypedObject } from '@portabletext/types'

export type GFNC_member = {
  _id: string
  fullName: string
  profilePicture: {
    asset: {
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
    caption: string
  }
  roles: string[]
  startDate: string
  memberNumber: number
}

export type GFNC_project = {
  _id: string
  title: string
  clientName: string
  slug: {
    current: string
  }
  type: string
  mainImage: {
    asset: {
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
    caption: string
  }
  summary: TypedObject[]
}
