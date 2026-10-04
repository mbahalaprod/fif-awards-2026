/** @type {import('next').NextConfig} */

// Les photos envoyées depuis l'admin sont servies par Supabase Storage.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL)
  : null;

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      ...(supabaseUrl
        ? [
            {
              protocol: supabaseUrl.protocol.replace(':', ''),
              hostname: supabaseUrl.hostname,
              port: supabaseUrl.port,
              pathname: '/storage/v1/object/public/**',
            },
          ]
        : []),
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      { source: '/nomines', destination: '/distingues', permanent: true },
      { source: '/nomines/:slug', destination: '/distingues/:slug', permanent: true },
    ];
  },
};

module.exports = nextConfig;
