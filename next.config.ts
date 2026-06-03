import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "www.icegate.gov.in" },
      { protocol: "https", hostname: "gst.gov.in" },
    ],
  },
};

export default nextConfig;
