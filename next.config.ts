import type { NextConfig } from "next";

const nextConfig = {
  output: 'export',
  basePath: '/choose-size',
  assetPrefix: '/choose-size/',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
