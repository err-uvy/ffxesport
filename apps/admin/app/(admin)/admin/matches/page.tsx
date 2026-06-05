"use client";

import {
  useEffect,
  useMemo,
  useState
} from "react";

import { toast } from "sonner";

import {
  Badge,
  Button,
  Card,
  Input
} from "@/ui";

import {
  Activity,
  CheckCircle2,
  Eye,
  Gamepad2,
  ShieldAlert,
  Swords,
  Trophy,
  XCircle
} from "lucide-react";

import { PageHeader } from "@/components/page-header";

import {
  api,
  apiMessage
} from "@/lib/api";

type Tournament = {
  id: string;

  title: string;

  matches: {
    id: string;

    mapName: string;

    status: string;

    roomId?: string;

    roomPassword?: string;

    startsAt: string;
  }[];
};

type Result = {
  id: string;

  kills: number;

  placement: number;

  score: number;

  screenshotUrl: string;

  submittedBy: {
    username: string;

    email: string;
  };

  match: {
    tournament: {
      title: string;

      game: string;
    };
  };
};

export default function AdminMatchesPage() {

  const [tournaments, setTournaments] =
    useState<Tournament[]>([]);

  const [results, setResults] =
    useState<Result[]>([]);

  const [roomId, setRoomId] =
    useState("");

  const [
    roomPassword,
    setRoomPassword
  ] = useState("");

  useEffect(() => {
    load();
  }, []);

  function load() {

    Promise.all([
      api.get("/admin/tournaments"),
      api.get("/admin/results")
    ])

      .then(
        ([tournamentRes, resultRes]) => {

          setTournaments(
            tournamentRes.data.data
          );

          setResults(
            resultRes.data.data
          );
        }
      );
  }

  const matches = useMemo(
    () =>
      tournaments.flatMap(
        (tournament) =>

          tournament.matches.map(
            (match) => ({
              ...match,

              tournamentTitle:
                tournament.title
            })
          )
      ),

    [tournaments]
  );

  async function release(
    matchId: string
  ) {
    try {

      await api.patch(
        `/admin/matches/${matchId}/room`,
        {
          roomId,
          roomPassword,

          status:
            "ROOM_RELEASED"
        }
      );

      toast.success(
        "Room released"
      );

      setRoomId("");

      setRoomPassword("");

      load();

    } catch (error) {

      toast.error(
        apiMessage(error)
      );
    }
  }

  async function verify(
    resultId: string,

    status:
      | "VERIFIED"
      | "REJECTED"
  ) {
    try {

      await api.patch(
        `/admin/results/${resultId}/verify`,
        { status }
      );

      toast.success(
        status === "VERIFIED"
          ? "Result verified"
          : "Result rejected"
      );

      load();

    } catch (error) {

      toast.error(
        apiMessage(error)
      );
    }
  }

  return (

    <div>

      {/* =======================================================
          ROOM CONTROL
      ======================================================= */}

      <PageHeader
        eyebrow="Match Control"
        title="Room Operations"
      />

      <Card
        className="
        mb-6

        overflow-hidden

        border-white/10

        bg-[#081120]/80

        p-6

        backdrop-blur-2xl
      "
      >

        <div className="mb-5 flex items-center gap-3">

          <div
            className="
            flex
            h-11
            w-11
            items-center
            justify-center

            rounded-2xl

            border
            border-white/5

            bg-cyan-400/[0.08]

            text-cyan-200
          "
          >
            <Gamepad2 size={20} />
          </div>

          <div>

            <div className="text-lg font-black text-white">
              Match Room Release
            </div>

            <div className="text-xs uppercase tracking-[0.22em] text-cyan-200">
              Custom Room Deployment
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">

          <Input
            placeholder="Room ID"

            value={roomId}

            onChange={(event: any) =>
              setRoomId(
                event.target.value
              )
            }

            className="
            border-cyan-400/10

            bg-[#020817]/70

            focus:border-cyan-400/40
          "
          />

          <Input
            placeholder="Room Password"

            value={roomPassword}

            onChange={(event: any) =>
              setRoomPassword(
                event.target.value
              )
            }

            className="
            border-cyan-400/10

            bg-[#020817]/70

            focus:border-cyan-400/40
          "
          />
        </div>
      </Card>

      {/* =======================================================
          MATCHES
      ======================================================= */}

      <div className="grid gap-5">

        {matches.map((match) => (

          <Card
            key={match.id}

            className="
            group

            relative

            overflow-hidden

            border-white/10

            bg-[#081120]/80

            p-6

            backdrop-blur-2xl

            transition-all
            duration-300

            hover:border-white/5
          "
          >

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.08),transparent_30%)] opacity-0 transition duration-500 group-hover:opacity-100" />

            <div className="relative z-10 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">

              <div>

                <div className="mb-3 flex flex-wrap gap-2">

                  <Badge
                    tone={
                      match.status ===
                      "LIVE"
                        ? "green"
                        : "blue"
                    }
                  >
                    {match.status.replace(
                      "_",
                      " "
                    )}
                  </Badge>

                  <Badge tone="black">
                    {match.mapName}
                  </Badge>
                </div>

                <h2 className="text-2xl font-black text-white">
                  {match.tournamentTitle}
                </h2>

                <div className="mt-3 flex flex-wrap items-center gap-5 text-sm text-slate-400">

                  <span className="flex items-center gap-2">
                    <Swords
                      size={16}
                      className="text-cyan-200"
                    />

                    Match Active
                  </span>

                  <span className="flex items-center gap-2">
                    <Activity
                      size={16}
                      className="text-pink-300"
                    />

                    {new Date(
                      match.startsAt
                    ).toLocaleString()}
                  </span>
                </div>

                {(match.roomId ||
                  match.roomPassword) && (

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">

                    <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05] p-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-cyan-200">
                        Room ID
                      </div>

                      <div className="mt-1 font-mono text-lg text-white">
                        {match.roomId}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-pink-400/10 bg-pink-500/[0.05] p-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-pink-200">
                        Password
                      </div>

                      <div className="mt-1 font-mono text-lg text-white">
                        {match.roomPassword}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button
                className="
                min-w-[180px]
              "

                onClick={() =>
                  release(match.id)
                }
              >
                <Gamepad2 size={17} />

                Release Room
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* =======================================================
          RESULTS
      ======================================================= */}

      <PageHeader
        eyebrow="Moderation"
        title="Pending Results"
      />

      <div className="grid gap-5">

        {results.map((result) => (

          <Card
            key={result.id}

            className="
            group

            relative

            overflow-hidden

            border-white/10

            bg-[#081120]/80

            p-6

            backdrop-blur-2xl

            transition-all
            duration-300

            hover:border-pink-400/20
          "
          >

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,0,128,.08),transparent_35%)] opacity-0 transition duration-500 group-hover:opacity-100" />

            <div className="relative z-10 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">

              <div>

                <div className="mb-3 flex flex-wrap gap-2">

                  <Badge tone="pink">
                    {result.match.tournament.game.replace(
                      "_",
                      " "
                    )}
                  </Badge>

                  <Badge tone="blue">
                    Result Review
                  </Badge>
                </div>

                <h2 className="text-2xl font-black text-white">
                  {
                    result.match
                      .tournament.title
                  }
                </h2>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">

                  <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.05] p-4">

                    <div className="text-xs uppercase tracking-[0.22em] text-cyan-200">
                      Kills
                    </div>

                    <div className="mt-1 text-2xl font-black text-white">
                      {result.kills}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-pink-400/10 bg-pink-500/[0.05] p-4">

                    <div className="text-xs uppercase tracking-[0.22em] text-pink-200">
                      Placement
                    </div>

                    <div className="mt-1 text-2xl font-black text-white">
                      #{result.placement}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-violet-400/10 bg-violet-500/[0.05] p-4">

                    <div className="text-xs uppercase tracking-[0.22em] text-violet-200">
                      Score
                    </div>

                    <div className="mt-1 text-2xl font-black text-white">
                      {result.score}
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-slate-400">

                  Submitted by

                  <span className="ml-2 font-bold text-white">
                    {
                      result.submittedBy
                        .username
                    }
                  </span>
                </div>

                <a
                  className="
                  mt-4

                  inline-flex
                  items-center
                  gap-2

                  rounded-xl

                  border
                  border-white/5

                  bg-cyan-400/[0.06]

                  px-4
                  py-3

                  text-sm
                  font-bold

                  text-cyan-100

                  transition-all

                  hover:border-cyan-400/40
                  hover:bg-cyan-400/[0.12]
                "

                  href={
                    result.screenshotUrl
                  }

                  target="_blank"

                  rel="noreferrer"
                >
                  <Eye size={16} />

                  Open Screenshot
                </a>
              </div>

              <div className="flex flex-col gap-3">

                <Button
                  onClick={() =>
                    verify(
                      result.id,
                      "VERIFIED"
                    )
                  }
                >
                  <CheckCircle2 size={18} />

                  Verify
                </Button>

                <Button
                  variant="danger"

                  onClick={() =>
                    verify(
                      result.id,
                      "REJECTED"
                    )
                  }
                >
                  <XCircle size={18} />

                  Reject
                </Button>

                <div
                  className="
                  mt-1

                  flex
                  items-center
                  justify-center
                  gap-2

                  rounded-2xl

                  border
                  border-amber-400/10

                  bg-amber-500/[0.05]

                  px-4
                  py-3

                  text-xs
                  font-bold

                  uppercase
                  tracking-[0.22em]

                  text-amber-100
                "
                >
                  <ShieldAlert size={15} />

                  Anti Cheat Review
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}