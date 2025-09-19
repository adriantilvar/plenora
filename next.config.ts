import type { NextConfig } from "next";

import "@/env/server.ts";

const nextConfig: NextConfig = {
  typedRoutes: true,
};

export default nextConfig;
