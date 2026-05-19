"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button, Input } from "@ffx/ui";
import { AuthShell } from "@/components/auth-shell";
import { api, apiMessage } from "@/lib/api";

const schema = z.object({ email: z.string().email() });

export default function ForgotPasswordPage() {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: "" } });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      await api.post("/auth/forgot-password", values);
      toast.success("Reset link sent if the account exists");
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  return (
    <AuthShell title="Recover account" subtitle="Reset your password with a secure email token.">
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-300">Email</span>
          <Input type="email" placeholder="player@ffxesports.com" {...form.register("email")} />
        </label>
        <Button className="w-full" disabled={form.formState.isSubmitting}>
          <KeyRound size={18} />
          Send reset link
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        Back to{" "}
        <Link href="/login" className="font-bold text-cyan-200 hover:text-white">
          login
        </Link>
      </p>
    </AuthShell>
  );
}
