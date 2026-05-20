import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { ClientProviders } from "@/components/client-providers";

export const metadata: Metadata = {
  title: "FFX ESPORTS",
  description: "Premium battle royale esports tournament platform",
  manifest: "/manifest.json"
};

export const viewport: Viewport = {
  themeColor: "#020817",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>
        <ClientProviders>{children}</ClientProviders>
        <Toaster richColors position="top-right" theme="dark" />
      </body>
    </html>
  );
}
