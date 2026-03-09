import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `output: "standalone"` is activated only when BUILD_TARGET=docker (see Dockerfile).
  // CI uses `npm run build` (no BUILD_TARGET) → standard output (Vercel / local compatible).
  // Docker uses `npm run build:docker` which injects BUILD_TARGET=docker → standalone output.
  output: process.env.BUILD_TARGET === "docker" ? "standalone" : undefined,

  // For Capacitor/Android static export, use:
  // output: "export",
  // trailingSlash: true,

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
