"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const loadMe = useAuthStore((state) => state.loadMe);

  useEffect(() => {
    if (document.cookie.includes("ffx_access")) {
      loadMe();
    }
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, [loadMe]);

  return children;
}
