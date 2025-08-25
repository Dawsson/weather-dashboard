import type { NextConfig } from 'next';

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
        destination: `${process.env.NEXT_PUBLIC_API_URL}/docs/:path*`,
      },
    ];
  },
};

export default nextConfig;
