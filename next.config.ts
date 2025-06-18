import type { NextConfig } from "next";

const nextConfig = {
  output: 'export',
  basePath: '/choose-size',
  trailingSlash: true, // Quan trọng để Next export hoạt động chính xác
};

export default nextConfig;
