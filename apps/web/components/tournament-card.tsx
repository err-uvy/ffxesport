import Link from "next/link";
import { Clock, Gamepad2, Trophy, Users } from "lucide-react";
import { Badge, Button, Card, Progress } from "@ffx/ui";
import { formatMoney } from "@ffx/utils";

export type Tournament = {
  id: string;
  title: string;
  slug: string;
  game: string;
  mode: string;
  entryFee: string | number;
  prizePool: string | number;
  maxSlots: number;
  filledSlots: number;
  startsAt: string;
  status: string;
  bannerUrl?: string | null;
};

export function TournamentCard({ tournament, onJoin }: { tournament: Tournament; onJoin?: (id: string) => void }) {
  const slots = Math.round((tournament.filledSlots / tournament.maxSlots) * 100);
  return (
    <Card className="overflow-hidden">
      <div className="h-36 bg-[linear-gradient(135deg,rgba(0,229,255,.28),rgba(124,58,237,.24),rgba(255,0,128,.22)),url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80')] bg-cover bg-center" />
      <div className="p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge tone="blue">{tournament.game.replace("_", " ")}</Badge>
          <Badge tone="pink">{tournament.mode.replace("_", " ")}</Badge>
          <Badge tone="green">{tournament.status.replace("_", " ")}</Badge>
        </div>
        <h3 className="text-xl font-black text-white">{tournament.title}</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
          <span className="flex items-center gap-2">
            <Trophy size={16} className="text-blue-200" />
            {formatMoney(tournament.prizePool)}
          </span>
          <span className="flex items-center gap-2">
            <Gamepad2 size={16} className="text-pink-200" />
            {Number(tournament.entryFee) ? formatMoney(tournament.entryFee) : "Free"}
          </span>
          <span className="flex items-center gap-2">
            <Users size={16} className="text-violet-200" />
            {tournament.filledSlots}/{tournament.maxSlots}
          </span>
          <span className="flex items-center gap-2">
            <Clock size={16} className="text-blue-200" />
            {new Date(tournament.startsAt).toLocaleDateString()}
          </span>
        </div>
        <Progress value={slots} className="mt-4" />
        <div className="mt-5 flex gap-2">
          <Button className="flex-1" onClick={() => onJoin?.(tournament.id)}>
            Join
          </Button>
          <Link
            href={`/tournaments/${tournament.slug}`}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-blue-300/25 bg-white/8 px-4 text-sm font-semibold text-white transition hover:border-blue-300/60 hover:bg-white/12"
          >
            View
          </Link>
        </div>
      </div>
    </Card>
  );
}
