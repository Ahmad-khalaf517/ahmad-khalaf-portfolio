import type { NextConfig } from "next";
import { execSync } from 'child_process';

const buildId =
  process.env.VERCEL_GIT_COMMIT_SHA ||
  execSync("git rev-parse HEAD").toString().trim();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_ID: buildId,
  }
  /* config options here */
};

export default nextConfig;
