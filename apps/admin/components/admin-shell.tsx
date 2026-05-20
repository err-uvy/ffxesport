"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  BarChart3,
  ClipboardCheck,
  LifeBuoy,
  LogOut,
  Menu,
  ScrollText,
  Shield,
  Trophy,
  Users,
  Wallet,
  X
} from "lucide-react";

import { Button, cn } from "@ffx/ui";
import { api } from "@/lib/api";

const adminRoles = [
  "SUPER_ADMIN",
  "ADMIN",
  "MODERATOR",
  "SUPPORT"
];

const userApp =
  process.env.NEXT_PUBLIC_USER_APP_URL ??
  "http://localhost:3000";

const nav = [
  {
    href: "/admin",
    label: "Overview",
    icon: BarChart3
  },

  {
    href: "/admin/users",
    label: "Users",
    icon: Users
  },

  {
    href: "/admin/tournaments",
    label: "Tournaments",
    icon: Trophy
  },

  {
    href: "/admin/matches",
    label: "Matches",
    icon: ClipboardCheck
  },

  {
    href: "/admin/wallet",
    label: "Wallet",
    icon: Wallet
  },

  {
    href: "/admin/support",
    label: "Support",
    icon: LifeBuoy
  },

  {
    href: "/admin/audit",
    label: "Audit",
    icon: ScrollText
  }
];

export function AdminShell({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const pathname = usePathname();

  const [open, setOpen] =
    useState(false);

  const [checking, setChecking] =
    useState(true);

  const [user, setUser] = useState<{
    username: string;
    email: string;
    roles: string[];
  } | null>(null);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((response) => {
        const current =
          response.data.data;

        if (
          !current.roles?.some(
            (role: string) =>
              adminRoles.includes(role)
          )
        ) {
          if (
  !current.roles?.some(
    (role: string) =>
      adminRoles.includes(role)
  )
) {
  globalThis.location.href = `${userApp}/dashboard`;

  return;
}
          return;
        }

        setUser(current);

        setChecking(false);
      })
      .catch(() =>
        router.replace("/login")
      );
  }, [router]);

  async function logout() {
    await api.post("/auth/logout");

    router.replace("/login");
  }

  if (checking) {
    return (
      <div className="admin-grid flex min-h-screen items-center justify-center bg-[#020817]">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-blue-300 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="admin-grid min-h-screen bg-[#020817]">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-white/50 bg-[#081120] p-4 backdrop-blur-xl transition-transform lg:translate-x-0",

          open
            ? "translate-x-0"
            : "-translate-x-full"
        )}
      >
        <div className="mb-7 flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center gap-3"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#00E5FF,#7C3AED,#FF0080)] font-black">
              AD
            </span>

            <span>
              <span className="block text-lg font-black">
                FFX ADMIN
              </span>

              <span className="text-xs uppercase tracking-[0.22em] text-blue-200">
                Control Tower
              </span>
            </span>
          </Link>

          <button
            className="lg:hidden"
            onClick={() =>
              setOpen(false)
            }
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() =>
                  setOpen(false)
                }
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
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/20">
              <Shield size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-white">
                {user?.username}
              </div>

              <div className="truncate text-xs text-slate-400">
                {user?.email}
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            className="mt-3 w-full"
            onClick={logout}
          >
            <LogOut
              size={16}
              className="mr-2"
            />

            Logout
          </Button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#020817]/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 lg:px-6">
            <button
              className="rounded-lg border border-white/10 p-2 lg:hidden"
              onClick={() =>
                setOpen(true)
              }
            >
              <Menu size={20} />
            </button>

            <div>
              <div className="text-sm font-bold uppercase tracking-[0.3em] text-blue-200">
                FFX eSports
              </div>

              <div className="text-xs text-slate-400">
                Admin Control Panel
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}