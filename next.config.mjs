/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        // Placeholder en desarrollo
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        // Steam CDN — imágenes de juegos
        protocol: 'https',
        hostname: 'cdn.cloudflare.steamstatic.com',
      },
      {
        // Steam CDN alternativo
        protocol: 'https',
        hostname: 'shared.fastly.steamstatic.com',
      },
      {
        // Steam CDN estático
        protocol: 'https',
        hostname: 'cdn.akamai.steamstatic.com',
      },
      {
        // RAWG — base de datos de juegos
        protocol: 'https',
        hostname: 'media.rawg.io',
      },
    ],
  },
}

export default nextConfig
