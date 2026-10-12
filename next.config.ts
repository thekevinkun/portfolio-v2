import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Files uploaded from the dashboard live in Vercel Blob (D94)
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  experimental: {
    // Room for a 4 MB PDF plus multipart overhead; Vercel itself caps near 4.5 MB
    serverActions: { bodySizeLimit: "4.5mb" },
  },
};

export default nextConfig;
