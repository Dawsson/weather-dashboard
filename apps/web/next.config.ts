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
        destination: 'https://weather-api.dawson.gg/docs/:path*',
      },
    ];
  },
};

export default nextConfig;
