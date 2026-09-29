import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "admin.phuthanhnamgarment.com" }],
        destination: "https://phuthanhnamgarment.com/admin",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      // Admins may paste image URLs from any host in the CMS.
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
