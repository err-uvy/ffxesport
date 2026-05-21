"use client";

import Link from "next/link";

import {
  usePathname,
  useRouter
} from "next/navigation";

import {
  useEffect,
  useState
} from "react";

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

import {
  Button,
  cn
} from "@/ui";

import { ParticleField } from "@/components/particle-field";

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

  const [user, setUser] =
    useState<{
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

          globalThis.location.href =
            `${userApp}/dashboard`;

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

      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#030712]">

        <ParticleField />

        <div className="relative z-10 flex flex-col items-center">

          <div
            className="
            h-14
            w-14
            animate-spin

            rounded-full

            border-2
            border-cyan-400/30
            border-t-cyan-300

            shadow-[0_0_30px_rgba(34,211,238,.25)]
          "
          />

          <div className="mt-4 text-sm font-bold uppercase tracking-[0.3em] text-cyan-200">
            Loading Control Tower
          </div>
        </div>
      </div>
    );
  }

  return (

    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">

      <ParticleField />

      {/* =======================================================
          SIDEBAR
      ======================================================= */}

      <aside

        className={cn(

          `
          fixed
          inset-y-0
          left-0
          z-50

          w-64

          border-r
          border-white/10

          bg-[#081120]/80

          backdrop-blur-2xl

          transition-transform
          duration-300

          lg:translate-x-0
          `,

          open
            ? "translate-x-0"
            : "-translate-x-full"
        )}
      >

        {/* glow */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,.12),transparent_40%)]" />

        <div className="relative z-10 flex h-full flex-col p-4">

          {/* =======================================================
              LOGO
          ======================================================= */}

          <div className="mb-8 flex items-center justify-between">

            <Link
              href="/admin"
              className="flex items-center gap-4"
            >

              <div
                className="
                flex
                h-12
                w-12
                items-center
                justify-center

                rounded-2xl

                bg-[linear-gradient(135deg,#06B6D4,#2563EB,#7C3AED)]

                text-lg
                font-black

                shadow-[0_0_30px_rgba(34,211,238,.25)]
              "
              >
                FX
              </div>

              <div>

                <div className="text-lg font-black tracking-wide text-white">
                  FFX ADMIN
                </div>

                <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-200">
                  Control Tower
                </div>
              </div>
            </Link>

            <button
              className="
                rounded-xl
                border
                border-white/10
                bg-white/[0.04]
                p-2

                transition
                hover:bg-white/[0.08]

                lg:hidden
              "
              onClick={() =>
                setOpen(false)
              }
            >
              <X size={20} />
            </button>
          </div>

          {/* =======================================================
              NAVIGATION
          ======================================================= */}

          <nav className="space-y-2">

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

                    `
                    group

                    relative

                    flex
                    h-12
                    items-center
                    gap-3

                    overflow-hidden

                    rounded-2xl

                    px-4

                    text-sm
                    font-bold

                    transition-all
                    duration-300
                    `,

                    active
                      ? `
                        border
                        border-cyan-400/20

                        bg-[linear-gradient(135deg,rgba(34,211,238,.16),rgba(59,130,246,.12),rgba(124,58,237,.16))]

                        text-white

                        shadow-[0_0_30px_rgba(34,211,238,.12)]
                      `
                      : `
                        text-slate-400

                        hover:border
                        hover:border-white/10

                        hover:bg-white/[0.04]

                        hover:text-white
                      `
                  )}
                >

                  {active && (
                    <div
                      className="
                      absolute
                      inset-y-2
                      left-0

                      w-1

                      rounded-full

                      bg-cyan-300
                    "
                    />
                  )}

                  <Icon
                    size={18}
                    className={cn(
                      active
                        ? "text-cyan-200"
                        : "text-slate-500 group-hover:text-cyan-200"
                    )}
                  />

                  <span>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* =======================================================
              USER CARD
          ======================================================= */}

          <div
            className="
            relative
            mt-auto

            overflow-hidden

            rounded-[28px]

            border
            border-white/10

            bg-white/[0.04]

            p-4

            backdrop-blur-xl
          "
          >

            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(34,211,238,.08),transparent,rgba(124,58,237,.08))]" />

            <div className="relative z-10">

              <div className="flex items-center gap-3">

                <div
                  className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center

                  rounded-2xl

                  bg-[linear-gradient(135deg,#06B6D4,#2563EB)]

                  shadow-[0_0_20px_rgba(34,211,238,.22)]
                "
                >
                  <Shield size={20} />
                </div>

                <div className="min-w-0 flex-1">

                  <div className="truncate text-sm font-black text-white">
                    {user?.username}
                  </div>

                  <div className="truncate text-xs text-slate-400">
                    {user?.email}
                  </div>
                </div>
              </div>

              <Button
                variant="secondary"
                className="mt-4 w-full"
                onClick={logout}
              >

                <LogOut
                  size={16}
                />

                Logout
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* =======================================================
          MAIN
      ======================================================= */}

      <div className="lg:pl-72">

        {/* =======================================================
            TOPBAR
        ======================================================= */}

        <header
          className="
          sticky
          top-0
          z-40

          border-b
          border-white/10

          bg-[#030712]/70

          backdrop-blur-2xl
        "
        >

          <div className="flex h-20 items-center justify-between px-4 lg:px-8">

            <div className="flex items-center gap-4">

              <button

                className="
                rounded-2xl

                border
                border-white/10

                bg-white/[0.04]

                p-3

                transition
                hover:bg-white/[0.08]

                lg:hidden
              "

                onClick={() =>
                  setOpen(true)
                }
              >
                <Menu size={20} />
              </button>

              <div>

                <div className="text-xs font-black uppercase tracking-[0.32em] text-cyan-200">
                  FFX ESPORTS
                </div>

                <div className="mt-1 text-lg font-black text-white">
                  Admin Command Center
                </div>
              </div>
            </div>

            <div
              className="
              hidden
              items-center
              gap-3

              rounded-2xl

              border
              border-white/10

              bg-white/[0.04]

              px-4
              py-2

              text-sm
              text-slate-300

              backdrop-blur-xl

              md:flex
            "
            >

              <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,.9)]" />

              System Operational
            </div>
          </div>
        </header>

        {/* =======================================================
            PAGE CONTENT
        ======================================================= */}

        <main className="relative z-10 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}