import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    domains: ['alireza-bagheri.top'],
    formats: ['image/webp', 'image/avif'],
  },
};

export default withNextIntl(nextConfig);
