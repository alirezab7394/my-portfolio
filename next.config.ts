import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    domains: ['alireza-bagheri.top'],
    formats: ['image/webp', 'image/avif'],
  },
  // Enable experimental features for better OpenGraph image generation
  experimental: {
    serverComponentsExternalPackages: ['@vercel/og'],
  },
  // Ensure proper build output for OpenGraph images
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

export default withNextIntl(nextConfig);
