/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn2.mallats.com',
        pathname: '**',
      },
    ],
  },
  // Modern optimizations
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
