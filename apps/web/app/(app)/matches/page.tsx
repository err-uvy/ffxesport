"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Clock, ImageUp, Swords } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button, Card, Input } from "@ffx/ui";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { api, apiMessage } from "@/lib/api";

type Match = {
  id: string;
  mapName: string;
  roomId?: string | null;
  roomPassword?: string | null;
  startsAt: string;
  status: string;
  instructions: string;
  tournament: { title: string; game: string };
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selected, setSelected] = useState<Match | null>(null);
  const [kills, setKills] = useState(0);
  const [placement, setPlacement] = useState(1);
  const [screenshot, setScreenshot] = useState<File | null>(null);

  useEffect(() => {
    loadMatches();
  }, []);

  function loadMatches() {
    api.get("/matches").then((response) => setMatches(response.data.data));
  }

  async function submitResult() {
    if (!selected || !screenshot) return toast.error("Select match and screenshot");
    const body = new FormData();
    body.append("kills", String(kills));
    body.append("placement", String(placement));
    body.append("screenshot", screenshot);
    try {
      await api.post(`/matches/${selected.id}/submit-result`, body, { headers: { "content-type": "multipart/form-data" } });
      toast.success("Result submitted for verification");
      setSelected(null);
      setScreenshot(null);
      loadMatches();
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Match ops" title="Matches" />
      {matches.length ? (
        <div className="grid gap-5 xl:grid-cols-[1fr_.75fr]">
          <div className="space-y-4">
            {matches.map((match) => (
              <Card key={match.id} className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <Badge tone="cyan">{match.tournament.game.replace("_", " ")}</Badge>
                      <Badge tone={match.status === "LIVE" ? "green" : "purple"}>{match.status.replace("_", " ")}</Badge>
                    </div>
                    <h2 className="text-xl font-black">{match.tournament.title}</h2>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                      <Clock size={16} />
                      {new Date(match.startsAt).toLocaleString()} / {match.mapName}
                    </p>
                  </div>
                  <Button onClick={() => setSelected(match)}>Submit result</Button>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Room label="Room ID" value={match.roomId ?? "Locked"} />
                  <Room label="Password" value={match.roomPassword ?? "Locked"} />
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">{match.instructions}</p>
              </Card>
            ))}
          </div>
          <Card className="p-5">
            <h2 className="text-xl font-black">Proof Upload</h2>
            <p className="mt-2 text-sm text-slate-400">{selected ? selected.tournament.title : "Select a match"}</p>
            <div className="mt-4 space-y-3">
              <Input type="number" min={0} value={kills} onChange={(event) => setKills(Number(event.target.value))} />
              <Input type="number" min={1} value={placement} onChange={(event) => setPlacement(Number(event.target.value))} />
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-cyan-300/30 bg-cyan-300/8 p-5 text-sm font-bold text-cyan-100">
                <ImageUp size={18} />
                {screenshot?.name ?? "Upload screenshot"}
                <input type="file" className="hidden" accept="image/*" onChange={(event: ChangeEvent<HTMLInputElement>) => setScreenshot(event.target.files?.[0] ?? null)} />
              </label>
              <Button className="w-full" onClick={submitResult}>
                Submit proof
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <EmptyState icon={Swords} title="No matches yet" body="Join a tournament to see room details, countdowns, and proof submission." />
      )}
    </div>
  );
}

function Room({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.05] p-3">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-1 font-black text-white">{value}</div>
    </div>
  );
}
