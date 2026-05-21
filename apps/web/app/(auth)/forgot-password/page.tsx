"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  Sparkles
} from "lucide-react";

import { useForm } from "react-hook-form";

import { toast } from "sonner";

import { z } from "zod";

import {
  Button,
  Input
} from "@ffx/ui";

import { AuthShell } from "@/components/auth-shell";

import {
  api,
  apiMessage
} from "@/lib/api";

const schema = z.object({
  email: z
    .string()
    .email()
});

export default function ForgotPasswordPage() {

  const form =
    useForm<
      z.infer<typeof schema>
    >({
      resolver:
        zodResolver(schema),

      defaultValues: {
        email: ""
      }
    });

  async function onSubmit(
    values: z.infer<
      typeof schema
    >
  ) {

    try {

      await api.post(
        "/auth/forgot-password",
        values
      );

      toast.success(
        "Password reset link sent successfully"
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
          bg-[radial-gradient(circle_at_top,rgba(37,99,235,.25),transparent_40%)]
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
          py-12
        "
      >

        <div
          className="
            grid
            w-full
            max-w-6xl
            overflow-hidden
            rounded-[40px]
            border
            border-white/10
            bg-[#0b1020]/80
            backdrop-blur-2xl
            xl:grid-cols-2
          "
        >

          {/* LEFT SIDE */}

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
                opacity-30
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
                from-blue-600/30
                via-black/70
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
                p-10
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
                  <Sparkles size={16} />

                  FFX ESPORTS SECURITY
                </div>

                <h1
                  className="
                    mt-8
                    text-5xl
                    font-black
                    leading-tight
                    text-white
                  "
                >
                  Recover Your
                  <span className="block text-blue-400">
                    Gaming Account
                  </span>
                </h1>

                <p
                  className="
                    mt-4
                    max-w-md
                    text-lg
                    leading-8
                    text-slate-300
                  "
                >
                  Secure password reset system
                  for tournament players,
                  esports teams,
                  and verified gaming accounts.
                </p>
              </div>

              <div className="space-y-5">

                <Feature
                  icon={
                    ShieldCheck
                  }
                  title="Secure Recovery"
                  body="Encrypted email token authentication system"
                />

                <Feature
                  icon={
                    KeyRound
                  }
                  title="Fast Reset"
                  body="Reset your password in under 60 seconds"
                />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div
            className="
              flex
              items-center
              justify-center
              p-6
              sm:p-10
              xl:p-14
            "
          >

            <div className="w-full max-w-md">

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
                <KeyRound
                  size={38}
                />
              </div>

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
                  ACCOUNT RECOVERY
                </div>

                <h2
                  className="
                    mt-3
                    text-4xl
                    font-black
                    text-white
                  "
                >
                  Forgot Password
                </h2>

                <p
                  className="
                    mt-4
                    text-base
                    leading-7
                    text-slate-400
                  "
                >
                  Enter your registered email
                  address and we’ll send
                  you a secure password reset link.
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

                  {form.formState
                    .errors.email && (
                    <p
                      className="
                        mt-1
                        text-sm
                        text-red-400
                      "
                    >
                      {
                        form
                          .formState
                          .errors
                          .email
                          ?.message
                      }
                    </p>
                  )}
                </div>

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

                  <KeyRound
                    size={20}
                  />

                  {form.formState
                    .isSubmitting
                    ? "Sending..."
                    : "Send Reset Link"}
                </Button>
              </form>

              {/* FOOTER */}

              <div
                className="
                  mt-8
                  flex
                  items-center
                  justify-center
                "
              >

                <Link
                  href="/login"
                  className="
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-slate-400
                    transition
                    hover:text-white
                  "
                >

                  <ArrowLeft
                    size={16}
                  />

                  Back to Login
                </Link>
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
        <Icon size={22} />
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