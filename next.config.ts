import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hbjkcidllhthhzyhrpdz.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '1mb',
    },
  },
};

export default nextConfig;
