"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button, Skeleton } from "@ffx/ui";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { TournamentCard, type Tournament } from "@/components/tournament-card";
import { api, apiMessage } from "@/lib/api";

type Team = { id: string; name: string; game: string };

export default function TournamentsPage() {
  const [game, setGame] = useState("ALL");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const filtered = useMemo(() => (game === "ALL" ? tournaments : tournaments.filter((item) => item.game === game)), [game, tournaments]);

  useEffect(() => {
    Promise.all([api.get("/tournaments?pageSize=50"), api.get("/teams")])
      .then(([tournamentRes, teamRes]) => {
        setTournaments(tournamentRes.data.data);
        setTeams(teamRes.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  async function joinTournament(tournament: Tournament & { maxTeamSize?: number }) {
    try {
      const team = Number(tournament.maxTeamSize ?? 1) > 1 ? teams.find((item) => item.game === tournament.game) : undefined;
      await api.post(`/tournaments/${tournament.id}/join`, { teamId: team?.id });
      toast.success("Joined tournament");
      setTournaments((items) => items.map((item) => (item.id === tournament.id ? { ...item, filledSlots: item.filledSlots + 1 } : item)));
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Arena browser" title="Tournaments">
        <div className="flex flex-wrap gap-2">
          {["ALL", "FREE_FIRE", "BGMI", "CODM", "VALORANT"].map((item) => (
            <Button key={item} variant={game === item ? "primary" : "secondary"} onClick={() => setGame(item)}>
              <Filter size={16} />
              {item.replace("_", " ")}
            </Button>
          ))}
        </div>
      </PageHeader>
      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-96" />
          ))}
        </div>
      ) : filtered.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} onJoin={() => joinTournament(tournament)} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Trophy} title="No tournaments found" body="Your filters have no active tournament slots right now." />
      )}
    </div>
  );
}
