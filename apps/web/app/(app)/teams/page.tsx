"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { Button, Card, Input, Badge } from "@ffx/ui";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { api, apiMessage } from "@/lib/api";

type Team = {
  id: string;
  name: string;
  tag: string;
  game: string;
  inviteCode: string;
  members: { id: string; role: string; status: string; user: { username: string } }[];
};

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [game, setGame] = useState("FREE_FIRE");
  const [invite, setInvite] = useState("");

  useEffect(() => {
    loadTeams();
  }, []);

  function loadTeams() {
    api.get("/teams").then((response) => setTeams(response.data.data));
  }

  async function createTeam() {
    try {
      await api.post("/teams", { name, tag, game });
      toast.success("Team created");
      setName("");
      setTag("");
      loadTeams();
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  async function inviteUser(teamId: string) {
    try {
      await api.post(`/teams/${teamId}/invite`, { usernameOrEmail: invite });
      toast.success("Invite sent");
      setInvite("");
      loadTeams();
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Squads" title="Teams" />
      <Card className="mb-6 p-5">
        <div className="grid gap-3 md:grid-cols-[1fr_.5fr_.5fr_auto]">
          <Input placeholder="Team name" value={name} onChange={(event: any) => setName(event.target.value)} />
          <Input placeholder="TAG" value={tag} onChange={(event: any) => setTag(event.target.value)} />
          <select className="h-11 rounded-lg border border-white/10 bg-[#020817] px-3 text-sm" value={game} onChange={(event: any) => setGame(event.target.value)}>
            {["FREE_FIRE", "BGMI", "CODM", "VALORANT"].map((item) => (
              <option key={item} value={item}>{item.replace("_", " ")}</option>
            ))}
          </select>
          <Button onClick={createTeam}>Create</Button>
        </div>
      </Card>
      {teams.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {teams.map((team) => (
            <Card key={team.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black">{team.name}</h2>
                  <p className="text-sm text-slate-400">{team.tag} / {team.game.replace("_", " ")}</p>
                </div>
                <Badge tone="blue">{team.inviteCode}</Badge>
              </div>
              <div className="mt-4 space-y-2">
                {team.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-[#0F172A] p-3 text-sm">
                    <span>{member.user.username}</span>
                    <span className="text-blue-100">{member.role} / {member.status}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Input placeholder="username or email" value={invite} onChange={(event: any) => setInvite(event.target.value)} />
                <Button variant="secondary" onClick={() => inviteUser(team.id)}>Invite</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState icon={Users} title="No teams yet" body="Create a squad for duo, squad, and clash tournaments." />
      )}
    </div>
  );
}
