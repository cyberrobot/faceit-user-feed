import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  distDir: process.env.E2E_TEST ? '.next/e2e' : '.next',
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/10.x/lorelei/svg',
      },
    ],
  },
};

export default nextConfig;
