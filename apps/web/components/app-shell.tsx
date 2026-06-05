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
} from "@/ui";

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
        flex
        min-h-screen
        items-center
        justify-center
        bg-background
      "
    >
      <div
        className="
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          border
          border-border
          bg-card
        "
      >
        <div
          className="
            h-8
            w-8
            animate-spin
            rounded-full
            border-2
            border-primary
            border-t-transparent
          "
        />
      </div>
    </div>
  );
}
return (<div
  className="
    min-h-screen
    bg-background
    text-white
  "
>
      {/* SIDEBAR */}
  <aside
  className={cn(

    `
    fixed
    inset-y-0
    left-0
    z-50

    flex
    h-screen
    w-[270px]
    flex-col

    border-r
    border-border

    bg-sidebar

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
            border-border
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
flex
h-12
w-12
items-center
justify-center
rounded-2xl
bg-primary
text-white
font-bold
text-sm
"
            >

        

              FX
            </div>

            <div>

              <div
  className="
    
    text-lg
    font-bold
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
                  text-muted
                "
              >

                

                COMPETITIVE PLATFORM
              </div>
            </div>
          </Link>

          <button
            className="
              rounded-xl
              border
              border-border
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
    flex-1
    overflow-y-auto

    px-3
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
              bg-primary/10
text-primary
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
rounded-2xl
                    px-4
                    text-sm
                    font-semibold
                    transition-all
                    duration-200
ease-out
                    `,

                    active

                      ? `
                        
                        bg-primary/10
border
border-primary/20
text-white

                        
                       
                      `

                      : `
                        text-muted
                        hover:border
                        hover:border-border
                        hover:bg-white/[0.04]
                        hover:text-white
                      `
                  )}
                >



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
     
      bg-primary/10
text-primary
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
    border-t
    border-border

    p-4
  "
>

          <div
            className="
premium-card
rounded-3xl
p-4
"
          >

            <div
              className="
                         
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
bg-primary
text-lg
font-bold
text-white
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
                  font-bold
                    "
                  >
                    {user?.username ??
                      "Player"}
                  </div>

                  <div
                    className="
                      truncate
                      text-xs
                      text-muted
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
                 border-border
                  secondary-button
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
                {open && (
  <div
    className="
      fixed
      inset-0
      z-40
      bg-black/60
      backdrop-blur-sm
      lg:hidden
    "
    onClick={() => setOpen(false)}
  />
)}
      {/* MAIN */}

      <div
        className="
          lg:pl-[270px]
        "
      >

        {/* TOPBAR */}

        <header
          className="
sticky
top-0
z-40
border-b
border-border
bg-background/80
backdrop-blur-xl
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
                  border-border
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
    tracking-[0.35em]
    text-muted
  "
>
                  FFX ESPORTS
                </div>

                <div
                  className="
                    mt-1
                    text-sm
                    text-muted
                  "
                >
                  Competitive gaming dashboard
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
                  border-border
                  bg-card
                  
                  transition
                  text-white
hover:border-primary/30
hover:bg-primary/10
                 
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
                    bg-primary
                   
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
            max-w-[1600px]
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