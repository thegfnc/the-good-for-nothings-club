'use client'

import { APIProvider, Map as ReactGoogleMap } from '@vis.gl/react-google-maps'

export default function Map() {
  const position = { lat: 30.2672, lng: -97.7431 }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <ReactGoogleMap
        defaultCenter={position}
        defaultZoom={12}
        streetViewControl={false}
        mapTypeControl={false}
        zoomControl={false}
        fullscreenControl={false}
      />
    </APIProvider>
  )
}
