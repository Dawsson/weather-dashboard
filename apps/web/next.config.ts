import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@repo/ui'],
  output: 'standalone',

  typescript: {
    ignoreBuildErrors: true,
  },

  rewrites: async () => {
    const apiUrl = process.env.NODE_ENV === 'production' 
      ? 'https://weather-api.dawson.gg' 
      : 'http://localhost:3001';
    
    return [
      {
        source: '/docs/:path*',
        destination: `${apiUrl}/docs/:path*`,
      },
    ];
  },
};

export default nextConfig;
