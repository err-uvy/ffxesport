"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button, Input } from "@ffx/ui";
import { AuthShell } from "@/components/auth-shell";
import { api, apiMessage } from "@/lib/api";

const schema = z.object({
  password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/)
});

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { password: "" } });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      await api.post("/auth/reset-password", { token, password: values.password });
      toast.success("Password reset complete");
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  return (
    <AuthShell title="Reset password" subtitle="Set a fresh password and revoke older sessions.">
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-300">New password</span>
          <Input type="password" placeholder="Minimum 8 characters" {...form.register("password")} />
        </label>
        <Button className="w-full" disabled={form.formState.isSubmitting || !token}>
          <ShieldCheck size={18} />
          Reset password
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">
        Back to{" "}
        <Link href="/login" className="font-bold text-blue-200 hover:text-white">
          login
        </Link>
      </p>
    </AuthShell>
  );
}
