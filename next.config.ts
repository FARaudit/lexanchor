import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/login", destination: "/sign-in", permanent: true },
      { source: "/login/:path*", destination: "/sign-in", permanent: true }
    ];
  }
};

export default nextConfig;
