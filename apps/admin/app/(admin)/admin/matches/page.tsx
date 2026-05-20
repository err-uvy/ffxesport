"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge, Button, Card, Input } from "@ffx/ui";
import { PageHeader } from "@/components/page-header";
import { api, apiMessage } from "@/lib/api";

type Tournament = {
  id: string;
  title: string;
  matches: { id: string; mapName: string; status: string; roomId?: string; roomPassword?: string; startsAt: string }[];
};

type Result = {
  id: string;
  kills: number;
  placement: number;
  score: number;
  screenshotUrl: string;
  submittedBy: { username: string; email: string };
  match: { tournament: { title: string; game: string } };
};

export default function AdminMatchesPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [roomId, setRoomId] = useState("");
  const [roomPassword, setRoomPassword] = useState("");

  useEffect(() => {
    load();
  }, []);

  function load() {
    Promise.all([api.get("/admin/tournaments"), api.get("/admin/results")]).then(([tournamentRes, resultRes]) => {
      setTournaments(tournamentRes.data.data);
      setResults(resultRes.data.data);
    });
  }

  const matches = useMemo(
    () => tournaments.flatMap((tournament) => tournament.matches.map((match) => ({ ...match, tournamentTitle: tournament.title }))),
    [tournaments]
  );

  async function release(matchId: string) {
    try {
      await api.patch(`/admin/matches/${matchId}/room`, { roomId, roomPassword, status: "ROOM_RELEASED" });
      toast.success("Room released");
      setRoomId("");
      setRoomPassword("");
      load();
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  async function verify(resultId: string, status: "VERIFIED" | "REJECTED") {
    try {
      await api.patch(`/admin/results/${resultId}/verify`, { status });
      toast.success(status === "VERIFIED" ? "Result verified" : "Result rejected");
      load();
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Room control" title="Matches" />
      <Card className="mb-6 p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
          <Input placeholder="Room ID" value={roomId} onChange={(event) => setRoomId(event.target.value)} />
          <Input placeholder="Room password" value={roomPassword} onChange={(event) => setRoomPassword(event.target.value)} />
        </div>
      </Card>
      <div className="grid gap-4">
        {matches.map((match) => (
          <Card key={match.id} className="p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <Badge tone={match.status === "LIVE" ? "green" : "blue"}>{match.status.replace("_", " ")}</Badge>
                <h2 className="mt-2 text-xl font-black">{match.tournamentTitle}</h2>
                <p className="mt-1 text-sm text-slate-400">{match.mapName} / {new Date(match.startsAt).toLocaleString()}</p>
              </div>
              <Button onClick={() => release(match.id)}>Release room</Button>
            </div>
          </Card>
        ))}
      </div>
      <PageHeader eyebrow="Moderation" title="Pending Results" />
      <div className="grid gap-4">
        {results.map((result) => (
          <Card key={result.id} className="p-5">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-xl font-black">{result.match.tournament.title}</h2>
                <p className="mt-1 text-sm text-slate-400">
                  {result.submittedBy.username} / kills {result.kills} / placement {result.placement} / score {result.score}
                </p>
                <a className="mt-2 inline-block text-sm font-bold text-blue-200" href={result.screenshotUrl} target="_blank" rel="noreferrer">
                  Open screenshot
                </a>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => verify(result.id, "VERIFIED")}>Verify</Button>
                <Button variant="danger" onClick={() => verify(result.id, "REJECTED")}>Reject</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
