import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 604800,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  logging: { fetches: { fullUrl: true } },
};

export default nextConfig;
