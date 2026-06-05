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
  ShieldCheck
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
        min-h-screen
        bg-background
        text-white
      "
    >

      <div
        className="
          mx-auto
          grid
          min-h-screen
          w-full
          max-w-[1600px]
          xl:grid-cols-2
        "
      >

        {/* LEFT PANEL */}

        <div
          className="
            hidden
            border-r
            border-border
            px-16
            py-14
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
                border-primary/20
                bg-primary/10
                px-4
                py-2
                text-xs
                font-semibold
                uppercase
                tracking-[0.25em]
                text-primary
              "
            >
              ACCOUNT SECURITY
            </div>

            <h1
              className="
                mt-8
                max-w-2xl
                text-6xl
                font-bold
                leading-[1.05]
                tracking-tight
              "
            >
              Reset your secure access.
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
              Create a new password to
              secure your esports identity,
              wallet access,
              tournament data,
              and gaming profile.
            </p>
          </div>

          <div
            className="
              grid
              gap-5
              max-w-xl
            "
          >

            <Feature
              icon={ShieldCheck}
              title="Protected Sessions"
              body="Older sessions automatically expire after password reset."
            />

            <Feature
              icon={LockKeyhole}
              title="Advanced Security"
              body="Encrypted authentication keeps your account protected."
            />

            <Feature
              icon={KeyRound}
              title="Secure Recovery"
              body="Reset tokens are time-limited and securely validated."
            />
          </div>
        </div>

        {/* RIGHT PANEL */}

        <div
          className="
            flex
            items-center
            justify-center
            px-5
            py-10
            sm:px-8
            lg:px-12
          "
        >

          <div
            className="
              w-full
              max-w-lg
              rounded-[32px]
              border
              border-border
              bg-card
              p-8
              shadow-card
              sm:p-10
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
                bg-primary/10
                text-primary
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
                  text-primary
                "
              >
                RESET PASSWORD
              </div>

              <h2
                className="
                  mt-3
                  text-4xl
                  font-bold
                  tracking-tight
                "
              >
                Create New Password
              </h2>

              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-muted
                "
              >
                Set a strong password to
                regain secure access to
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

              <div>

                <label
                  className="
                    mb-2
                    block
                    text-sm
                    font-semibold
                    text-muted
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
                  "
                />

                <div
                  className="
                    mt-4
                    rounded-2xl
                    border
                    border-border
                    bg-card
                    p-4
                  "
                >

                  <div
                    className="
                      mb-3
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      text-muted
                    "
                  >
                    PASSWORD RULES
                  </div>

                  <ul
                    className="
                      space-y-2
                      text-sm
                      text-muted
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
                  text-base
                  font-semibold
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
                text-muted
              "
            >

              Back to{" "}

              <Link
                href="/login"
                className="
                  font-semibold
                  text-primary
                  transition
                  hover:opacity-80
                "
              >
                login
              </Link>
            </p>

            {/* SECURITY */}

            <div
              className="
                mt-5
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

              Secure encrypted authentication system
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
        border-border
        bg-card
        p-5
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
          bg-primary/10
          text-primary
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
            font-semibold
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
            text-muted
          "
        >
          {body}
        </p>
      </div>
    </div>
  );
}

