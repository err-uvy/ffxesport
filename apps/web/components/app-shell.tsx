"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  CircleDollarSign,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Swords,
  Trophy,
  Users,
  Wallet,
  X
} from "lucide-react";
import { toast } from "sonner";
import { Button, cn } from "@ffx/ui";
import { ParticleField } from "./particle-field";
import { getSocket } from "@/lib/socket";
import { useAuthStore } from "@/store/auth-store";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tournaments", label: "Tournaments", icon: Trophy },
  { href: "/matches", label: "Matches", icon: Swords },
  { href: "/teams", label: "Teams", icon: Users },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/leaderboard", label: "Leaderboard", icon: Gamepad2 },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/support", label: "Support", icon: ShieldCheck },
  { href: "/profile", label: "Profile", icon: CircleDollarSign }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { user, loaded, loadMe, logout } = useAuthStore();

  useEffect(() => {
    loadMe().then((current) => {
      if (!current) router.replace("/login");
    });
  }, [loadMe, router]);

  useEffect(() => {
    if (!user) return;
    const socket = getSocket();
    const walletHandler = () => toast.info("Wallet updated");
    const matchHandler = () => toast.info("Match update received");
    socket.on("wallet:deposit", walletHandler);
    socket.on("wallet:withdrawal-updated", walletHandler);
    socket.on("match:room-released", matchHandler);
    socket.on("match:live", matchHandler);
    return () => {
      socket.off("wallet:deposit", walletHandler);
      socket.off("wallet:withdrawal-updated", walletHandler);
      socket.off("match:room-released", matchHandler);
      socket.off("match:live", matchHandler);
    };
  }, [user]);

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  if (!loaded && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020817] text-white">
        <ParticleField />
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-blue-300 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <ParticleField />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-white/50 bg-[#081120] p-4 backdrop-blur-xl transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-7 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#00E5FF,#7C3AED,#FF0080)] text-lg font-black">
              FX
            </span>
            <span>
              <span className="block text-lg font-black">FFX ESPORTS</span>
              <span className="text-xs uppercase tracking-[0.22em] text-blue-200">Arena OS</span>
            </span>
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>
        <nav className="space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition",
                  active
                    ? "border border-blue-300/30 bg-blue-300/12 text-white shadow-neon"
                    : "text-slate-400 hover:bg-white/8 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-white/10 bg-[#0F172A] p-3">
          <div className="text-sm font-bold">{user?.username ?? "Player"}</div>
          <div className="truncate text-xs text-slate-400">{user?.email}</div>
          <Button variant="ghost" className="mt-3 w-full justify-start" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/50 bg-[#020817]/78 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex items-center justify-between">
            <button className="rounded-lg border border-white/10 p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu size={20} />
            </button>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.22em] text-blue-200">Live ecosystem</div>
              <div className="text-sm text-slate-400">Secure tournaments, wallet, squads, and match ops.</div>
            </div>
            <Link href="/notifications" className="rounded-lg border border-white/10 p-2 text-blue-100 transition hover:border-blue-300/40">
              <Bell size={19} />
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
