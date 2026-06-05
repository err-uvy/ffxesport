"use client";

import {
  useEffect,
  useState
} from "react";

import {
  Crown,
  Shield,
  Swords,
  Users,
  UserPlus,
  Gamepad2,
  Sparkles,
  ShieldCheck,
  Trophy,
  Copy,
  ArrowRight
} from "lucide-react";

import { toast } from "sonner";

import {
  Badge,
  Button,
  Card,
  Input
} from "@/ui";

import {
  EmptyState
} from "@/components/empty-state";

import {
  PageHeader
} from "@/components/page-header";

import {
  api,
  apiMessage
} from "@/lib/api";

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
        setTeams(
          response.data.data
        )
      );
  }

  async function createTeam() {

    try {

      await api.post(
        "/teams",
        {
          name,
          tag,
          game
        }
      );

      toast.success(
        "Squad created successfully"
      );

      setName("");
      setTag("");

      loadTeams();

    } catch (error) {

      toast.error(
        apiMessage(error)
      );
    }
  }

  async function inviteUser(
    teamId: string
  ) {

    try {

      await api.post(
        `/teams/${teamId}/invite`,
        {
          usernameOrEmail:
            invite
        }
      );

      toast.success(
        "Invitation sent"
      );

      setInvite("");

      loadTeams();

    } catch (error) {

      toast.error(
        apiMessage(error)
      );
    }
  }

  function copyCode(
    code: string
  ) {

    navigator.clipboard.writeText(
      code
    );

    toast.success(
      "Invite code copied"
    );
  }

  return (
    <div className="space-y-6 pb-10">

      {/* HEADER */}

      <PageHeader
        eyebrow="FFX Squad Hub"
        title="Teams"
      >

        <div
          className="
            rounded-2xl
            border
            border-border
            bg-card
            px-5
            py-3
          "
        >

          <div
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.25em]
              text-muted
            "
          >
            Active Squads
          </div>

          <div
            className="
              mt-1
              text-2xl
              font-black
              text-white
            "
          >
            {teams.length}
          </div>
        </div>
      </PageHeader>

      {/* HERO */}

      <section
        className="
          rounded-[32px]
          border
          border-border
          bg-card
          p-6
          lg:p-8
        "
      >

        <div
          className="
            grid
            gap-5
            md:grid-cols-2
            xl:grid-cols-4
          "
        >

          <HeroCard
            icon={Users}
            title="Elite Squads"
            value="Competitive"
          />

          <HeroCard
            icon={ShieldCheck}
            title="Verified Players"
            value="Protected"
          />

          <HeroCard
            icon={Sparkles}
            title="Tournament Ready"
            value="Active"
          />

          <HeroCard
            icon={Trophy}
            title="Team Rankings"
            value="Live"
          />
        </div>
      </section>

      {/* CREATE TEAM */}

      <Card
        className="
          rounded-[32px]
          border
          border-border
          bg-card
          p-6
        "
      >

        <div className="flex items-center gap-4">

          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-3xl
              bg-primary/10
              text-primary
            "
          >

            <Users size={26} />
          </div>

          <div>

            <h2
              className="
                text-2xl
                font-bold
                text-white
              "
            >
              Create Squad
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-muted
              "
            >
              Launch your competitive roster
            </p>
          </div>
        </div>

        <div
          className="
            mt-8
            grid
            gap-4
            xl:grid-cols-[1fr_180px_180px_auto]
          "
        >

          <Input
            placeholder="Team name"
            value={name}
            onChange={(
              event: any
            ) =>
              setName(
                event.target
                  .value
              )
            }
            className="
              h-12
              border-border
              bg-background-secondary
            "
          />

          <Input
            placeholder="Clan tag"
            value={tag}
            onChange={(
              event: any
            ) =>
              setTag(
                event.target
                  .value
              )
            }
            className="
              h-12
              border-border
              bg-background-secondary
            "
          />

          <select
            className="
              h-12
              rounded-2xl
              border
              border-border
              bg-background-secondary
              px-4
              text-sm
              text-white
              outline-none
            "
            value={game}
            onChange={(
              event: any
            ) =>
              setGame(
                event.target
                  .value
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
                {item.replace(
                  "_",
                  " "
                )}
              </option>
            ))}
          </select>

          <Button
            onClick={createTeam}
            className="
              h-12
              rounded-2xl
              bg-primary
              px-8
              font-semibold
            "
          >

            Create Team

            <ArrowRight
              size={18}
            />
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
                rounded-[32px]
                border
                border-border
                bg-card
                p-6
                transition-all
                duration-300
                hover:border-primary/20
              "
            >

              {/* TOP */}

              <div
                className="
                  flex
                  flex-col
                  gap-5
                  lg:flex-row
                  lg:items-start
                  lg:justify-between
                "
              >

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
                      rounded-3xl
                      bg-primary/10
                      text-primary
                    "
                  >

                    <Gamepad2
                      size={28}
                    />
                  </div>

                  {/* CONTENT */}

                  <div>

                    <div className="flex items-center gap-3">

                      <h2
                        className="
                          text-2xl
                          font-bold
                          text-white
                        "
                      >
                        {team.name}
                      </h2>

                      <div
                        className="
                          rounded-full
                          border
                          border-primary/20
                          bg-primary/10
                          px-3
                          py-1
                          text-xs
                          font-bold
                          uppercase
                          tracking-[0.15em]
                          text-primary
                        "
                      >
                        {team.tag}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">

                      <Badge tone="black">
                        {team.game.replace(
                          "_",
                          " "
                        )}
                      </Badge>

                      <Badge tone="green">
                        {
                          team.members
                            .length
                        }{" "}
                        Members
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* INVITE CODE */}

                <button
                  onClick={() =>
                    copyCode(
                      team.inviteCode
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-2xl
                    border
                    border-border
                    bg-background-secondary
                    px-4
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition-all
                    hover:border-primary/20
                  "
                >

                  {team.inviteCode}

                  <Copy
                    size={16}
                  />
                </button>
              </div>

              {/* MEMBERS */}

              <div className="mt-8">

                <div className="mb-4 flex items-center gap-2">

                  <Swords
                    size={18}
                    className="
                      text-primary
                    "
                  />

                  <h3
                    className="
                      font-bold
                      text-white
                    "
                  >
                    Squad Members
                  </h3>
                </div>

                <div className="space-y-3">

                  {team.members.map(
                    (member) => (

                      <div
                        key={
                          member.id
                        }
                        className="
                          flex
                          items-center
                          justify-between
                          rounded-3xl
                          border
                          border-border
                          bg-background-secondary
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
                              rounded-2xl
                              bg-primary/10
                              text-primary
                            "
                          >

                            {member.role ===
                            "CAPTAIN" ? (

                              <Crown
                                size={18}
                              />

                            ) : (

                              <Shield
                                size={18}
                              />
                            )}
                          </div>

                          <div>

                            <div
                              className="
                                font-semibold
                                text-white
                              "
                            >
                              {
                                member
                                  .user
                                  .username
                              }
                            </div>

                            <div
                              className="
                                mt-1
                                text-xs
                                uppercase
                                tracking-[0.15em]
                                text-muted
                              "
                            >
                              {
                                member.role
                              }
                            </div>
                          </div>
                        </div>

                        <Badge
                          tone={
                            member.status ===
                            "ACTIVE"
                              ? "green"
                              : "amber"
                          }
                        >
                          {
                            member.status
                          }
                        </Badge>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* INVITE */}

              <div className="mt-8">

                <div className="mb-4 flex items-center gap-2">

                  <UserPlus
                    size={18}
                    className="
                      text-primary
                    "
                  />

                  <h3
                    className="
                      font-bold
                      text-white
                    "
                  >
                    Invite Player
                  </h3>
                </div>

                <div
                  className="
                    flex
                    flex-col
                    gap-3
                    lg:flex-row
                  "
                >

                  <Input
                    placeholder="username or email"
                    value={invite}
                    onChange={(
                      event: any
                    ) =>
                      setInvite(
                        event.target
                          .value
                      )
                    }
                    className="
                      h-12
                      border-border
                      bg-background-secondary
                    "
                  />

                  <Button
                    variant="secondary"
                    onClick={() =>
                      inviteUser(
                        team.id
                      )
                    }
                    className="
                      h-12
                      rounded-2xl
                      border-border
                      bg-background-secondary
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
          title="No Teams Yet"
          body="Create your first competitive squad and dominate upcoming tournaments."
        />
      )}
    </div>
  );
}

function HeroCard({
  icon: Icon,
  title,
  value
}: {
  icon: any;
  title: string;
  value: string;
}) {

  return (
    <div
      className="
        rounded-3xl
        border
        border-border
        bg-background-secondary
        p-5
      "
    >

      <div
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-primary/10
          text-primary
        "
      >

        <Icon size={22} />
      </div>

      <div
        className="
          mt-4
          text-xs
          font-semibold
          uppercase
          tracking-[0.2em]
          text-muted
        "
      >
        {title}
      </div>

      <div
        className="
          mt-1
          text-2xl
          font-black
          text-white
        "
      >
        {value}
      </div>
    </div>
  );
}

