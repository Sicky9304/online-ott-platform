/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'image.tmdb.org' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: 'commondatastorage.googleapis.com' }
    ]
  },
  async rewrites() {
    // Dynamically direct requests to backend in dev environment
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const destination = backendUrl.endsWith('/api') ? `${backendUrl}/:path*` : `${backendUrl}/api/:path*`;
    return [
      {
        source: '/api/:path*',
        destination: destination
      }
    ];
  }
};

export default nextConfig;
