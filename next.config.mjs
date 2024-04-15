/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/ojzttvlq/production/**',
      },
    ],
  },

  // https://nextjs.org/docs/app/api-reference/next-config-js/redirects
  async redirects() {
    return []
  },
}

export default nextConfig
