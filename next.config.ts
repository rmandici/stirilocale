import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cms.callatispress.ro", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: "callatispress.ro",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
