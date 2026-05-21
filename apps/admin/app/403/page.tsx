import Link from "next/link";

import {
  ArrowLeft,
  ShieldX,
  LockKeyhole,
  AlertTriangle
} from "lucide-react";

import {
  Button,
  Card
} from "@ffx/ui";

export default function ForbiddenPage() {

  return (

    <main
      className="
      relative

      flex
      min-h-screen
      items-center
      justify-center

      overflow-hidden

      bg-[#020817]

      px-4
    "
    >

      {/* ================================= */}
      {/* BACKGROUND */}
      {/* ================================= */}

      <div className="absolute inset-0 admin-grid opacity-30" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,229,255,.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(255,0,128,.10),transparent_28%),radial-gradient(circle_at_bottom,rgba(124,58,237,.14),transparent_35%)]" />

      {/* Floating Glow */}

      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      {/* ================================= */}
      {/* CARD */}
      {/* ================================= */}

      <Card
        className="
        relative

        w-full
        max-w-xl

        overflow-hidden

        border
        border-white/10

        bg-[#081120]/90

        p-10

        text-center

        backdrop-blur-2xl
      "
      >

        {/* Glow */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,229,255,.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,0,128,.08),transparent_28%)]" />

        <div className="relative z-10">

          {/* ICON */}

          <div
            className="
            mx-auto

            flex
            h-24
            w-24
            items-center
            justify-center

            rounded-3xl

            bg-[linear-gradient(135deg,#00E5FF,#7C3AED,#FF0080)]

            text-white

            shadow-[0_0_45px_rgba(255,0,128,.22)]
          "
          >
            <ShieldX size={42} />
          </div>

          {/* BADGE */}

          <div
            className="
            mx-auto
            mt-4

            inline-flex
            items-center
            gap-2

            rounded-full

            border
            border-pink-400/20

            bg-pink-500/[0.08]

            px-4
            py-2

            text-xs
            font-bold
            uppercase
            tracking-[0.25em]

            text-pink-100
          "
          >

            <AlertTriangle
              size={14}
            />

            Restricted Surface
          </div>

          {/* TITLE */}

          <h1 className="mt-7 text-5xl font-black tracking-tight text-white">
            403
          </h1>

          <h2 className="mt-3 text-2xl font-black text-white">
            Unauthorized Access
          </h2>

          {/* DESCRIPTION */}

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-400">
            This admin surface is protected by
            role-based access control. Your current
            session does not have sufficient
            permissions to continue.
          </p>

          {/* INFO BOXES */}

          <div className="mt-8 grid gap-4 md:grid-cols-2">

            <div
              className="
              rounded-2xl

              border
              border-cyan-400/10

              bg-cyan-400/[0.04]

              p-4

              text-left
            "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center

                  rounded-xl

                  bg-cyan-400/10

                  text-cyan-200
                "
                >
                  <LockKeyhole
                    size={22}
                  />
                </div>

                <div>

                  <div className="text-sm font-bold text-cyan-100">
                    Secure Access
                  </div>

                  <div className="mt-1 text-xs leading-5 text-cyan-100/70">
                    Admin-only infrastructure
                    detected.
                  </div>
                </div>
              </div>
            </div>

            <div
              className="
              rounded-2xl

              border
              border-pink-400/10

              bg-pink-500/[0.04]

              p-4

              text-left
            "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center

                  rounded-xl

                  bg-pink-500/10

                  text-pink-200
                "
                >
                  <ShieldX
                    size={22}
                  />
                </div>

                <div>

                  <div className="text-sm font-bold text-pink-100">
                    Permission Required
                  </div>

                  <div className="mt-1 text-xs leading-5 text-pink-100/70">
                    Contact a SUPER_ADMIN
                    for elevated access.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BUTTONS */}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">

            <Link href="/login">

              <Button
                className="
                min-w-[180px]

                bg-[linear-gradient(135deg,#00E5FF,#7C3AED,#FF0080)]

                shadow-[0_0_30px_rgba(0,229,255,.25)]
              "
              >

                <ArrowLeft
                  size={18}
                />

                Back to Login
              </Button>
            </Link>

            <Link href="/">

              <Button
                variant="secondary"

                className="
                min-w-[180px]

                border-white/10

                bg-white/[0.04]

                hover:bg-white/[0.08]
              "
              >
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </main>
  );
}