"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  ArrowRight,
  Disc3,
  Mail,
  ShieldCheck,
  Sparkles,
  Trophy,
  Zap
} from "lucide-react";

import { useForm } from "react-hook-form";

import { toast } from "sonner";

import { z } from "zod";

import {
  Button,
  Input
} from "@ffx/ui";

import {
  apiMessage
} from "@/lib/api";

import {
  useAuthStore
} from "@/store/auth-store";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().default(true)
});

type FormValues =
  z.infer<typeof schema>;

const apiUrl =
  process.env
    .NEXT_PUBLIC_API_URL ??
  "http://localhost:4000/api";

export default function LoginPage() {

  const router =
    useRouter();

  const login =
    useAuthStore(
      (state) =>
        state.login
    );

  const form =
    useForm<FormValues>({
      resolver:
        zodResolver(
          schema
        ),

      defaultValues: {
        email: "",
        password: "",
        rememberMe: true
      }
    });

  async function onSubmit(
    values: FormValues
  ) {

    try {

      await login(
        values.email,
        values.password,
        values.rememberMe
      );

      toast.success(
        "Welcome back to FFX ESPORTS"
      );

      router.replace(
        "/dashboard"
      );

    } catch (error) {

      toast.error(
        apiMessage(error)
      );
    }
  }

  return (

    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#050816]
      "
    >

      {/* BACKGROUND */}

      <div
        className="
          absolute
          inset-0
          opacity-20
        "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize:
            "cover",
          backgroundPosition:
            "center"
        }}
      />

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top,rgba(37,99,235,.25),transparent_35%)]
        "
      />

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-[#050816]
          via-[#050816]/90
          to-black
        "
      />

      {/* GRID */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.05]
        "
        style={{
          backgroundImage:
            `
            linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
          `,
          backgroundSize:
            "45px 45px"
        }}
      />

      {/* CONTENT */}

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-5
          py-10
        "
      >

        <div
          className="
            grid
            w-full
            max-w-full
            overflow-hidden
            rounded-[40px]
            border
            border-white/10
            bg-[#0b1020]/80
            backdrop-blur-2xl
            xl:grid-cols-2
          "
        >

          {/* LEFT SECTION */}

          <div
            className="
              relative
              hidden
              overflow-hidden
              border-r
              border-white/10
              xl:block
            "
          >

            <div
              className="
                absolute
                inset-0
                opacity-25
              "
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80')",
                backgroundSize:
                  "cover",
                backgroundPosition:
                  "center"
              }}
            />

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-br
                from-blue-600/25
                via-black/80
                to-cyan-500/10
              "
            />

            <div
              className="
                relative
                z-10
                flex
                h-full
                flex-col
                justify-between
                p-12
              "
            >

              <div>

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-blue-500/20
                    bg-blue-500/10
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-blue-100
                  "
                >

                  <Sparkles
                    size={16}
                  />

                  FFX ESPORTS PLATFORM
                </div>

                <h1
                  className="
                    mt-8
                    text-6xl
                    font-black
                    leading-tight
                    text-white
                  "
                >
                  Enter The
                  <span
                    className="
                      block
                      bg-gradient-to-r
                      from-blue-400
                      to-cyan-300
                      bg-clip-text
                      text-transparent
                    "
                  >
                    Battle Arena
                  </span>
                </h1>

                <p
                  className="
                    mt-4
                    max-w-xl
                    text-lg
                    leading-8
                    text-slate-300
                  "
                >
                  Compete in premium esports
                  tournaments, build elite squads,
                  earn winnings,
                  and dominate global rankings.
                </p>
              </div>

              <div
                className="
                  grid
                  gap-5
                "
              >

                <Feature
                  icon={Trophy}
                  title="Competitive Tournaments"
                  body="Daily battle royale and esports events with real cash rewards."
                />

                <Feature
                  icon={ShieldCheck}
                  title="Secure Authentication"
                  body="Protected player sessions and advanced anti-fraud security."
                />

                <Feature
                  icon={Zap}
                  title="Realtime Match System"
                  body="Live rooms, score tracking, leaderboards, and tournament automation."
                />
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}

          <div
            className="
              flex
              items-center
              justify-center
              p-6
              sm:p-10
              xl:p-16
            "
          >

            <div
              className="
                w-full
                max-w-md
              "
            >

              {/* LOGO */}

              <div
                className="
                  mb-8
                  flex
                  h-20
                  w-20
                  items-center
                  justify-center
                  rounded-[28px]
                  bg-blue-500/10
                  text-blue-400
                  shadow-[0_0_50px_rgba(59,130,246,.25)]
                "
              >

                <ShieldCheck
                  size={38}
                />
              </div>

              {/* TEXT */}

              <div>

                <div
                  className="
                    text-sm
                    font-semibold
                    uppercase
                    tracking-[0.3em]
                    text-blue-300
                  "
                >
                  PLAYER LOGIN
                </div>

                <h2
                  className="
                    mt-3
                    text-4xl
                    font-black
                    text-white
                  "
                >
                  Welcome Back
                </h2>

                <p
                  className="
                    mt-4
                    text-base
                    leading-7
                    text-slate-400
                  "
                >
                  Login securely to access tournaments,
                  squads,
                  wallet,
                  rankings,
                  and match operations.
                </p>
              </div>

              {/* FORM */}

              <form
                className="
                  mt-10
                  space-y-5
                "
                onSubmit={form.handleSubmit(
                  onSubmit
                )}
              >

                {/* EMAIL */}

                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-300
                    "
                  >
                    Email Address
                  </label>

                  <Input
                    type="email"
                    placeholder="player@ffxesports.com"
                    {...form.register(
                      "email"
                    )}
                    className="
                      h-14
                      rounded-2xl
                      border-white/10
                      bg-[#111827]
                      text-white
                    "
                  />

                </div>

                {/* PASSWORD */}

                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-semibold
                      text-slate-300
                    "
                  >
                    Password
                  </label>

                  <Input
                    type="password"
                    placeholder="Your password"
                    {...form.register(
                      "password"
                    )}
                    className="
                      h-14
                      rounded-2xl
                      border-white/10
                      bg-[#111827]
                      text-white
                    "
                  />

                </div>

                {/* OPTIONS */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    text-sm
                  "
                >

                  <label
                    className="
                      flex
                      items-center
                      gap-2
                      text-slate-300
                    "
                  >

                    <input
                      type="checkbox"
                      className="
                        h-4
                        w-4
                        accent-blue-500
                      "
                      {...form.register(
                        "rememberMe"
                      )}
                    />

                    Remember me
                  </label>

                  <Link
                    href="/forgot-password"
                    className="
                      font-semibold
                      text-blue-300
                      transition
                      hover:text-white
                    "
                  >
                    Forgot password
                  </Link>
                </div>

                {/* LOGIN BUTTON */}

                <Button
                  type="submit"
                  disabled={
                    form.formState
                      .isSubmitting
                  }
                  className="
                    h-14
                    w-full
                    rounded-2xl
                    bg-blue-600
                    text-base
                    font-bold
                    hover:bg-blue-700
                  "
                >

                  <ArrowRight
                    size={20}
                  />

                  {form.formState
                    .isSubmitting
                    ? "Authenticating..."
                    : "Login"}
                </Button>
              </form>

              {/* SOCIAL LOGIN */}

              <div
                className="
                  mt-8
                "
              >

                <div
                  className="
                    mb-4
                    flex
                    items-center
                    gap-3
                  "
                >

                  <div className="h-px flex-1 bg-white/10" />

                  <span
                    className="
                      text-xs
                      uppercase
                      tracking-[0.25em]
                      text-slate-500
                    "
                  >
                    Continue With
                  </span>

                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <div
                  className="
                    grid
                    gap-3
                    sm:grid-cols-2
                  "
                >

                  <a
                    href={`${apiUrl}/auth/google`}
                    className="
                      flex
                      h-14
                      items-center
                      justify-center
                      gap-2
                      rounded-2xl
                      border
                      border-white/10
                      bg-[#111827]
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:border-blue-400/40
                      hover:bg-[#172036]
                    "
                  >

                    <Mail
                      size={18}
                    />

                    Google
                  </a>

                  <a
                    href={`${apiUrl}/auth/discord`}
                    className="
                      flex
                      h-14
                      items-center
                      justify-center
                      gap-2
                      rounded-2xl
                      border
                      border-white/10
                      bg-[#111827]
                      text-sm
                      font-semibold
                      text-white
                      transition
                      hover:border-cyan-400/40
                      hover:bg-[#172036]
                    "
                  >

                    <Disc3
                      size={18}
                    />

                    Discord
                  </a>
                </div>
              </div>

              {/* REGISTER */}

              <p
                className="
                  mt-8
                  text-center
                  text-sm
                  text-slate-400
                "
              >

                New to FFX ESPORTS?{" "}

                <Link
                  href="/register"
                  className="
                    font-bold
                    text-blue-300
                    transition
                    hover:text-white
                  "
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body
}: {
  icon: any;
  title: string;
  body: string;
}) {

  return (

    <div
      className="
        flex
        items-start
        gap-4
        rounded-3xl
        border
        border-white/10
        bg-white/[0.03]
        p-4
        backdrop-blur-xl
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
          bg-blue-500/10
          text-blue-400
        "
      >

        <Icon
          size={22}
        />
      </div>

      <div>

        <h3
          className="
            text-lg
            font-bold
            text-white
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-1
            text-sm
            leading-6
            text-slate-400
          "
        >
          {body}
        </p>
      </div>
    </div>
  );
}