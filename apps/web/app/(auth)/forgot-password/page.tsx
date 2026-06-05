"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  ArrowLeft,
  ChevronRight,
  KeyRound,
  ShieldCheck,
  Sparkles,
  LockKeyhole,
  MailCheck
} from "lucide-react";

import { useForm } from "react-hook-form";

import { toast } from "sonner";

import { z } from "zod";

import {
  Button,
  Input
} from "@/ui";

import {
  api,
  apiMessage
} from "@/lib/api";

const schema = z.object({
  email: z
    .string()
    .email("Enter valid email address")
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
          bg-[radial-gradient(circle_at_top,rgba(56,189,248,.12),transparent_35%)]
        "
      />

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-[#050816]
          via-[#040b16]/95
          to-black
        "
      />

      {/* GRID */}

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

      {/* GLOW */}

      <div
        className="
          absolute
          right-[-120px]
          top-[-120px]
          h-[320px]
          w-[320px]
          rounded-full
          bg-cyan-500/10
          blur-[120px]
        "
      />

      <div
        className="
          absolute
          bottom-[-150px]
          left-[-150px]
          h-[320px]
          w-[320px]
          rounded-full
          bg-blue-600/10
          blur-[120px]
        "
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
            max-w-7xl
            overflow-hidden
            rounded-[42px]
            border
            border-white/10
            bg-[#0b1220]/75
            shadow-[0_0_80px_rgba(0,0,0,.45)]
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

            {/* IMAGE */}

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

            {/* OVERLAY */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-br
                from-cyan-500/10
                via-black/85
                to-blue-600/20
              "
            />

            {/* CONTENT */}

            <div
              className="
                relative
                z-10
                flex
                h-full
                flex-col
                justify-between
                p-14
              "
            >

              {/* TOP */}

              <div>

                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/5
                    bg-primary/10
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-cyan-100
                    backdrop-blur-xl
                  "
                >

                  <Sparkles size={15} />

                  FFX ACCOUNT SECURITY
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
                  Recover Your
                  <span
                    className="
                      block
                      bg-gradient-to-r
                      from-cyan-300
                      to-blue-400
                      bg-clip-text
                      text-transparent
                    "
                  >
                    Secure Access
                  </span>
                </h1>

                <p
                  className="
                    mt-6
                    max-w-xl
                    text-lg
                    leading-8
                    text-slate-300
                  "
                >
                  Restore access to your esports identity,
                  wallet balance,
                  tournament records,
                  and competitive profile securely.
                </p>
              </div>

              {/* FEATURES */}

              <div className="space-y-5">

                <Feature
                  icon={ShieldCheck}
                  title="Encrypted Recovery"
                  body="Advanced token-based password recovery system with secure validation."
                />

                <Feature
                  icon={MailCheck}
                  title="Instant Email Delivery"
                  body="Receive reset instructions directly in your registered email inbox."
                />

                <Feature
                  icon={LockKeyhole}
                  title="Protected Authentication"
                  body="Maintain full account integrity and secure player verification."
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
                  h-24
                  w-24
                  items-center
                  justify-center
                  rounded-[30px]
                  border
                  border-cyan-400/10
                  bg-cyan-500/10
                  text-white
                  shadow-[0_0_50px_rgba(34,211,238,.15)]
                "
              >

                <KeyRound size={42} />
              </div>

              {/* HEADING */}

              <div>

                <div
                  className="
                    text-sm
                    font-semibold
                    uppercase
                    tracking-[0.35em]
                    text-white
                  "
                >
                  PASSWORD RECOVERY
                </div>

                <h2
                  className="
                    mt-4
                    text-5xl
                    font-black
                    leading-tight
                    text-white
                  "
                >
                  Forgot Password
                </h2>

                <p
                  className="
                    mt-5
                    text-base
                    leading-8
                    text-slate-400
                  "
                >
                  Enter your registered email address
                  and we’ll send you a secure password
                  reset link instantly.
                </p>
              </div>

              {/* FORM */}

              <form
                className="
                  mt-10
                  space-y-6
                "
                onSubmit={form.handleSubmit(
                  onSubmit
                )}
              >

                {/* EMAIL */}

                <div>

                  <label
                    className="
                      mb-3
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
                      bg-[#121826]
                      text-white
                      placeholder:text-slate-500
                      focus:border-cyan-400/30
                      focus:ring-0
                    "
                  />

                  {form.formState
                    .errors.email && (

                    <p
                      className="
                        mt-2
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

                {/* INFO */}

                <div
                  className="
                    rounded-3xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      items-start
                      gap-4
                    "
                  >

                    <div
                      className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-cyan-500/10
                        text-white
                      "
                    >

                      <ShieldCheck size={22} />
                    </div>

                    <div>

                      <h3
                        className="
                          text-sm
                          font-bold
                          uppercase
                          tracking-[0.2em]
                          text-white
                        "
                      >
                        Security Notice
                      </h3>

                      <p
                        className="
                          mt-2
                          text-sm
                          leading-7
                          text-slate-400
                        "
                      >
                        Reset links automatically expire
                        after a limited duration for enhanced
                        account protection.
                      </p>
                    </div>
                  </div>
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
                    border
                    border-white/5
                    bg-gradient-to-r
                    from-cyan-500
                    to-blue-600
                    text-base
                    font-bold
                    text-white
                    transition-all
                    duration-300
                    hover:scale-[1.01]
                    hover:from-cyan-400
                    hover:to-blue-500
                  "
                >

                  {form.formState
                    .isSubmitting
                    ? "Sending Reset Link..."
                    : "Send Reset Link"}

                  <ChevronRight size={20} />
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
                    transition-all
                    duration-200
                    hover:text-white
                  "
                >

                  <ArrowLeft size={16} />

                  Back to Login
                </Link>
              </div>

              {/* BOTTOM */}

              <div
                className="
                  mt-6
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-xs
                  text-slate-500
                "
              >

                <ShieldCheck size={14} />

                Protected esports authentication infrastructure
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
        p-5
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
          bg-cyan-500/10
          text-white
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
            leading-7
            text-slate-400
          "
        >
          {body}
        </p>
      </div>
    </div>
  );
}