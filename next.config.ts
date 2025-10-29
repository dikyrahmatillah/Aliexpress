import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "au.koala.com" },
      { protocol: "https", hostname: "sixsilver.pl" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "placeholder.com" },
      { protocol: "https", hostname: "**.aliexpress-media.com" },
      { protocol: "https", hostname: "**.alicdn.com" },
      { protocol: "http", hostname: "**.alicdn.com" },
    ],
  },
};

export default nextConfig;
