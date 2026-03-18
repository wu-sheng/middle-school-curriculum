import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const basePath = isGitHubPages ? "/middle-school-curriculum" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: isGitHubPages ? "/middle-school-curriculum/" : "",
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
