import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // basePath: '/',
  // assetPrefix: '/',
  // publicRuntimeConfig: {
  //   basePath: '/',
  // },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aeromagasia.com',
      },
      {
        protocol: 'https',
        hostname: 'aerosunawswebsite.s3.eu-north-1.amazonaws.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
