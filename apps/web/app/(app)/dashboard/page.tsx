"use client";

import { useEffect, useState } from "react";
import {
  CircleDollarSign,
  Crosshair,
  Swords,
  Trophy,
} from "lucide-react";

import { Card, Skeleton } from "@/ui";
import { formatMoney } from "@/utils";

import { MetricCard } from "@/components/metric-card";
import { MiniChart } from "@/components/mini-chart";
import { PageHeader } from "@/components/page-header";
import {
  TournamentCard,
  type Tournament,
} from "@/components/tournament-card";

import { api } from "@/lib/api";

type DashboardData = {
  profile?: {
    stats: {
      tournamentsPlayed: number;
      wins: number;
      kills: number;
      kdRatio: string;
    };

    user: {
      wallet?: {
        balance: string;
        winningBalance: string;
        bonusBalance: string;
      };
    };

    achievements: string[];
  };

  tournaments: Tournament[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    tournaments: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/profile"),
      api.get("/tournaments?status=REGISTRATION_OPEN&pageSize=3"),
    ])
      .then(([profile, tournaments]) => {
        setData({
          profile: profile.data.data,
          tournaments: tournaments.data.data,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const wallet = data.profile?.user.wallet;

  return (
    <div className="main-container">

      {/* HEADER */}

      <div className="mb-10">
        <p className="text-sm font-medium tracking-widest text-zinc-500 uppercase">
          Live Ecosystem
        </p>

        <h1 className="mt-3 text-5xl font-bold tracking-tight text-white">
          Dashboard
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Secure tournaments, squads, wallets, and competitive match operations.
        </p>
      </div>

      {/* METRICS */}

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-28 rounded-3xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

          <MetricCard
            icon={Trophy}
            label="Tournaments"
            value={String(
              data.profile?.stats.tournamentsPlayed ?? 0
            )}
            detail="Registered matches"
          />

          <MetricCard
            icon={Swords}
            label="Wins"
            value={String(data.profile?.stats.wins ?? 0)}
            detail="Top placements"
          />

          <MetricCard
            icon={Crosshair}
            label="Kills"
            value={String(data.profile?.stats.kills ?? 0)}
            detail={`KD ${data.profile?.stats.kdRatio ?? "0.00"}`}
          />

          <MetricCard
            icon={CircleDollarSign}
            label="Wallet"
            value={formatMoney(
              Number(wallet?.balance ?? 0) +
                Number(wallet?.winningBalance ?? 0)
            )}
            detail="Cash & winnings"
          />
        </div>
      )}

      {/* CHARTS */}

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_.8fr]">

        {/* EARNINGS */}

        <Card className="premium-card p-7">

          <div className="mb-8 flex items-center justify-between">

            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
                Analytics
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white">
                Earnings Pulse
              </h2>

              <p className="mt-1 text-zinc-400">
                Wallet performance overview
              </p>
            </div>

            <div className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
              Live
            </div>
          </div>

          <MiniChart
            values={[12, 28, 18, 42, 30, 58, 46, 72, 64, 90, 78, 105]}
          />
        </Card>

        {/* ACHIEVEMENTS */}

        <Card className="premium-card p-7">

          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
            Recognition
          </p>

          <h2 className="mt-1 text-2xl font-bold text-white">
            Achievements
          </h2>

          <div className="mt-8 flex flex-wrap gap-3">

            {(data.profile?.achievements ?? []).map(
              (achievement) => (
                <div
                  key={achievement}
                  className="
                    rounded-2xl
                    border
                    border-white/5
                    bg-[#151515]
                    px-4
                    py-3
                    text-sm
                    font-medium
                    text-zinc-200
                  "
                >
                  {achievement}
                </div>
              )
            )}

          </div>
        </Card>
      </div>

      {/* TOURNAMENTS */}

      <div className="mt-12">

        <div className="mb-8">

          <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
            Open Slots
          </p>

          <h2 className="mt-1 text-5xl font-bold tracking-tight text-white">
            Upcoming Tournaments
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {data.tournaments.map((tournament) => (
            <TournamentCard
              key={tournament.id}
              tournament={tournament}
            />
          ))}

        </div>
      </div>
    </div>
  );
}