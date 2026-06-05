"use client";

import Link from "next/link";

import {
  zodResolver
} from "@hookform/resolvers/zod";

import {
  BadgeCheck,
  ShieldCheck,
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
        min-h-screen
        bg-background
        text-white
      "
    >

      <div
        className="
          mx-auto
          flex
          min-h-screen
          max-w-[1400px]
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
            overflow-hidden
            rounded-[32px]
            border
            border-border
            bg-card
            xl:grid-cols-2
          "
        >

          {/* LEFT SIDE */}

          <div
            className="
              hidden
              border-r
              border-border
              p-14
              xl:flex
              xl:flex-col
              xl:justify-between
            "
          >

            <div>

              <div
                className="
                  inline-flex
                  items-center
                  rounded-full
                  border
                  border-border
                  bg-background-secondary
                  px-4
                  py-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-muted
                "
              >
                VERIFIED PLAYER SYSTEM
              </div>

              <h1
                className="
                  mt-8
                  max-w-xl
                  text-6xl
                  font-bold
                  leading-[1.05]
                  tracking-tight
                  text-white
                "
              >
                Verify your
                esports identity.
              </h1>

              <p
                className="
                  mt-6
                  max-w-xl
                  text-lg
                  leading-8
                  text-muted
                "
              >
                Activate your player profile,
                unlock tournaments,
                secure wallet access,
                and enter competitive matchmaking.
              </p>
            </div>

            <div
              className="
                space-y-4
              "
            >

              <Feature
                title="Trusted Verification"
                body="OTP verification prevents fake accounts and protects tournament integrity."
              />

              <Feature
                title="Protected Wallet Access"
                body="Verified email helps secure withdrawals, recovery, and player authentication."
              />

              <Feature
                title="Competitive Access"
                body="Verified players unlock premium tournaments and ranked participation."
              />
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
                  h-18
                  w-18
                  items-center
                  justify-center
                  rounded-3xl
                  border
                  border-border
                  bg-background-secondary
                "
              >

                <BadgeCheck
                  size={34}
                />
              </div>

              {/* HEADER */}

              <div>

                <div
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.3em]
                    text-muted
                  "
                >
                  ACCOUNT VERIFICATION
                </div>

                <h2
                  className="
                    mt-3
                    text-4xl
                    font-bold
                    tracking-tight
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
                    text-muted
                  "
                >
                  Enter the verification code sent
                  to your email address to activate
                  your FFX ESPORTS account.
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
                      font-medium
                      text-white
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
                      border-border
                      bg-background-secondary
                      text-white
                    "
                  />
                </div>

                {/* OTP */}

                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      font-medium
                      text-white
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
                      border-border
                      bg-background-secondary
                      text-center
                      text-xl
                      tracking-[0.35em]
                      text-white
                    "
                  />
                </div>

                {/* VERIFY BUTTON */}

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
                    text-base
                    font-semibold
                  "
                >

                  <ShieldCheck
                    size={18}
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
                  border-border
                  bg-background-secondary
                  text-white
                "
              >

                <TimerReset
                  size={18}
                />

                Resend OTP
              </Button>

              {/* FOOTER */}

              <p
                className="
                  mt-8
                  text-center
                  text-sm
                  text-muted
                "
              >

                Back to{" "}

                <Link
                  href="/login"
                  className="
                    font-semibold
                    text-white
                  "
                >
                  login
                </Link>
              </p>

              {/* SECURITY */}

              <div
                className="
                  mt-6
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-xs
                  text-muted
                "
              >

                <ShieldCheck
                  size={14}
                />

                Secure encrypted authentication
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({
  title,
  body
}: {
  title: string;
  body: string;
}) {

  return (

    <div
      className="
        rounded-2xl
        border
        border-border
        bg-background-secondary
        p-5
      "
    >

      <h3
        className="
          text-base
          font-semibold
          text-white
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-2
          text-sm
          leading-6
          text-muted
        "
      >
        {body}
      </p>
    </div>
  );
}