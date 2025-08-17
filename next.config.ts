import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "au.koala.com" },
      { protocol: "https", hostname: "sixsilver.pl" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "placeholder.com" },
      { protocol: "https", hostname: "ae-pic-a1.aliexpress-media.com" },
    ],
  },
};

export default nextConfig;
