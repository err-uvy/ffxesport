"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, BadgeDollarSign, RadioTower, Trophy, Users, Wallet } from "lucide-react";
import { Card } from "@ffx/ui";
import { formatMoney } from "@ffx/utils";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { api } from "@/lib/api";

type Summary = {
  users: number;
  activeTournaments: number;
  liveMatches: number;
  pendingWithdrawals: number;
  pendingResults: number;
  depositVolume: string;
  fraudHigh: number;
};

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    api.get("/admin/summary").then((response) => setSummary(response.data.data));
  }, []);

  return (
    <div>
      <PageHeader eyebrow="Control tower" title="Admin Dashboard" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Users} label="Users" value={String(summary?.users ?? 0)} />
        <MetricCard icon={Trophy} label="Active Tournaments" value={String(summary?.activeTournaments ?? 0)} />
        <MetricCard icon={RadioTower} label="Live Matches" value={String(summary?.liveMatches ?? 0)} />
        <MetricCard icon={Wallet} label="Withdrawals" value={String(summary?.pendingWithdrawals ?? 0)} />
        <MetricCard icon={BadgeDollarSign} label="Deposit Volume" value={formatMoney(summary?.depositVolume ?? 0)} />
        <MetricCard icon={AlertTriangle} label="Fraud Alerts" value={String(summary?.fraudHigh ?? 0)} />
      </div>
      <Card className="mt-6 p-5">
        <h2 className="text-xl font-black">Operations Health</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Health label="Pending results" value={summary?.pendingResults ?? 0} />
          <Health label="Payment webhooks" value="Razorpay + Cashfree" />
          <Health label="Admin policy" value="RBAC enforced" />
        </div>
      </Card>
    </div>
  );
}

function Health({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-2 font-black text-white">{value}</div>
    </div>
  );
}
