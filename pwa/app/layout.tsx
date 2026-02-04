import type { Metadata } from "next";
import ServiceWorkerRegister from "./components/ServiceWorkerRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "SSV 1Day PWA",
  description: "SSV 1Day Power & Movement Camp report mock",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg"
  }
};

export const viewport = {
  themeColor: "#1746FF",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="app-shell antialiased">
        <ServiceWorkerRegister />
        <main className="mx-auto min-h-screen w-full max-w-full px-2 pb-16 pt-6 sm:max-w-3xl sm:px-4 lg:max-w-5xl lg:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
