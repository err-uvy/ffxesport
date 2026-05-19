import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "FFX Admin",
  description: "FFX ESPORTS admin operations"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
        <Toaster richColors theme="dark" position="top-right" />
      </body>
    </html>
  );
}
