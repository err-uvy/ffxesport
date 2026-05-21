"use client";

import { useEffect, useState } from "react";

import {
  Crown,
  Shield,
  Swords,
  Users,
  UserPlus,
  Gamepad2
} from "lucide-react";

import { toast } from "sonner";

import {
  Badge,
  Button,
  Card,
  Input
} from "@ffx/ui";

import { EmptyState } from "@/components/empty-state";
import { api, apiMessage } from "@/lib/api";

type Team = {
  id: string;

  name: string;

  tag: string;

  game: string;

  inviteCode: string;

  members: {
    id: string;

    role: string;

    status: string;

    user: {
      username: string;
    };
  }[];
};

export default function TeamsPage() {

  const [teams, setTeams] =
    useState<Team[]>([]);

  const [name, setName] =
    useState("");

  const [tag, setTag] =
    useState("");

  const [game, setGame] =
    useState("FREE_FIRE");

  const [invite, setInvite] =
    useState("");

  useEffect(() => {
    loadTeams();
  }, []);

  function loadTeams() {

    api
      .get("/teams")
      .then((response) =>
        setTeams(response.data.data)
      );
  }

  async function createTeam() {

    try {

      await api.post("/teams", {
        name,
        tag,
        game
      });

      toast.success(
        "Squad created successfully"
      );

      setName("");
      setTag("");

      loadTeams();

    } catch (error) {

      toast.error(apiMessage(error));
    }
  }

  async function inviteUser(
    teamId: string
  ) {

    try {

      await api.post(
        `/teams/${teamId}/invite`,
        {
          usernameOrEmail: invite
        }
      );

      toast.success(
        "Invitation sent"
      );

      setInvite("");

      loadTeams();

    } catch (error) {

      toast.error(apiMessage(error));
    }
  }

  return (
    <div className="main-container">

      {/* HEADER */}

      <div className="mb-10">

        <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
          FFX Squad Hub
        </p>

        <h1 className="mt-3 text-5xl font-bold tracking-tight text-white">
          Teams
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Build elite rosters, invite players,
          and dominate tournaments together.
        </p>
      </div>

      {/* CREATE TEAM */}

      <Card
        className="
          premium-card
          mb-8
          border
          border-white/5
          bg-[#101010]
          p-6
        "
      >

        <div className="mb-6 flex items-center gap-4">

          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-blue-500/10
              text-blue-400
            "
          >
            <Users size={26} />
          </div>

          <div>

            <h2 className="text-2xl font-bold text-white">
              Create Squad
            </h2>

            <p className="mt-1 text-sm text-zinc-400">
              Launch your competitive team
            </p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_.5fr_.55fr_auto]">

          <Input
            placeholder="Team name"
            value={name}
            onChange={(event: any) =>
              setName(
                event.target.value
              )
            }
            className="
              h-12
              border-white/10
              bg-[#181818]
            "
          />

          <Input
            placeholder="Clan tag"
            value={tag}
            onChange={(event: any) =>
              setTag(
                event.target.value
              )
            }
            className="
              h-12
              border-white/10
              bg-[#181818]
            "
          />

          <select
            className="
              h-12
              rounded-2xl
              border
              border-white/10
              bg-[#181818]
              px-4
              text-sm
              text-white
              outline-none
            "
            value={game}
            onChange={(event: any) =>
              setGame(
                event.target.value
              )
            }
          >

            {[
              "FREE_FIRE",
              "BGMI",
              "CODM",
              "VALORANT"
            ].map((item) => (

              <option
                key={item}
                value={item}
              >
                {item.replace("_", " ")}
              </option>
            ))}
          </select>

          <Button
            onClick={createTeam}
            className="
              h-12
              rounded-2xl
              bg-blue-600
              px-8
              font-semibold
              hover:bg-blue-700
            "
          >
            Create
          </Button>
        </div>
      </Card>

      {/* TEAM LIST */}

      {teams.length ? (

        <div className="grid gap-6 xl:grid-cols-2">

          {teams.map((team) => (

            <Card
              key={team.id}
              className="
                premium-card
                border
                border-white/5
                bg-[#101010]
                p-6
                transition-all
                duration-200
                hover:border-blue-500/20
              "
            >

              {/* TOP */}

              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">

                <div className="flex gap-4">

                  {/* LOGO */}

                  <div
                    className="
                      flex
                      h-16
                      w-16
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-blue-500/10
                      text-blue-400
                    "
                  >
                    <Gamepad2 size={28} />
                  </div>

                  {/* TEXT */}

                  <div>

                    <div className="flex items-center gap-3">

                      <h2 className="text-2xl font-bold text-white">
                        {team.name}
                      </h2>

                      <div
                        className="
                          rounded-full
                          border
                          border-blue-500/20
                          bg-blue-500/10
                          px-3
                          py-1
                          text-xs
                          font-bold
                          uppercase
                          tracking-[0.15em]
                          text-blue-300
                        "
                      >
                        {team.tag}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-3">

                      <div
                        className="
                          rounded-full
                          border
                          border-white/10
                          bg-[#181818]
                          px-3
                          py-1.5
                          text-xs
                          font-semibold
                          uppercase
                          tracking-[0.15em]
                          text-zinc-400
                        "
                      >
                        {team.game.replace(
                          "_",
                          " "
                        )}
                      </div>

                      <div
                        className="
                          rounded-full
                          border
                          border-green-500/20
                          bg-green-500/10
                          px-3
                          py-1.5
                          text-xs
                          font-semibold
                          uppercase
                          tracking-[0.15em]
                          text-green-300
                        "
                      >
                        {team.members.length} Members
                      </div>
                    </div>
                  </div>
                </div>

                {/* INVITE CODE */}

                <Badge tone="blue">
                  {team.inviteCode}
                </Badge>
              </div>

              {/* MEMBERS */}

              <div className="mt-7">

                <div className="mb-4 flex items-center gap-2">

                  <Swords
                    size={18}
                    className="text-blue-400"
                  />

                  <h3 className="font-bold text-white">
                    Squad Members
                  </h3>
                </div>

                <div className="space-y-3">

                  {team.members.map(
                    (member) => (

                      <div
                        key={member.id}
                        className="
                          flex
                          items-center
                          justify-between
                          rounded-3xl
                          border
                          border-white/5
                          bg-[#181818]
                          px-4
                          py-4
                        "
                      >

                        <div className="flex items-center gap-3">

                          <div
                            className="
                              flex
                              h-11
                              w-11
                              items-center
                              justify-center
                              rounded-xl
                              bg-blue-500/10
                              text-blue-400
                            "
                          >

                            {member.role ===
                            "CAPTAIN" ? (

                              <Crown size={18} />

                            ) : (

                              <Shield size={18} />
                            )}
                          </div>

                          <div>

                            <div className="font-semibold text-white">
                              {
                                member.user
                                  .username
                              }
                            </div>

                            <div className="mt-1 text-xs uppercase tracking-[0.15em] text-zinc-500">
                              {member.role}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`
                            rounded-full
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.15em]

                            ${
                              member.status ===
                              "ACTIVE"
                                ? "bg-green-500/10 text-green-300 border border-green-500/20"
                                : "bg-orange-500/10 text-orange-300 border border-orange-500/20"
                            }
                          `}
                        >
                          {member.status}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* INVITE */}

              <div className="mt-7">

                <div className="mb-4 flex items-center gap-2">

                  <UserPlus
                    size={18}
                    className="text-blue-400"
                  />

                  <h3 className="font-bold text-white">
                    Invite Player
                  </h3>
                </div>

                <div className="flex flex-col gap-3 xl:flex-row">

                  <Input
                    placeholder="username or email"
                    value={invite}
                    onChange={(event: any) =>
                      setInvite(
                        event.target.value
                      )
                    }
                    className="
                      h-12
                      border-white/10
                      bg-[#181818]
                    "
                  />

                  <Button
                    variant="secondary"
                    onClick={() =>
                      inviteUser(team.id)
                    }
                    className="
                      h-12
                      rounded-2xl
                      border-white/10
                      bg-[#181818]
                      hover:bg-[#202020]
                    "
                  >
                    Invite
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

      ) : (

        <EmptyState
          icon={Users}
          title="No teams yet"
          body="Create your first competitive squad and dominate upcoming tournaments."
        />
      )}
    </div>
  );
}