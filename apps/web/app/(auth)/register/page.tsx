"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserPlus,
  Users,
  Wallet
} from "lucide-react";

import { useForm } from "react-hook-form";

import { toast } from "sonner";

import { z } from "zod";

import {
  Button,
  Input
} from "@/ui";

import {
  apiMessage
} from "@/lib/api";

import {
  useAuthStore
} from "@/store/auth-store";

const schema = z.object({

  email: z
    .string()
    .email(),

  username: z
    .string()
    .min(3)
    .max(24),

  phone: z
    .string()
    .optional(),

  referrerCode: z
    .string()
    .optional(),

  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
});

type FormValues =
  z.infer<typeof schema>;

export default function RegisterPage() {

  const router =
    useRouter();

  const registerUser =
    useAuthStore(
      (state) =>
        state.register
    );

  const form =
    useForm<FormValues>({
      resolver:
        zodResolver(
          schema
        ),

      defaultValues: {
        email: "",
        username: "",
        phone: "",
        referrerCode: "",
        password: ""
      }
    });

  async function onSubmit(
    values: FormValues
  ) {

    try {

      await registerUser({
        email:
          values.email,

        username:
          values.username,

        password:
          values.password,

        phone:
          values.phone,

        referrerCode:
          values.referrerCode
      });

      toast.success(
        "Account created successfully"
      );

      router.replace(
        "/verify-otp"
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

      {/* MAIN */}

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

          {/* LEFT */}

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

                  JOIN FFX ESPORTS
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
                  Build Your
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
                    Esports Identity
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
                  Create your competitive gaming account,
                  join elite tournaments,
                  manage squads,
                  and compete for real rewards.
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
                  title="Premium Tournaments"
                  body="Participate in daily cash prize battle royale competitions."
                />

                <Feature
                  icon={Wallet}
                  title="Integrated Wallet"
                  body="Secure deposits, withdrawals, winnings, and bonus systems."
                />

                <Feature
                  icon={Users}
                  title="Team Ecosystem"
                  body="Create squads, invite teammates, and dominate leaderboards."
                />
              </div>
            </div>
          </div>

          {/* RIGHT */}

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
                max-w-lg
              "
            >

              {/* ICON */}

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

                <UserPlus
                  size={38}
                />
              </div>

              {/* TITLE */}

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
                  CREATE ACCOUNT
                </div>

                <h2
                  className="
                    mt-3
                    text-4xl
                    font-black
                    text-white
                  "
                >
                  Start Your Journey
                </h2>

                <p
                  className="
                    mt-4
                    text-base
                    leading-7
                    text-slate-400
                  "
                >
                  Register securely and unlock
                  tournaments,
                  wallets,
                  squads,
                  rankings,
                  and realtime esports systems.
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

                {/* USERNAME + PHONE */}

                <div
                  className="
                    grid
                    gap-4
                    sm:grid-cols-2
                  "
                >

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
                      Username
                    </label>

                    <Input
                      placeholder="neonstriker"
                      {...form.register(
                        "username"
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
                      Phone
                    </label>

                    <Input
                      placeholder="+91..."
                      {...form.register(
                        "phone"
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
                </div>

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
                    placeholder="Minimum 8 characters"
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

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-500
                    "
                  >
                    Must include uppercase,
                    lowercase,
                    and number.
                  </p>
                </div>

                {/* REFERRAL */}

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
                    Referral Code
                  </label>

                  <Input
                    placeholder="Optional"
                    {...form.register(
                      "referrerCode"
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

                {/* BUTTON */}

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
                    ? "Creating..."
                    : "Create Account"}
                </Button>
              </form>

              {/* LOGIN */}

              <p
                className="
                  mt-8
                  text-center
                  text-sm
                  text-slate-400
                "
              >

                Already registered?{" "}

                <Link
                  href="/login"
                  className="
                    font-bold
                    text-blue-300
                    transition
                    hover:text-white
                  "
                >
                  Login
                </Link>
              </p>

              {/* SECURITY */}

              <div
                className="
                  mt-4
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-xs
                  text-slate-500
                "
              >

                <ShieldCheck
                  size={15}
                />

                Secure esports authentication system
              </div>
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