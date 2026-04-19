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
        // Para imágenes de placeholder en desarrollo
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
}

export default nextConfig
