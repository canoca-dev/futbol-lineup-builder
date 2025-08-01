import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: 'img.a.transfermarkt.technology',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
