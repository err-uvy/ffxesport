"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Clock, Trophy, Users } from "lucide-react";
import { Badge, Button, Card, Progress, Skeleton } from "@ffx/ui";
import { formatMoney } from "@ffx/utils";
import { PageHeader } from "@/components/page-header";
import { api, apiMessage } from "@/lib/api";
import { toast } from "sonner";

type Detail = {
  id: string;
  title: string;
  game: string;
  mode: string;
  description: string;
  rules: string;
  entryFee: string;
  prizePool: string;
  maxSlots: number;
  filledSlots: number;
  startsAt: string;
  status: string;
  participants: { id: string; slotNumber: number; user?: { username: string }; team?: { name: string; tag: string } }[];
  prizeDistributions: { rank: number; amount: string }[];
  matches: { id: string; mapName: string; startsAt: string; status: string }[];
};

export default function TournamentDetailPage() {
  const params = useParams<{ slug: string }>();
  const [tournament, setTournament] = useState<Detail | null>(null);

  useEffect(() => {
    api.get(`/tournaments/${params.slug}`).then((response) => setTournament(response.data.data));
  }, [params.slug]);

  async function join() {
    if (!tournament) return;
    try {
      await api.post(`/tournaments/${tournament.id}/join`, {});
      toast.success("Joined tournament");
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  if (!tournament) return <Skeleton className="h-[70vh]" />;
  const slots = Math.round((tournament.filledSlots / tournament.maxSlots) * 100);

  return (
    <div>
      <PageHeader eyebrow={tournament.game.replace("_", " ")} title={tournament.title}>
        <Button onClick={join}>Join tournament</Button>
      </PageHeader>
      <section className="overflow-hidden rounded-xl border border-white/5 bg-[linear-gradient(135deg,rgba(0,229,255,.22),rgba(124,58,237,.16),rgba(255,0,128,.18)),url('https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center p-6 shadow-neon sm:p-10">
        <div className="max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <Badge tone="blue">{tournament.mode.replace("_", " ")}</Badge>
            <Badge tone="green">{tournament.status.replace("_", " ")}</Badge>
          </div>
          <p className="mt-5 text-lg leading-8 text-slate-100">{tournament.description}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Stat icon={Trophy} label="Prize" value={formatMoney(tournament.prizePool)} />
            <Stat icon={Users} label="Slots" value={`${tournament.filledSlots}/${tournament.maxSlots}`} />
            <Stat icon={Clock} label="Starts" value={new Date(tournament.startsAt).toLocaleString()} />
          </div>
        </div>
      </section>
      <div className="mt-6 grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
        <Card className="p-5">
          <h2 className="text-xl font-black">Prize Distribution</h2>
          <div className="mt-4 space-y-3">
            {tournament.prizeDistributions.map((prize) => (
              <div key={prize.rank} className="flex items-center justify-between rounded-lg border border-white/10 bg-[#0F172A] p-3">
                <span className="font-bold">Rank {prize.rank}</span>
                <span className="text-blue-100">{formatMoney(prize.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h2 className="text-xl font-black">Slots</h2>
          <Progress value={slots} className="mt-4" />
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {tournament.participants.map((participant) => (
              <div key={participant.id} className="rounded-lg border border-white/10 bg-[#0F172A] p-3 text-sm">
                Slot {participant.slotNumber}: {participant.team?.tag ?? participant.user?.username ?? "Registered"}
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card className="mt-6 p-5">
        <h2 className="text-xl font-black">Rules</h2>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">{tournament.rules}</p>
      </Card>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Trophy; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/15 bg-black/25 p-4">
      <Icon className="mb-3 text-blue-100" size={20} />
      <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-1 text-lg font-black text-white">{value}</div>
    </div>
  );
}
