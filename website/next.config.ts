import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGitHubPages ? "/middle-school-curriculum" : "",
  assetPrefix: isGitHubPages ? "/middle-school-curriculum/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
