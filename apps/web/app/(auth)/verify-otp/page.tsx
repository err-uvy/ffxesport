"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button, Input } from "@ffx/ui";
import { AuthShell } from "@/components/auth-shell";
import { api, apiMessage } from "@/lib/api";

const schema = z.object({
  email: z.string().email(),
  code: z.string().length(6)
});

export default function VerifyOtpPage() {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { email: "", code: "" } });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      await api.post("/auth/verify-otp", { ...values, purpose: "EMAIL_VERIFY" });
      toast.success("Email verified");
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  async function resend() {
    const email = form.getValues("email");
    if (!email) return toast.error("Enter your email first");
    try {
      await api.post("/auth/send-otp", { email, purpose: "EMAIL_VERIFY" });
      toast.success("OTP sent");
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  return (
    <AuthShell title="Verify OTP" subtitle="Confirm account ownership to keep tournaments clean and trusted.">
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-300">Email</span>
          <Input type="email" placeholder="player@ffxesports.com" {...form.register("email")} />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-slate-300">OTP</span>
          <Input inputMode="numeric" placeholder="123456" {...form.register("code")} />
        </label>
        <Button className="w-full" disabled={form.formState.isSubmitting}>
          <BadgeCheck size={18} />
          Verify
        </Button>
      </form>
      <Button variant="secondary" className="mt-3 w-full" onClick={resend}>
        <Send size={18} />
        Send OTP
      </Button>
      <p className="mt-6 text-center text-sm text-slate-400">
        Continue to{" "}
        <Link href="/dashboard" className="font-bold text-blue-200 hover:text-white">
          dashboard
        </Link>
      </p>
    </AuthShell>
  );
}
