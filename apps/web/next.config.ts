import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui'],
  output: 'standalone',

  typescript: {
    ignoreBuildErrors: true,
  },

  async rewrites() {
    return [
      {
        source: '/docs/:path*',
        destination: 'http://localhost:3001/docs/:path*',
      },
    ];
  },
};

export default nextConfig;
