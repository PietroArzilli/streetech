import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Streetech",
    short_name: "Streetech",
    description: "La tua palestra street workout",
    start_url: "/streetech/",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#ef4444",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/streetech/icon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/streetech/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
