import type { NextConfig } from "next";
import { execSync } from "child_process";

const buildId =
  process.env.VERCEL_GIT_COMMIT_SHA ||
  execSync("git rev-parse HEAD").toString().trim();

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  outputFileTracingRoot: process.cwd(),
  env: {
    NEXT_PUBLIC_BUILD_ID: buildId,
  },
};

export default nextConfig;
