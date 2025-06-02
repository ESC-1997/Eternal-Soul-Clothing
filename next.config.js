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

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = nextConfig 
