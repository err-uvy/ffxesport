"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Disc3, Mail, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button, Input } from "@ffx/ui";
import { AuthShell } from "@/components/auth-shell";
import { apiMessage } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  rememberMe: z.boolean().default(true)
});

type FormValues = z.infer<typeof schema>;
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", rememberMe: true }
  });

  async function onSubmit(values: FormValues) {
    try {
      await login(values.email, values.password, values.rememberMe);
      toast.success("Welcome back to FFX ESPORTS");
      router.replace("/dashboard");
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  return (
    <AuthShell title="Login" subtitle="Enter the arena with a secure player session.">
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-300">Email</span>
          <Input type="email" placeholder="player@ffxesports.com" {...form.register("email")} />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-300">Password</span>
          <Input type="password" placeholder="Your password" {...form.register("password")} />
        </label>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-300">
            <input type="checkbox" className="h-4 w-4 accent-blue-300" {...form.register("rememberMe")} />
            Remember me
          </label>
          <Link href="/forgot-password" className="font-semibold text-blue-200 hover:text-white">
            Forgot password
          </Link>
        </div>
        <Button className="w-full" disabled={form.formState.isSubmitting}>
          <ShieldCheck size={18} />
          Login
        </Button>
      </form>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <a className="flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#0F172A] text-sm font-semibold transition hover:border-blue-300/40" href={`${apiUrl}/auth/google`}>
          <Mail size={17} />
          Google
        </a>
        <a className="flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-[#0F172A] text-sm font-semibold transition hover:border-pink-400/40" href={`${apiUrl}/auth/discord`}>
          <Disc3 size={17} />
          Discord
        </a>
      </div>
      <p className="mt-6 text-center text-sm text-slate-400">
        New to FFX?{" "}
        <Link href="/register" className="font-bold text-blue-200 hover:text-white">
          Create account
        </Link>
      </p>
    </AuthShell>
  );
}
