/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  optimizeFonts: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;
