import type { NextConfig } from 'next';
import { env } from '@/env';

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui'],
  output: 'standalone',

  typescript: {
    ignoreBuildErrors: true,
  },

  rewrites: async () => {
    return [
      {
        source: '/docs/:path*',
        destination: `${env.NEXT_PUBLIC_API_URL}/docs/:path*`,
      },
    ];
  },
};

export default nextConfig;
