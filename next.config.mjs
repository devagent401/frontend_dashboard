/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**', // Allow all paths from localhost:5000
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com', // For S3 if you use it in production
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
    ],
    formats: ['image/webp'], // <--- IMPORTANT
    dangerouslyAllowSVG: true, // <--- fixes MIME blocking
    // Disable optimization so images use the raw backend URL instead of /_next/image
    unoptimized: true,
  },
};

export default nextConfig;

