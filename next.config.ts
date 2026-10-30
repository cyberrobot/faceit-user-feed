import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  distDir: process.env.E2E_TEST ? '.next/e2e' : '.next',
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
