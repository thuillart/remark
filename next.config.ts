import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  experimental: { useCache: true },
  eslint: { ignoreDuringBuilds: true },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
