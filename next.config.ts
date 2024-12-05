import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  async redirects() {
    return [
      {
        source: "/swagger/json",
        destination: "/api/swagger/json",
        permanent: true,
      }
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    }
  },
  output: 'standalone',
}


export default nextConfig;
