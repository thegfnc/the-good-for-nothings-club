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
