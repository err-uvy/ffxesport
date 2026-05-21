"use client";

import {
  useRouter
} from "next/navigation";

import {
  zodResolver
} from "@hookform/resolvers/zod";

import {
  ShieldCheck,
  LockKeyhole,
  Shield,
  Sparkles,
  Eye,
  EyeOff
} from "lucide-react";

import {
  useState
} from "react";

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
  Card,
  Input
} from "@ffx/ui";

import {
  api,
  apiMessage
} from "@/lib/api";

const schema = z.object({

  email:
    z.string().email(),

  password:
    z.string().min(1)
});

export default function AdminLoginPage() {

  const router =
    useRouter();

  const [showPassword, setShowPassword] =
    useState(false);

  const form =
    useForm<
      z.infer<typeof schema>
    >({

      resolver:
        zodResolver(schema),

      defaultValues: {
        email: "",
        password: ""
      }
    });

  async function onSubmit(
    values: z.infer<
      typeof schema
    >
  ) {

    try {

      const response =
        await api.post(
          "/auth/login",
          values
        );

      const roles =
        response.data.data
          .roles as string[];

      if (
        !roles.some(
          (role) =>
            [
              "SUPER_ADMIN",
              "ADMIN",
              "MODERATOR",
              "SUPPORT"
            ].includes(role)
        )
      ) {

        toast.error(
          "Admin access required"
        );

        await api.post(
          "/auth/logout"
        );

        return;
      }

      toast.success(
        "Welcome to FFX Control Tower"
      );

      router.replace(
        "/admin"
      );

    } catch (error) {

      toast.error(
        apiMessage(error)
      );
    }
  }

  return (

    <main
      className="
      relative

      flex
      min-h-screen
      items-center
      justify-center

      overflow-hidden

      bg-[#020817]

      px-4
    "
    >

      {/* ================================= */}
      {/* BACKGROUND */}
      {/* ================================= */}

      <div className="absolute inset-0 admin-grid opacity-30" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,229,255,.14),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,0,128,.12),transparent_24%),radial-gradient(circle_at_bottom,rgba(124,58,237,.15),transparent_32%)]" />

      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      {/* ================================= */}
      {/* LOGIN CARD */}
      {/* ================================= */}

      <Card
        className="
        relative

        w-full
        max-w-md

        overflow-hidden

        border
        border-white/10

        bg-[#081120]/92

        p-8

        shadow-[0_0_60px_rgba(0,229,255,.12)]

        backdrop-blur-2xl
      "
      >

        {/* Glow */}

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,229,255,.08),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,0,128,.08),transparent_28%)]" />

        <div className="relative z-10">

          {/* LOGO */}

          <div className="mb-8 flex items-center gap-4">

            <div
              className="
              flex
              h-16
              w-16
              items-center
              justify-center

              rounded-3xl

              bg-[linear-gradient(135deg,#00E5FF,#7C3AED,#FF0080)]

              text-white

              shadow-[0_0_35px_rgba(0,229,255,.25)]
            "
            >
              <Shield
                size={30}
              />
            </div>

            <div>

              <div className="flex items-center gap-2">

                <div className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
                  FFX ESPORTS
                </div>

                <Sparkles
                  size={14}

                  className="text-pink-300"
                />
              </div>

              <h1 className="mt-1 text-2xl font-black text-white">
                Admin Login
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Secure RBAC protected control tower.
              </p>
            </div>
          </div>

          {/* SECURITY BAR */}

          <div
            className="
            mb-7

            flex
            items-center
            gap-3

            rounded-2xl

            border
            border-cyan-400/10

            bg-cyan-400/[0.05]

            px-4
            py-3
          "
          >

            <LockKeyhole
              size={18}

              className="text-cyan-200"
            />

            <div className="text-sm font-semibold text-cyan-100">
              Enterprise-grade authentication enabled
            </div>
          </div>

          {/* FORM */}

          <form
            className="space-y-5"

            onSubmit={form.handleSubmit(
              onSubmit
            )}
          >

            {/* EMAIL */}

            <label className="block space-y-2">

              <span className="text-sm font-semibold text-slate-300">
                Admin Email
              </span>

              <Input
                type="email"

                placeholder="admin@ffxesports.com"

                {...form.register(
                  "email"
                )}

                className="
                border-white/10

                bg-[#020817]/80

                focus:border-cyan-400/40
              "
              />
            </label>

            {/* PASSWORD */}

            <label className="block space-y-2">

              <span className="text-sm font-semibold text-slate-300">
                Password
              </span>

              <div className="relative">

                <Input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }

                  placeholder="Enter secure password"

                  {...form.register(
                    "password"
                  )}

                  className="
                  border-white/10

                  bg-[#020817]/80

                  pr-12

                  focus:border-pink-400/40
                "
                />

                <button
                  type="button"

                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }

                  className="
                  absolute
                  right-3
                  top-1/2

                  -translate-y-1/2

                  text-slate-400

                  transition

                  hover:text-white
                "
                >
                  {showPassword ? (
                    <EyeOff
                      size={18}
                    />
                  ) : (
                    <Eye
                      size={18}
                    />
                  )}
                </button>
              </div>
            </label>

            {/* BUTTON */}

            <Button
              className="
              mt-1
              w-full

              bg-[linear-gradient(135deg,#00E5FF,#7C3AED,#FF0080)]

              shadow-[0_0_30px_rgba(0,229,255,.25)]

              hover:shadow-[0_0_45px_rgba(255,0,128,.28)]
            "

              disabled={
                form.formState
                  .isSubmitting
              }
            >

              <ShieldCheck
                size={18}
              />

              {form.formState
                .isSubmitting
                ? "Authorizing..."
                : "Enter Control Tower"}
            </Button>
          </form>

          {/* FOOTER */}

          <div
            className="
            mt-8

            rounded-2xl

            border
            border-white/8

            bg-white/[0.03]

            p-4

            text-center
          "
          >

            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Security Layer
            </div>

            <div className="mt-1 text-sm font-semibold text-slate-300">
              JWT Sessions • RBAC • Audit Logs •
              Fraud Monitoring
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}