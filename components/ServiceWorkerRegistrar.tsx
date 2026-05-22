"use client";

import { useEffect } from "react";

// Registra il service worker una sola volta al mount
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/streetech/sw.js")
        .catch((err) => console.warn("SW registration failed:", err));
    }
  }, []);

  return null;
}
