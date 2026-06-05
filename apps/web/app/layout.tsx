import type {
  Metadata,
  Viewport
} from "next";

import {
  Toaster
} from "sonner";

import "./globals.css";

import {
  ClientProviders
} from "@/components/client-providers";

export const metadata: Metadata = {
  title: "FFX ESPORTS",
  description:
    "Premium esports tournament platform",

  manifest:
    "/manifest.json"
};

export const viewport: Viewport = {
  themeColor:
    "#0A0A0A",

  width:
    "device-width",

  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <html
      lang="en"
      className="
        dark
        scroll-smooth
      "
      suppressHydrationWarning
    >

      <body
        className="
          min-h-screen
          bg-background
          text-foreground
          antialiased
        "
      >

        {/* APP */}

        <ClientProviders>
          {children}
        </ClientProviders>

        {/* TOAST */}

        <Toaster
          richColors
          position="top-right"
          theme="dark"
          toastOptions={{
            classNames: {
              toast:
                `
                border
                border-border
                bg-card
                text-foreground
                rounded-2xl
                shadow-2xl
              `,

              title:
                "text-white font-semibold",

              description:
                "text-muted-foreground",

              actionButton:
                `
                bg-primary
                text-white
              `,

              cancelButton:
                `
                bg-secondary
                text-white
              `
            }
          }}
        />
      </body>
    </html>
  );
}

