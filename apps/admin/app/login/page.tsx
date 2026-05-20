"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button, Card, Input } from "@ffx/ui";
import { api, apiMessage } from "@/lib/api";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export default function AdminLoginPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" }
  });

  async function onSubmit(values: z.infer<typeof schema>) {
    try {
      const response = await api.post("/auth/login", values);
      const roles = response.data.data.roles as string[];
      if (!roles.some((role) => ["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT"].includes(role))) {
        toast.error("Admin access required");
        await api.post("/auth/logout");
        return;
      }
      router.replace("/admin");
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020817] admin-grid px-4">
      <Card className="w-full max-w-md p-8 shadow-neon">
        <div className="mb-7">
          <div className="text-sm font-bold uppercase tracking-[0.24em] text-blue-200">FFX ESPORTS</div>
          <h1 className="mt-2 text-3xl font-black">Admin Login</h1>
          <p className="mt-2 text-sm text-slate-400">RBAC protected control tower.</p>
        </div>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-300">Email</span>
            <Input type="email" {...form.register("email")} />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-300">Password</span>
            <Input type="password" {...form.register("password")} />
          </label>
          <Button className="w-full" disabled={form.formState.isSubmitting}>
            <ShieldCheck size={18} />
            Enter admin
          </Button>
        </form>
      </Card>
    </main>
  );
}
