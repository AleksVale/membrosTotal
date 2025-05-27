import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-5d54aa14d19d48d4bac5298564dde31b.r2.dev',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;