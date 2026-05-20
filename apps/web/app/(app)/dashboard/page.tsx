"use client";

import { useEffect, useState } from "react";
import { CircleDollarSign, Crosshair, Swords, Trophy } from "lucide-react";
import { Card, Skeleton } from "@ffx/ui";
import { formatMoney } from "@ffx/utils";
import { MetricCard } from "@/components/metric-card";
import { MiniChart } from "@/components/mini-chart";
import { PageHeader } from "@/components/page-header";
import { TournamentCard, type Tournament } from "@/components/tournament-card";
import { api } from "@/lib/api";

type DashboardData = {
  profile?: {
    stats: { tournamentsPlayed: number; wins: number; kills: number; kdRatio: string };
    user: { wallet?: { balance: string; winningBalance: string; bonusBalance: string } };
    achievements: string[];
  };
  tournaments: Tournament[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({ tournaments: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/profile"), api.get("/tournaments?status=REGISTRATION_OPEN&pageSize=3")])
      .then(([profile, tournaments]) => {
        setData({ profile: profile.data.data, tournaments: tournaments.data.data });
      })
      .finally(() => setLoading(false));
  }, []);

  const wallet = data.profile?.user.wallet;

  return (
    <div>
      <PageHeader eyebrow="Command center" title="Dashboard" />
      {loading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={Trophy} label="Tournaments" value={String(data.profile?.stats.tournamentsPlayed ?? 0)} detail="Registered match history" />
          <MetricCard icon={Swords} label="Wins" value={String(data.profile?.stats.wins ?? 0)} detail="Verified top placements" />
          <MetricCard icon={Crosshair} label="Kills" value={String(data.profile?.stats.kills ?? 0)} detail={`KD ${data.profile?.stats.kdRatio ?? "0.00"}`} />
          <MetricCard icon={CircleDollarSign} label="Wallet" value={formatMoney(Number(wallet?.balance ?? 0) + Number(wallet?.winningBalance ?? 0))} detail="Cash plus winnings" />
        </div>
      )}

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">Earnings Pulse</h2>
              <p className="text-sm text-slate-400">Wallet activity trend</p>
            </div>
            <span className="rounded-md border border-blue-300/20 bg-blue-300/10 px-2 py-1 text-xs font-bold text-blue-100">Live</span>
          </div>
          <MiniChart values={[12, 28, 18, 42, 30, 58, 46, 72, 64, 90, 78, 105]} />
        </Card>
        <Card className="p-5">
          <h2 className="text-xl font-black text-white">Achievements</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {(data.profile?.achievements ?? []).map((achievement) => (
              <span key={achievement} className="rounded-md border border-pink-400/20 bg-pink-500/10 px-3 py-2 text-sm font-semibold text-pink-100">
                {achievement}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <PageHeader eyebrow="Open slots" title="Upcoming Tournaments" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </div>
      </div>
    </div>
  );
}
