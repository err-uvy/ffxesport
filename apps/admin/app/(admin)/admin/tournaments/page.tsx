"use client";

import {
  useEffect,
  useState
} from "react";

import { toast } from "sonner";

import {
  Badge,
  Button,
  Card,
  Input
} from "@/ui";

import { formatMoney } from "@ffx/utils";

import {
  CalendarDays,
  Coins,
  Crown,
  Plus,
  Swords,
  Trophy,
  Users
} from "lucide-react";

import { PageHeader } from "@/components/page-header";

import {
  api,
  apiMessage
} from "@/lib/api";

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

  matches: {
    id: string;

    status: string;
  }[];
};

export default function AdminTournamentsPage() {

  const [tournaments, setTournaments] =
    useState<Tournament[]>([]);

  const [title, setTitle] =
    useState("");

  const [game, setGame] =
    useState("FREE_FIRE");

  const [mode, setMode] =
    useState("SQUAD");

  const [entryFee, setEntryFee] =
    useState(50);

  const [prizePool, setPrizePool] =
    useState(5000);

  const [maxSlots, setMaxSlots] =
    useState(48);

  const [startsAt, setStartsAt] =
    useState("");

  useEffect(() => {
    loadTournaments();
  }, []);

  function loadTournaments() {

    api
      .get("/admin/tournaments")

      .then((response) =>
        setTournaments(
          response.data.data
        )
      );
  }

  async function complete(
    id: string
  ) {
    try {

      await api.post(
        `/admin/tournaments/${id}/complete`
      );

      toast.success(
        "Tournament completed"
      );

      loadTournaments();

    } catch (error) {

      toast.error(
        apiMessage(error)
      );
    }
  }

  async function createTournament() {

    try {

      const start = startsAt

        ? new Date(startsAt)

        : new Date(
            Date.now() +
              48 *
                60 *
                60 *
                1000
          );

      await api.post(
        "/tournaments",
        {
          title,

          game,

          mode,

          description: `${title} hosted by FFX ESPORTS with verified rooms, anti-cheat moderation, and automated payouts.`,

          rules:
            "Join on time, fair play only, screenshot proof mandatory.",

          entryFee,

          prizePool,

          maxSlots,

          minTeamSize:
            mode === "SOLO"
              ? 1
              : mode === "DUO"
              ? 2
              : 4,

          maxTeamSize:
            mode === "SOLO"
              ? 1
              : mode === "DUO"
              ? 2
              : 4,

          inviteOnly: false,

          status:
            "REGISTRATION_OPEN",

          registrationStartsAt:
            new Date().toISOString(),

          registrationEndsAt:
            new Date(
              start.getTime() -
                60 *
                  60 *
                  1000
            ).toISOString(),

          startsAt:
            start.toISOString(),

          roomReleaseAt:
            new Date(
              start.getTime() -
                10 *
                  60 *
                  1000
            ).toISOString()
        }
      );

      toast.success(
        "Tournament created"
      );

      setTitle("");

      loadTournaments();

    } catch (error) {

      toast.error(
        apiMessage(error)
      );
    }
  }

  return (

    <div>

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <PageHeader
        eyebrow="Arena Control"
        title="Tournament Operations"
      />

      {/* ========================================= */}
      {/* CREATE PANEL */}
      {/* ========================================= */}

      <Card
        className="
        relative

        mb-8

        overflow-hidden

        border-white/10

        bg-[#081120]/90

        p-6

        backdrop-blur-2xl
      "
      >

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.08),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,.08),transparent_28%)]" />

        <div className="relative z-10">

          <div className="mb-6 flex items-center gap-3">

            <div
              className="
              flex
              h-12
              w-12
              items-center
              justify-center

              rounded-2xl

              bg-[linear-gradient(135deg,#00E5FF,#7C3AED,#FF0080)]

              text-white

              shadow-[0_0_30px_rgba(0,229,255,.35)]
            "
            >
              <Plus size={22} />
            </div>

            <div>

              <div className="text-2xl font-black text-white">
                Create Tournament
              </div>

              <div className="text-xs uppercase tracking-[0.24em] text-cyan-200">
                FundingPips Style Admin Panel
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_.6fr_.6fr_.5fr_.5fr_.5fr_.8fr_auto]">

            <Input
              placeholder="Tournament Title"

              value={title}

              onChange={(event: any) =>
                setTitle(
                  event.target.value
                )
              }

              className="
              border-cyan-400/10

              bg-[#020817]/70
            "
            />

            <select
              className="
              h-11

              rounded-xl

              border
              border-cyan-400/10

              bg-[#020817]/70

              px-3

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
                "VALORANT",
                "BATTLE_ROYALE"
              ].map((item) => (

                <option key={item}>
                  {item.replace(
                    "_",
                    " "
                  )}
                </option>
              ))}
            </select>

            <select
              className="
              h-11

              rounded-xl

              border
              border-pink-400/10

              bg-[#020817]/70

              px-3

              text-sm
              text-white

              outline-none
            "

              value={mode}

              onChange={(event: any) =>
                setMode(
                  event.target.value
                )
              }
            >

              {[
                "SOLO",
                "DUO",
                "SQUAD",
                "CLASH_SQUAD",
                "BATTLE_ROYALE"
              ].map((item) => (

                <option key={item}>
                  {item.replace(
                    "_",
                    " "
                  )}
                </option>
              ))}
            </select>

            <Input
              type="number"

              value={entryFee}

              onChange={(event: any) =>
                setEntryFee(
                  Number(
                    event.target.value
                  )
                )
              }

              className="
              border-violet-400/10

              bg-[#020817]/70
            "
            />

            <Input
              type="number"

              value={prizePool}

              onChange={(event: any) =>
                setPrizePool(
                  Number(
                    event.target.value
                  )
                )
              }

              className="
              border-violet-400/10

              bg-[#020817]/70
            "
            />

            <Input
              type="number"

              value={maxSlots}

              onChange={(event: any) =>
                setMaxSlots(
                  Number(
                    event.target.value
                  )
                )
              }

              className="
              border-cyan-400/10

              bg-[#020817]/70
            "
            />

            <Input
              type="datetime-local"

              value={startsAt}

              onChange={(event: any) =>
                setStartsAt(
                  event.target.value
                )
              }

              className="
              border-pink-400/10

              bg-[#020817]/70
            "
            />

            <Button
              onClick={
                createTournament
              }

              className="
              h-11

              shadow-[0_0_30px_rgba(0,229,255,.25)]
            "
            >
              Create
            </Button>
          </div>
        </div>
      </Card>

      {/* ========================================= */}
      {/* TOURNAMENTS */}
      {/* ========================================= */}

      <div className="grid gap-6">

        {tournaments.map(
          (tournament) => (

            <Card
              key={tournament.id}

              className="
              group

              relative

              overflow-hidden

              border-white/10

              bg-[#081120]/90

              p-6

              backdrop-blur-2xl

              transition-all
              duration-300

              hover:border-cyan-400/20
            "
            >

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(236,72,153,.06),transparent_30%)] opacity-0 transition duration-500 group-hover:opacity-100" />

              <div className="relative z-10 grid gap-5 xl:grid-cols-[1fr_auto] xl:items-center">

                {/* LEFT */}

                <div>

                  <div className="mb-3 flex flex-wrap gap-2">

                    <Badge tone="blue">
                      {tournament.game.replace(
                        "_",
                        " "
                      )}
                    </Badge>

                    <Badge tone="pink">
                      {tournament.mode.replace(
                        "_",
                        " "
                      )}
                    </Badge>

                    <Badge tone="green">
                      {tournament.status.replace(
                        "_",
                        " "
                      )}
                    </Badge>
                  </div>

                  <h2 className="text-2xl font-black text-white">
                    {tournament.title}
                  </h2>

                  <div className="mt-3 flex flex-wrap gap-5 text-sm text-slate-400">

                    <span className="flex items-center gap-2">

                      <Crown
                        size={16}
                        className="text-cyan-200"
                      />

                      {
                        tournament.code
                      }
                    </span>

                    <span className="flex items-center gap-2">

                      <CalendarDays
                        size={16}
                        className="text-pink-300"
                      />

                      {new Date(
                        tournament.startsAt
                      ).toLocaleString()}
                    </span>
                  </div>

                  {/* STATS */}

                  <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-4">

                    <Stat
                      icon={Trophy}

                      label="Prize Pool"

                      value={formatMoney(
                        tournament.prizePool
                      )}
                    />

                    <Stat
                      icon={Coins}

                      label="Entry Fee"

                      value={formatMoney(
                        tournament.entryFee
                      )}
                    />

                    <Stat
                      icon={Users}

                      label="Slots"

                      value={`${tournament.filledSlots}/${tournament.maxSlots}`}
                    />

                    <Stat
                      icon={Swords}

                      label="Matches"

                      value={String(
                        tournament.matches
                          .length
                      )}
                    />
                  </div>
                </div>

                {/* RIGHT */}

                <div className="flex flex-col gap-3">

                  <Button
                    variant="secondary"

                    className="
                    min-w-[180px]
                  "
                  >
                    Manage
                  </Button>

                  <Button
                    onClick={() =>
                      complete(
                        tournament.id
                      )
                    }

                    className="
                    min-w-[180px]
                  "
                  >
                    Complete
                  </Button>
                </div>
              </div>
            </Card>
          )
        )}
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,

  label,

  value
}: {
  icon: any;

  label: string;

  value: string;
}) {
  return (

    <div
      className="
      rounded-2xl

      border
      border-white/10

      bg-white/[0.03]

      p-4

      transition-all
      duration-300

      hover:border-cyan-400/20
      hover:bg-cyan-400/[0.04]
    "
    >

      <div className="mb-3 flex items-center gap-2 text-cyan-200">

        <Icon size={18} />

        <span className="text-xs uppercase tracking-[0.22em]">
          {label}
        </span>
      </div>

      <div className="text-2xl font-black text-white">
        {value}
      </div>
    </div>
  );
}