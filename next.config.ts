import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // 상위 디렉토리의 lockfile로 인해 워크스페이스 루트가 잘못 추론되는 것을 방지
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
