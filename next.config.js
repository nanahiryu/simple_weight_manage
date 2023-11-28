/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.fpsa.org',
      },
    ],
  },
};

module.exports = nextConfig;
