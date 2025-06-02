/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'files.cdn.printful.com',
      'cdn.printful.com',
      'printful-upload.s3-accelerate.amazonaws.com',
      'images-api.printify.com'
    ],
  },
}

module.exports = nextConfig 
