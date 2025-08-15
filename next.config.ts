import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "au.koala.com" },
      { protocol: "https", hostname: "sixsilver.pl" },
    ],
  },
};

export default nextConfig;
