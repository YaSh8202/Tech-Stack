/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "img.icons8.com",
      "lh3.googleusercontent.com",
    ],
  },
};

module.exports = nextConfig;
