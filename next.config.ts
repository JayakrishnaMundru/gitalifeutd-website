import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Keep Next/Image safe defaults; we render external images via <img>.
    // If you later want Next/Image optimization for Google Drive, add remotePatterns here.
  },
}

export default nextConfig
