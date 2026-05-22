import type { NextConfig } from "next";

// next-pwa v5 non è compatibile con Turbopack (default Next.js 16).
// Il manifest PWA è gestito nativamente da app/manifest.ts.
// Il service worker è registrato manualmente tramite public/sw.js.
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/streetech",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
