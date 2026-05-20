"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge, Button, Card, Input, Textarea } from "@ffx/ui";
import { formatMoney } from "@ffx/utils";
import { PageHeader } from "@/components/page-header";
import { api, apiMessage } from "@/lib/api";

type Tournament = {
  id: string;
  title: string;
  code: string;
  game: string;
  mode: string;
  status: string;
  entryFee: string;
  prizePool: string;
  maxSlots: number;
  filledSlots: number;
  startsAt: string;
  participants: unknown[];
  matches: { id: string; status: string }[];
};

export default function AdminTournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [title, setTitle] = useState("");
  const [game, setGame] = useState("FREE_FIRE");
  const [mode, setMode] = useState("SQUAD");
  const [entryFee, setEntryFee] = useState(50);
  const [prizePool, setPrizePool] = useState(5000);
  const [maxSlots, setMaxSlots] = useState(48);
  const [startsAt, setStartsAt] = useState("");

  useEffect(() => {
    loadTournaments();
  }, []);

  function loadTournaments() {
    api.get("/admin/tournaments").then((response) => setTournaments(response.data.data));
  }

  async function complete(id: string) {
    try {
      await api.post(`/admin/tournaments/${id}/complete`);
      toast.success("Tournament completed and prizes distributed");
      loadTournaments();
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  async function createTournament() {
    try {
      const start = startsAt ? new Date(startsAt) : new Date(Date.now() + 48 * 60 * 60 * 1000);
      await api.post("/tournaments", {
        title,
        game,
        mode,
        description: `${title} hosted by FFX ESPORTS with verified rooms, proof review, and automated rewards.`,
        rules: "Check in before match start, join the room on time, submit screenshots, and follow fair-play rules.",
        entryFee,
        prizePool,
        maxSlots,
        minTeamSize: mode === "SOLO" ? 1 : mode === "DUO" ? 2 : 4,
        maxTeamSize: mode === "SOLO" ? 1 : mode === "DUO" ? 2 : 4,
        inviteOnly: false,
        status: "REGISTRATION_OPEN",
        registrationStartsAt: new Date().toISOString(),
        registrationEndsAt: new Date(start.getTime() - 60 * 60 * 1000).toISOString(),
        startsAt: start.toISOString(),
        roomReleaseAt: new Date(start.getTime() - 10 * 60 * 1000).toISOString()
      });
      toast.success("Tournament created");
      setTitle("");
      loadTournaments();
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Tournament ops" title="Tournaments" />
      <Card className="mb-6 p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_.55fr_.55fr_.45fr_.45fr_.45fr_.7fr_auto]">
          <Input placeholder="Tournament title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <select className="h-11 rounded-lg border border-white/10 bg-[#020817] px-3 text-sm" value={game} onChange={(event) => setGame(event.target.value)}>
            {["FREE_FIRE", "BGMI", "CODM", "VALORANT", "BATTLE_ROYALE"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select className="h-11 rounded-lg border border-white/10 bg-[#020817] px-3 text-sm" value={mode} onChange={(event) => setMode(event.target.value)}>
            {["SOLO", "DUO", "SQUAD", "CLASH_SQUAD", "BATTLE_ROYALE"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <Input type="number" value={entryFee} onChange={(event) => setEntryFee(Number(event.target.value))} />
          <Input type="number" value={prizePool} onChange={(event) => setPrizePool(Number(event.target.value))} />
          <Input type="number" value={maxSlots} onChange={(event) => setMaxSlots(Number(event.target.value))} />
          <Input type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} />
          <Button onClick={createTournament}>Create</Button>
        </div>
      </Card>
      <div className="grid gap-5">
        {tournaments.map((tournament) => (
          <Card key={tournament.id} className="p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="mb-2 flex flex-wrap gap-2">
                  <Badge tone="blue">{tournament.game.replace("_", " ")}</Badge>
                  <Badge tone="pink">{tournament.mode.replace("_", " ")}</Badge>
                  <Badge tone="green">{tournament.status.replace("_", " ")}</Badge>
                </div>
                <h2 className="text-xl font-black">{tournament.title}</h2>
                <p className="mt-1 text-sm text-slate-400">{tournament.code} / {new Date(tournament.startsAt).toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-right sm:grid-cols-4">
                <Stat label="Prize" value={formatMoney(tournament.prizePool)} />
                <Stat label="Entry" value={formatMoney(tournament.entryFee)} />
                <Stat label="Slots" value={`${tournament.filledSlots}/${tournament.maxSlots}`} />
                <Button variant="secondary" onClick={() => complete(tournament.id)}>Complete</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#0F172A] p-3">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="font-black">{value}</div>
    </div>
  );
}
