"use client";

import Link from "next/link";

import {
  zodResolver
} from "@hookform/resolvers/zod";

import {
  BadgeCheck,
  Mail,
  ShieldCheck,
  Sparkles,
  Send,
  TimerReset
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

  email:
    z.string().email(),

  code:
    z.string().length(6)
});

export default function VerifyOtpPage() {

  const form =
    useForm<
      z.infer<typeof schema>
    >({

      resolver:
        zodResolver(schema),

      defaultValues: {
        email: "",
        code: ""
      }
    });

  async function onSubmit(
    values: z.infer<
      typeof schema
    >
  ) {

    try {

      await api.post(
        "/auth/verify-otp",
        {
          ...values,
          purpose:
            "EMAIL_VERIFY"
        }
      );

      toast.success(
        "Email verified successfully"
      );

    } catch (error) {

      toast.error(
        apiMessage(error)
      );
    }
  }

  async function resend() {

    const email =
      form.getValues(
        "email"
      );

    if (!email) {

      return toast.error(
        "Enter your email first"
      );
    }

    try {

      await api.post(
        "/auth/send-otp",
        {
          email,
          purpose:
            "EMAIL_VERIFY"
        }
      );

      toast.success(
        "OTP sent successfully"
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
                from-cyan-500/10
                via-black/85
                to-blue-600/20
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
                    border-cyan-400/20
                    bg-cyan-400/10
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-cyan-100
                  "
                >

                  <Sparkles
                    size={15}
                  />

                  VERIFIED PLAYER SYSTEM
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
                  Verify Your
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
                  Secure your player profile,
                  unlock tournaments,
                  and activate trusted
                  esports participation.
                </p>
              </div>

              <div
                className="
                  space-y-5
                "
              >

                <Feature
                  icon={ShieldCheck}
                  title="Secure Verification"
                  body="OTP verification keeps tournaments trusted and prevents fake accounts."
                />

                <Feature
                  icon={BadgeCheck}
                  title="Verified Badge"
                  body="Unlock verified player status across FFX ESPORTS systems."
                />

                <Feature
                  icon={Mail}
                  title="Protected Access"
                  body="Your email becomes secured for wallet recovery and login safety."
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
                  bg-cyan-500/10
                  text-cyan-300
                  shadow-[0_0_50px_rgba(34,211,238,.25)]
                "
              >

                <BadgeCheck
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
                    text-cyan-300
                  "
                >
                  ACCOUNT VERIFICATION
                </div>

                <h2
                  className="
                    mt-3
                    text-4xl
                    font-black
                    text-white
                  "
                >
                  Verify OTP
                </h2>

                <p
                  className="
                    mt-4
                    text-base
                    leading-7
                    text-slate-400
                  "
                >
                  Enter your verification code
                  to activate your FFX ESPORTS account.
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
                    OTP Code
                  </label>

                  <Input
                    inputMode="numeric"
                    placeholder="123456"
                    {...form.register(
                      "code"
                    )}
                    className="
                      h-14
                      rounded-2xl
                      border-white/10
                      bg-[#111827]
                      text-center
                      text-2xl
                      tracking-[0.4em]
                      text-white
                    "
                  />
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
                    bg-cyan-500
                    text-base
                    font-bold
                    text-black
                    hover:bg-cyan-400
                  "
                >

                  <ShieldCheck
                    size={20}
                  />

                  {form.formState
                    .isSubmitting
                    ? "Verifying..."
                    : "Verify Account"}
                </Button>
              </form>

              {/* RESEND */}

              <Button
                variant="secondary"
                onClick={resend}
                className="
                  mt-4
                  h-14
                  w-full
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  text-white
                  hover:bg-white/[0.06]
                "
              >

                <TimerReset
                  size={20}
                />

                Resend OTP
              </Button>

              {/* FOOTER */}

              <p
                className="
                  mt-8
                  text-center
                  text-sm
                  text-slate-400
                "
              >

                Continue to{" "}

                <Link
                  href="/dashboard"
                  className="
                    font-bold
                    text-cyan-300
                    transition
                    hover:text-white
                  "
                >
                  dashboard
                </Link>
              </p>

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

                Protected by secure esports authentication
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
          bg-cyan-500/10
          text-cyan-300
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