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

  Bell,
  CircleDollarSign,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy,
  Users,
  Wallet,
  X

} from "lucide-react";

import {
  toast
} from "sonner";

import {
  Button,
  cn
} from "@ffx/ui";

import {
  ParticleField
} from "./particle-field";

import {
  getSocket
} from "@/lib/socket";

import {
  useAuthStore
} from "@/store/auth-store";

const nav = [

  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard
  },

  {
    href: "/tournaments",
    label: "Tournaments",
    icon: Trophy
  },

  {
    href: "/matches",
    label: "Matches",
    icon: Swords
  },

  {
    href: "/teams",
    label: "Teams",
    icon: Users
  },

  {
    href: "/wallet",
    label: "Wallet",
    icon: Wallet
  },

  {
    href: "/leaderboard",
    label: "Leaderboard",
    icon: Gamepad2
  },

  {
    href: "/notifications",
    label: "Notifications",
    icon: Bell
  },

  {
    href: "/support",
    label: "Support",
    icon: ShieldCheck
  },

  {
    href: "/profile",
    label: "Profile",
    icon: CircleDollarSign
  }
];

export function AppShell({
  children
}: {
  children: React.ReactNode;
}) {

  const pathname =
    usePathname();

  const router =
    useRouter();

  const [open, setOpen] =
    useState(false);

  const {
    user,
    loaded,
    loadMe,
    logout
  } = useAuthStore();

  useEffect(() => {

    loadMe().then(
      (current) => {

        if (!current) {

          router.replace(
            "/login"
          );
        }
      }
    );

  }, [
    loadMe,
    router
  ]);

  useEffect(() => {

    if (!user) return;

    const socket =
      getSocket();

    const walletHandler =
      () =>
        toast.info(
          "Wallet updated"
        );

    const matchHandler =
      () =>
        toast.info(
          "Match update received"
        );

    socket.on(
      "wallet:deposit",
      walletHandler
    );

    socket.on(
      "wallet:withdrawal-updated",
      walletHandler
    );

    socket.on(
      "match:room-released",
      matchHandler
    );

    socket.on(
      "match:live",
      matchHandler
    );

    return () => {

      socket.off(
        "wallet:deposit",
        walletHandler
      );

      socket.off(
        "wallet:withdrawal-updated",
        walletHandler
      );

      socket.off(
        "match:room-released",
        matchHandler
      );

      socket.off(
        "match:live",
        matchHandler
      );
    };

  }, [user]);

  async function handleLogout() {

    await logout();

    router.replace(
      "/login"
    );
  }

  if (!loaded && !user) {

    return (

      <div
        className="
          relative
          flex
          min-h-screen
          items-center
          justify-center
          overflow-hidden
          bg-[#050816]
          text-white
        "
      >

        <ParticleField />

        <div
          className="
            absolute
            h-72
            w-64
            rounded-full
            bg-cyan-500/10
            blur-[120px]
          "
        />

        <div
          className="
            relative
            flex
            h-20
            w-20
            items-center
            justify-center
            rounded-full
            border
            border-cyan-400/20
            bg-white/[0.03]
            backdrop-blur-xl
          "
        >

          <div
            className="
              h-12
              w-12
              animate-spin
              rounded-full
              border-[3px]
              border-cyan-300
              border-t-transparent
            "
          />
        </div>
      </div>
    );
  }

  return (

    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#050816]
        text-white
      "
    >

      {/* BACKGROUND */}

      <ParticleField />

      <div
        className="
          absolute
          inset-0
          opacity-[0.04]
        "
        style={{
          backgroundImage:
            `
            linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
          `,
          backgroundSize:
            "40px 40px"
        }}
      />

      <div
        className="
          absolute
          top-[-180px]
          right-[-180px]
          h-[400px]
          w-[400px]
          rounded-full
          bg-cyan-500/10
          blur-[140px]
        "
      />

      <div
        className="
          absolute
          bottom-[-180px]
          left-[-180px]
          h-[400px]
          w-[400px]
          rounded-full
          bg-blue-600/10
          blur-[140px]
        "
      />

      {/* SIDEBAR */}

      <aside
        className={cn(

          `
          fixed
          inset-y-0
          left-0
          z-50
          w-[290px]
          border-r
          border-white/10
          bg-[#081120]/85
          backdrop-blur-3xl
          transition-all
          duration-300
          lg:translate-x-0
          `,

          open
            ? "translate-x-0"
            : "-translate-x-full"
        )}
      >

        {/* LOGO */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-white/10
            px-6
            py-6
          "
        >

          <Link
            href="/dashboard"
            className="
              flex
              items-center
              gap-4
            "
          >

            <div
              className="
                relative
                flex
                h-14
                w-14
                items-center
                justify-center
                overflow-hidden
                rounded-2xl
                bg-gradient-to-br
                from-cyan-400
                via-blue-500
                to-purple-600
                text-lg
                font-black
                shadow-[0_0_35px_rgba(34,211,238,.35)]
              "
            >

              <div
                className="
                  absolute
                  inset-0
                  bg-white/10
                "
              />

              FX
            </div>

            <div>

              <div
                className="
                  text-lg
                  font-black
                  tracking-wide
                "
              >
                FFX ESPORTS
              </div>

              <div
                className="
                  mt-1
                  flex
                  items-center
                  gap-2
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.35em]
                  text-cyan-300
                "
              >

                <Sparkles
                  size={11}
                />

                ARENA OS
              </div>
            </div>
          </Link>

          <button
            className="
              rounded-xl
              border
              border-white/10
              p-2
              transition
              hover:bg-white/5
              lg:hidden
            "
            onClick={() =>
              setOpen(false)
            }
          >

            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}

        <div
          className="
            px-4
            py-5
          "
        >

          <div
            className="
              mb-4
              px-3
              text-[11px]
              font-bold
              uppercase
              tracking-[0.3em]
              text-slate-500
            "
          >
            MAIN NAVIGATION
          </div>

          <nav
            className="
              space-y-2
            "
          >

            {nav.map((item) => {

              const Icon =
                item.icon;

              const active =
                pathname ===
                item.href;

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
                    h-14
                    items-center
                    gap-4
                    overflow-hidden
                    rounded-2xl
                    px-4
                    text-sm
                    font-semibold
                    transition-all
                    duration-300
                    `,

                    active

                      ? `
                        border
                        border-cyan-400/20
                        bg-gradient-to-r
                        from-cyan-500/15
                        to-blue-500/10
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
                        left-0
                        top-0
                        h-full
                        w-1
                        rounded-r-full
                        bg-cyan-400
                      "
                    />
                  )}

                  <div
                    className={cn(

                      `
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-xl
                      transition
                      `,

                      active

                        ? `
                          bg-cyan-400/15
                          text-cyan-300
                        `

                        : `
                          bg-white/[0.03]
                          group-hover:bg-white/[0.06]
                        `
                    )}
                  >

                    <Icon size={18} />
                  </div>

                  <span>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* USER CARD */}

        <div
          className="
            absolute
            bottom-5
            left-4
            right-4
          "
        >

          <div
            className="
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-white/[0.03]
              backdrop-blur-2xl
            "
          >

            <div
              className="
                bg-gradient-to-r
                from-cyan-500/10
                via-blue-500/10
                to-purple-500/10
                p-4
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-4
                "
              >

                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-br
                    from-cyan-400
                    to-blue-600
                    text-lg
                    font-black
                    shadow-[0_0_25px_rgba(34,211,238,.25)]
                  "
                >

                  {user?.username
                    ?.slice(0, 1)
                    ?.toUpperCase()}
                </div>

                <div
                  className="
                    min-w-0
                  "
                >

                  <div
                    className="
                      truncate
                      text-base
                      font-black
                    "
                  >
                    {user?.username ??
                      "Player"}
                  </div>

                  <div
                    className="
                      truncate
                      text-xs
                      text-slate-400
                    "
                  >
                    {user?.email}
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={
                  handleLogout
                }
                className="
                  mt-4
                  h-12
                  w-full
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  text-white
                  transition
                  hover:bg-red-500/10
                  hover:text-red-200
                "
              >

                <LogOut
                  size={18}
                />

                Logout
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}

      <div
        className="
          lg:pl-[290px]
        "
      >

        {/* TOPBAR */}

        <header
          className="
            sticky
            top-0
            z-40
            border-b
            border-white/10
            bg-[#050816]/70
            backdrop-blur-3xl
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              px-5
              py-4
              sm:px-8
            "
          >

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              <button
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  transition
                  hover:bg-white/[0.05]
                  lg:hidden
                "
                onClick={() =>
                  setOpen(true)
                }
              >

                <Menu size={20} />
              </button>

              <div>

                <div
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.3em]
                    text-cyan-300
                  "
                >
                  LIVE ECOSYSTEM
                </div>

                <div
                  className="
                    mt-1
                    text-sm
                    text-slate-400
                  "
                >
                  Premium esports operations center
                </div>
              </div>
            </div>

            <div
              className="
                flex
                items-center
                gap-3
              "
            >

              <Link
                href="/notifications"
                className="
                  relative
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  text-cyan-300
                  transition
                  hover:border-cyan-400/30
                  hover:bg-cyan-400/10
                "
              >

                <Bell
                  size={19}
                />

                <div
                  className="
                    absolute
                    right-3
                    top-3
                    h-2
                    w-2
                    rounded-full
                    bg-cyan-400
                    shadow-[0_0_12px_rgba(34,211,238,1)]
                  "
                />
              </Link>
            </div>
          </div>
        </header>

        {/* CONTENT */}

        <main
          className="
            relative
            z-10
            mx-auto
            w-full
            max-w-[1700px]
            px-5
            py-6
            sm:px-8
            lg:py-8
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}