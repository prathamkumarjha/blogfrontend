import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blog-app-backend-jbko.onrender.com',
        pathname: '/media/**', // This will allow all images under the /media path
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**', // This will allow all image paths on localhost
      },
    ],
    }
};

export default nextConfig;
