/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
  allowedDevOrigins: ['127.0.0.1'],
}

module.exports = nextConfig
