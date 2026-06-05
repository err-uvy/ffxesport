"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  ArrowRight,
  Trophy,
  Wallet,
  Users,
  UserPlus,
  ShieldCheck
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

        {/* LEFT SECTION */}

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
              JOIN FFX ESPORTS
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
              Build your esports identity.
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
              Create your competitive gaming account,
              join tournaments,
              manage squads,
              and compete in premium esports events.
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
              icon={Trophy}
              title="Premium Tournaments"
              body="Daily competitive events with secure prize systems."
            />

            <Feature
              icon={Wallet}
              title="Integrated Wallet"
              body="Fast deposits, withdrawals, rewards, and bonus management."
            />

            <Feature
              icon={Users}
              title="Team Ecosystem"
              body="Create squads and compete with teammates in realtime."
            />
          </div>
        </div>

        {/* RIGHT SECTION */}

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

              <UserPlus
                size={38}
              />
            </div>

            {/* HEADER */}

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
                CREATE ACCOUNT
              </div>

              <h2
                className="
                  mt-3
                  text-4xl
                  font-bold
                  tracking-tight
                "
              >
                Start Your Journey
              </h2>

              <p
                className="
                  mt-4
                  text-base
                  leading-7
                  text-muted
                "
              >
                Register securely and access tournaments,
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
                      text-muted
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
                      text-muted
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
                    text-muted
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
                    text-muted
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
                  "
                />

                <p
                  className="
                    mt-2
                    text-xs
                    text-muted
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
                    text-muted
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
                  text-base
                  font-semibold
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
                text-muted
              "
            >

              Already registered?{" "}

              <Link
                href="/login"
                className="
                  font-semibold
                  text-primary
                  transition
                  hover:opacity-80
                "
              >
                Login
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
                size={15}
              />

              Secure esports authentication system
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

