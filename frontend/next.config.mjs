/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'api.manojbhandarkar.cloud',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
