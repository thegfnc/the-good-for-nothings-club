export default function SpotifyPlaylistEmbed() {
  return (
    <iframe
      style={{ borderRadius: '12px', aspectRatio: '1' }}
      src='https://open.spotify.com/embed/playlist/3HrYNgbv1AMFwDqlZFkn3u?utm_source=generator'
      width='100%'
      frameBorder='0'
      allowFullScreen={false}
      allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
      loading='lazy'
    ></iframe>
  )
}
