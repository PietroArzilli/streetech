import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: "Streetech",
  description: "La tua palestra street workout",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Streetech",
  },
};

export const viewport: Viewport = {
  themeColor: "#ef4444",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${inter.variable} ${bebasNeue.variable}`}>
      <body className="bg-gray-950 text-white min-h-screen flex flex-col">
        <ServiceWorkerRegistrar />
        <Header />
        {/* pb-20 lascia spazio alla bottom nav fissa */}
        <main className="flex-1 pb-20">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
