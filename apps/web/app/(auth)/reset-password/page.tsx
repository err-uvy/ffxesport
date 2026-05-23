"use client";

import Link from "next/link";

import {
  useSearchParams
} from "next/navigation";

import {
  Suspense
} from "react";

import {
  zodResolver
} from "@hookform/resolvers/zod";

import {
  ArrowRight,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Sparkles
} from "lucide-react";

import {
  useForm
} from "react-hook-form";

import {
  toast
} from "sonner";

import {
  z
} from "zod";

import {
  Button,
  Input
} from "@/ui";

import {
  api,
  apiMessage
} from "@/lib/api";

const schema = z.object({

  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
});

export default function ResetPasswordPage() {

  return (

    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {

  const params =
    useSearchParams();

  const token =
    params.get("token") ?? "";

  const form =
    useForm<
      z.infer<typeof schema>
    >({
      resolver:
        zodResolver(schema),

      defaultValues: {
        password: ""
      }
    });

  async function onSubmit(
    values: z.infer<
      typeof schema
    >
  ) {

    try {

      await api.post(
        "/auth/reset-password",
        {
          token,
          password:
            values.password
        }
      );

      toast.success(
        "Password reset successful"
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
          from-[#050816]
          via-[#050816]/90
          to-black
        "
      />

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
            "42px 42px"
        }}
      />

      <div
        className="
          absolute
          top-[-120px]
          right-[-120px]
          h-[320px]
          w-[320px]
          rounded-full
          bg-blue-500/20
          blur-[120px]
        "
      />

      <div
        className="
          absolute
          bottom-[-140px]
          left-[-140px]
          h-[320px]
          w-[320px]
          rounded-full
          bg-cyan-500/10
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

          {/* LEFT PANEL */}

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
                bg-gradient-to-br
                from-blue-600/20
                via-black/85
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
                p-14
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
                    border-blue-400/20
                    bg-blue-400/10
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-blue-100
                  "
                >

                  <Sparkles
                    size={15}
                  />

                  ACCOUNT SECURITY
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
                  Reset Your
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
                    Secure Access
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
                  Create a fresh password
                  and protect your esports identity,
                  tournament wallet,
                  and gaming profile.
                </p>
              </div>

              <div
                className="
                  space-y-5
                "
              >

                <Feature
                  icon={ShieldCheck}
                  title="Protected Sessions"
                  body="Older sessions automatically become invalid after password reset."
                />

                <Feature
                  icon={LockKeyhole}
                  title="Advanced Security"
                  body="Your account remains protected with encrypted authentication."
                />

                <Feature
                  icon={KeyRound}
                  title="Secure Recovery"
                  body="Reset links are token-based and expire automatically."
                />
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}

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

                <ShieldCheck
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
                  RESET PASSWORD
                </div>

                <h2
                  className="
                    mt-3
                    text-4xl
                    font-black
                    text-white
                  "
                >
                  Create New Password
                </h2>

                <p
                  className="
                    mt-4
                    text-base
                    leading-7
                    text-slate-400
                  "
                >
                  Set a new strong password
                  to regain access to your
                  FFX ESPORTS account securely.
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
                    New Password
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

                  <div
                    className="
                      mt-3
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/[0.03]
                      p-4
                    "
                  >

                    <div
                      className="
                        mb-2
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.2em]
                        text-slate-400
                      "
                    >
                      PASSWORD RULES
                    </div>

                    <ul
                      className="
                        space-y-2
                        text-sm
                        text-slate-400
                      "
                    >
                      <li>
                        • Minimum 8 characters
                      </li>

                      <li>
                        • Include uppercase letter
                      </li>

                      <li>
                        • Include lowercase letter
                      </li>

                      <li>
                        • Include number
                      </li>
                    </ul>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={
                    form.formState
                      .isSubmitting || !token
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
                    ? "Resetting..."
                    : "Reset Password"}
                </Button>

                {!token && (

                  <div
                    className="
                      rounded-2xl
                      border
                      border-red-500/20
                      bg-red-500/10
                      p-4
                      text-sm
                      text-red-200
                    "
                  >
                    Invalid or missing reset token.
                  </div>
                )}
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

                Back to{" "}

                <Link
                  href="/login"
                  className="
                    font-bold
                    text-blue-300
                    transition
                    hover:text-white
                  "
                >
                  login
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
                  size={14}
                />

                Secure encrypted authentication system
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