import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  // Serve app under /choose-size on GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/choose-size' : '',
  // Prefix static assets to match basePath
  assetPrefix: process.env.NODE_ENV === 'production' ? '/choose-size' : '',
  trailingSlash: true,
};

export default nextConfig;
