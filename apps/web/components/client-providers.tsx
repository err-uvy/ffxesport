"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const loadMe = useAuthStore((state) => state.loadMe);

  useEffect(() => {
    // ✅ ffx_access is httpOnly so document.cookie can never see it.
    // Instead always call loadMe() — it silently returns null on 401
    // so there is no error shown to unauthenticated users.
    loadMe();

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []); // ✅ removed loadMe from deps to prevent infinite loop

  return <>{children}</>;
}