"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button, Input } from "@ffx/ui";
import { AuthShell } from "@/components/auth-shell";
import { apiMessage } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";

const schema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(24),
  phone: z.string().optional(),
  referrerCode: z.string().optional(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const registerUser = useAuthStore((state) => state.register);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", username: "", phone: "", referrerCode: "", password: "" }
  });

  async function onSubmit(values: FormValues) {
    try {
      await registerUser({
        email: values.email!,
        username: values.username!,
        password: values.password!,
        phone: values.phone,
        referrerCode: values.referrerCode
      });
      toast.success("Account created. Verify OTP to unlock full trust.");
      router.replace("/verify-otp");
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  return (
    <AuthShell title="Create account" subtitle="Start with a verified player profile, wallet, and tournament identity.">
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-300">Username</span>
            <Input placeholder="neonstriker" {...form.register("username")} />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-300">Phone</span>
            <Input placeholder="+91..." {...form.register("phone")} />
          </label>
        </div>
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-300">Email</span>
          <Input type="email" placeholder="player@ffxesports.com" {...form.register("email")} />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-300">Password</span>
          <Input type="password" placeholder="Minimum 8 characters" {...form.register("password")} />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-300">Referral code</span>
          <Input placeholder="Optional" {...form.register("referrerCode")} />
        </label>
        <Button className="w-full" disabled={form.formState.isSubmitting}>
          <UserPlus size={18} />
          Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        Already registered?{" "}
        <Link href="/login" className="font-bold text-blue-200 hover:text-white">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}
