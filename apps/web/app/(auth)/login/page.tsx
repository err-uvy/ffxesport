"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  ArrowRight,
  Mail,
  Disc3
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
        zodResolver(schema),

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
        "Welcome back"
      );

      router.push(
        "/dashboard"
      );

      router.refresh();

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
          w-full
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
            items-center
            gap-16
            lg:grid-cols-[1fr_480px]
          "
        >
          {/* LEFT SIDE */}

          <div
            className="
              hidden
              lg:block
            "
          >
            <div
              className="
                mb-6
                inline-flex
                rounded-full
                border
                border-border
                bg-card
                px-4
                py-2
                text-xs
                font-semibold
                uppercase
                tracking-[0.25em]
                text-muted
              "
            >
              FFX ESPORTS
            </div>

            <h1
              className="
                max-w-3xl
                text-5xl
                font-bold
                leading-[1.05]
                tracking-tight
                text-white
                xl:text-6xl
              "
            >
              Competitive esports platform
              built for modern tournament
              gaming.
            </h1>

            <p
              className="
                mt-6
                max-w-2xl
                text-lg
                leading-8
                text-muted
              "
            >
              Join premium tournaments,
              secure wallets, real-time
              match rooms, and competitive
              gaming events in one unified
              platform.
            </p>

            <div
              className="
                mt-10
                grid
                max-w-2xl
                grid-cols-2
                gap-4
              "
            >
              {[
                "Real-time Matches",
                "Instant Wallet",
                "Secure Prize Pools",
                "Tournament Analytics"
              ].map((item) => (
                <div
                  key={item}
                  className="
                    premium-card
                    min-h-[88px]
                    rounded-2xl
                    px-5
                    py-4
                    text-sm
                    font-medium
                    text-white
                  "
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div
            className="
              relative
              w-full
              max-w-[480px]
              ml-auto
            "
          >
            <div
              className="
                rounded-[32px]
                border
                border-border
                bg-card
                p-7
                shadow-card
                transition-all
                duration-200
                hover:border-primary/20
                sm:p-9
              "
            >
              {/* HEADER */}

              <div
                className="
                  mb-8
                "
              >
                <div
                  className="
                    mb-4
                    inline-flex
                    rounded-full
                    border
                    border-border
                    bg-background-secondary
                    px-4
                    py-1.5
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.3em]
                    text-muted
                  "
                >
                  PLAYER LOGIN
                </div>

                <h2
                  className="
                    text-3xl
                    font-bold
                    tracking-tight
                    text-white
                  "
                >
                  Welcome back
                </h2>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-7
                    text-muted
                  "
                >
                  Login to access tournaments,
                  wallet, rankings, squads,
                  and match operations.
                </p>
              </div>

              {/* FORM */}

              <form
                className="
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
                      text-muted
                    "
                  >
                    Email Address
                  </label>

                  <Input
                    type="email"
                    placeholder="player@example.com"
                    {...form.register(
                      "email"
                    )}
                    className="
                      h-14
                      rounded-2xl
                      border-border
                      bg-background-secondary
                      text-white
                      focus:border-primary
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
                      font-medium
                      text-muted
                    "
                  >
                    Password
                  </label>

                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...form.register(
                      "password"
                    )}
                    className="
                      h-14
                      rounded-2xl
                      border-border
                      bg-background-secondary
                      text-white
                      focus:border-primary
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
                      text-muted
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
                      font-medium
                      text-primary
                      transition
                      hover:text-white
                    "
                  >
                    Forgot password
                  </Link>
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
                    bg-primary
                    text-base
                    font-semibold
                    text-white
                    transition
                    hover:opacity-90
                  "
                >
                  <ArrowRight
                    size={18}
                  />

                  {form.formState
                    .isSubmitting
                    ? "Authenticating..."
                    : "Login"}
                </Button>
              </form>

              {/* SOCIAL */}

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
                  <div className="h-px flex-1 bg-border" />

                  <span
                    className="
                      text-xs
                      uppercase
                      tracking-[0.25em]
                      text-muted
                    "
                  >
                    Continue With
                  </span>

                  <div className="h-px flex-1 bg-border" />
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
                      border-border
                      bg-background-secondary
                      text-sm
                      font-medium
                      text-white
                      transition
                      hover:border-primary/20
                    "
                  >
                    <Mail size={18} />
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
                      border-border
                      bg-background-secondary
                      text-sm
                      font-medium
                      text-white
                      transition
                      hover:border-primary/20
                    "
                  >
                    <Disc3 size={18} />
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
                  text-muted
                "
              >
                New to FFX ESPORTS?{" "}

                <Link
                  href="/register"
                  className="
                    font-semibold
                    text-primary
                    transition
                    hover:text-white
                  "
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

