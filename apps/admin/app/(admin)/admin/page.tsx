"use client";

import {
  useEffect,
  useState
} from "react";

import {
  AlertTriangle,
  BadgeDollarSign,
  RadioTower,
  Trophy,
  Users,
  Wallet,
  Activity,
  ShieldCheck,
  Siren,
  TrendingUp
} from "lucide-react";

import {
  Card
} from "@/ui";

import {
  formatMoney
} from "@/utils";

import {
  MetricCard
} from "@/components/metric-card";

import {
  PageHeader
} from "@/components/page-header";

import {
  api
} from "@/lib/api";

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

  const [summary, setSummary] =
    useState<Summary | null>(
      null
    );

  useEffect(() => {

    api
      .get("/admin/summary")

      .then((response) =>
        setSummary(
          response.data.data
        )
      );

  }, []);

  return (

    <div>

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <PageHeader
        eyebrow="Mission Control"
        title="Admin Dashboard"
      />

      {/* ===================================== */}
      {/* STATS */}
      {/* ===================================== */}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          icon={Users}
          label="Registered Users"
          value={String(
            summary?.users ?? 0
          )}
        />

        <MetricCard
          icon={Trophy}
          label="Active Tournaments"
          value={String(
            summary?.activeTournaments ??
              0
          )}
        />

        <MetricCard
          icon={RadioTower}
          label="Live Matches"
          value={String(
            summary?.liveMatches ??
              0
          )}
        />

        <MetricCard
          icon={Wallet}
          label="Pending Withdrawals"
          value={String(
            summary?.pendingWithdrawals ??
              0
          )}
        />

        <MetricCard
          icon={BadgeDollarSign}
          label="Deposit Volume"
          value={formatMoney(
            summary?.depositVolume ??
              0
          )}
        />

        <MetricCard
          icon={AlertTriangle}
          label="Fraud Alerts"
          value={String(
            summary?.fraudHigh ??
              0
          )}
        />

        <MetricCard
          icon={TrendingUp}
          label="Pending Results"
          value={String(
            summary?.pendingResults ??
              0
          )}
        />

        <MetricCard
          icon={Activity}
          label="Platform Status"
          value="ONLINE"
        />
      </div>

      {/* ===================================== */}
      {/* MAIN GRID */}
      {/* ===================================== */}

      <div className="mt-4 grid gap-5 xl:grid-cols-[1.15fr_.85fr]">

        {/* ===================================== */}
        {/* OPERATIONS HEALTH */}
        {/* ===================================== */}

        <Card
          className="
          relative

          overflow-hidden

          border-white/10

          bg-[#081120]/90

          p-6

          backdrop-blur-2xl
        "
        >

          {/* Glow */}

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,229,255,.08),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,0,128,.06),transparent_28%)]" />

          <div className="relative z-10">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <div className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200">
                  Infrastructure
                </div>

                <h2 className="mt-1 text-2xl font-black text-white">
                  Operations Health
                </h2>
              </div>

              <div
                className="
                flex
                items-center
                gap-2

                rounded-full

                border
                border-emerald-400/20

                bg-emerald-500/[0.08]

                px-4
                py-2

                text-sm
                font-bold
                text-emerald-100
              "
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

                LIVE
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">

              <Health
                icon={TrendingUp}
                label="Pending Results"
                value={
                  summary?.pendingResults ??
                  0
                }

                tone="cyan"
              />

              <Health
                icon={Wallet}
                label="Payment Webhooks"
                value="Razorpay + Cashfree"

                tone="pink"
              />

              <Health
                icon={ShieldCheck}
                label="Admin Security"
                value="RBAC Enforced"

                tone="green"
              />
            </div>

            {/* Progress */}

            <div className="mt-8">

              <div className="mb-3 flex items-center justify-between">

                <span className="text-sm font-semibold text-slate-300">
                  System Stability
                </span>

                <span className="text-sm font-black text-cyan-200">
                  98.7%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-white/10">

                <div
                  className="
                  h-full
                  w-[98%]

                  rounded-full

                  bg-[linear-gradient(90deg,#00E5FF,#7C3AED,#FF0080)]

                  shadow-[0_0_22px_rgba(0,229,255,.35)]
                "
                />
              </div>
            </div>
          </div>
        </Card>

        {/* ===================================== */}
        {/* SECURITY PANEL */}
        {/* ===================================== */}

        <Card
          className="
          relative

          overflow-hidden

          border-white/10

          bg-[#081120]/90

          p-6

          backdrop-blur-2xl
        "
        >

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,128,.08),transparent_30%)]" />

          <div className="relative z-10">

            <div className="flex items-center gap-3">

              <div
                className="
                flex
                h-14
                w-14
                items-center
                justify-center

                rounded-2xl

                bg-[linear-gradient(135deg,#00E5FF,#7C3AED,#FF0080)]

                text-white

                shadow-[0_0_30px_rgba(255,0,128,.22)]
              "
              >
                <Siren size={24} />
              </div>

              <div>

                <div className="text-xs font-bold uppercase tracking-[0.24em] text-pink-200">
                  Threat Monitor
                </div>

                <h2 className="mt-1 text-2xl font-black text-white">
                  Security Pulse
                </h2>
              </div>
            </div>

            <div className="mt-8 space-y-4">

              <SecurityItem
                label="Fraud Detection"
                status={
                  summary?.fraudHigh
                    ? "Warning"
                    : "Stable"
                }
              />

              <SecurityItem
                label="Anti Cheat Engine"
                status="Active"
              />

              <SecurityItem
                label="Wallet Integrity"
                status="Protected"
              />

              <SecurityItem
                label="Live Match Sync"
                status="Connected"
              />
            </div>

            {/* Warning */}

            <div
              className="
              mt-7

              rounded-2xl

              border
              border-pink-400/15

              bg-pink-500/[0.06]

              p-4
            "
            >

              <div className="flex items-start gap-3">

                <AlertTriangle
                  size={18}

                  className="mt-0.5 text-pink-300"
                />

                <div>

                  <div className="font-bold text-pink-100">
                    Real-time monitoring enabled
                  </div>

                  <div className="mt-1 text-sm leading-6 text-pink-100/70">
                    Fraud scans, payout reviews,
                    and tournament integrity
                    systems are continuously
                    tracking player activity.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ===================================== */
/* HEALTH ITEM */
/* ===================================== */

function Health({
  icon: Icon,
  label,
  value,
  tone
}: {
  icon: any;

  label: string;

  value: string | number;

  tone: "cyan" | "pink" | "green";
}) {

  const tones = {

    cyan:
      "border-cyan-400/15 bg-cyan-400/[0.05] text-cyan-100",

    pink:
      "border-pink-400/15 bg-pink-500/[0.05] text-pink-100",

    green:
      "border-emerald-400/15 bg-emerald-500/[0.05] text-emerald-100"
  };

  return (

    <div
      className={`
        rounded-2xl
        border
        p-4

        ${tones[tone]}
      `}
    >

      <div className="flex items-center justify-between">

        <div>

          <div className="text-sm opacity-80">
            {label}
          </div>

          <div className="mt-1 text-lg font-black">
            {value}
          </div>
        </div>

        <div
          className="
          flex
          h-12
          w-12
          items-center
          justify-center

          rounded-xl

          bg-white/10
        "
        >
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

/* ===================================== */
/* SECURITY ITEM */
/* ===================================== */

function SecurityItem({
  label,
  status
}: {
  label: string;

  status: string;
}) {

  return (

    <div
      className="
      flex
      items-center
      justify-between

      rounded-2xl

      border
      border-white/8

      bg-white/[0.03]

      px-4
      py-4

      transition-all

      hover:border-cyan-400/20
    "
    >

      <div className="text-sm font-semibold text-slate-300">
        {label}
      </div>

      <div
        className="
        flex
        items-center
        gap-2

        rounded-full

        border
        border-emerald-400/20

        bg-emerald-500/[0.08]

        px-3
        py-1.5

        text-xs
        font-bold
        text-emerald-100
      "
      >

        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

        {status}
      </div>
    </div>
  );
}