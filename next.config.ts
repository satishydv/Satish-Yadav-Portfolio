import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['ghchart.rshah.org'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Exclude backend folder from build process
    config.module.rules.push({
      test: /\.(js|ts|tsx)$/,
      exclude: /backend/,
    });

    return config;
  },
};

export default nextConfig;
