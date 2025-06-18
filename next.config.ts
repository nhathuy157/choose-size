import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  // Only use a basePath in production; during dev run at root
  basePath: process.env.NODE_ENV === 'production' ? '/choose-size' : undefined,
  // Prefix static assets in production export
  assetPrefix: process.env.NODE_ENV === 'production' ? '/choose-size' : undefined,
  trailingSlash: true,
};

export default nextConfig;
