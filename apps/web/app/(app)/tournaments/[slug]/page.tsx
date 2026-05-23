"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import {
  Clock3,
  Trophy,
  Users,
  Flame,
  Swords,
  ShieldCheck,
  ArrowRight,
  Gamepad2
} from "lucide-react";

import {
  Badge,
  Button,
  Card,
  Progress,
  Skeleton
} from "@/ui";

import { toast } from "sonner";

import { formatMoney } from "@/utils";

import { PageHeader } from "@/components/page-header";

import {
  api,
  apiMessage
} from "@/lib/api";

type Detail = {
  id: string;

  title: string;

  game: string;

  mode: string;

  description: string;

  rules: string;

  entryFee: string;

  prizePool: string;

  maxSlots: number;

  filledSlots: number;

  startsAt: string;

  status: string;

  participants: {
    id: string;

    slotNumber: number;

    user?: {
      username: string;
    };

    team?: {
      name: string;
      tag: string;
    };
  }[];

  prizeDistributions: {
    rank: number;
    amount: string;
  }[];

  matches: {
    id: string;
    mapName: string;
    startsAt: string;
    status: string;
  }[];
};

export default function TournamentDetailPage() {

  const params =
    useParams<{
      slug: string;
    }>();

  const [tournament, setTournament] =
    useState<Detail | null>(null);

  useEffect(() => {

    api
      .get(
        `/tournaments/${params.slug}`
      )
      .then((response) =>
        setTournament(
          response.data.data
        )
      );

  }, [params.slug]);

  async function join() {

    if (!tournament) {
      return;
    }

    try {

      await api.post(
        `/tournaments/${tournament.id}/join`,
        {}
      );

      toast.success(
        "Tournament joined successfully"
      );

    } catch (error) {

      toast.error(
        apiMessage(error)
      );
    }
  }

  if (!tournament) {

    return (
      <Skeleton className="h-[80vh]" />
    );
  }

  const slots = Math.round(
    (tournament.filledSlots /
      tournament.maxSlots) *
      100
  );

  return (
    <div className="pb-10">

      {/* HEADER */}

      <PageHeader
        eyebrow={tournament.game.replace(
          "_",
          " "
        )}
        title={tournament.title}
      >

        <Button
          onClick={join}
          className="
            h-12
            rounded-2xl
            bg-blue-600
            px-7
            font-semibold
            hover:bg-blue-700
          "
        >
          Join Tournament
        </Button>
      </PageHeader>

      {/* HERO */}

      <section
        className="
          relative
          overflow-hidden
          rounded-[34px]
          border
          border-white/10
          bg-[#0f1117]
          p-7
          shadow-2xl
          xl:p-10
        "
      >

        {/* BACKGROUND */}

        <div
          className="
            absolute
            inset-0
            opacity-30
          "
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-blue-600/30
            via-black/70
            to-cyan-500/20
          "
        />

        {/* CONTENT */}

        <div className="relative z-10">

          <div className="flex flex-wrap gap-3">

            <Badge tone="blue">
              {tournament.mode.replace(
                "_",
                " "
              )}
            </Badge>

            <Badge
              tone={
                tournament.status ===
                "LIVE"
                  ? "green"
                  : "pink"
              }
            >
              {tournament.status.replace(
                "_",
                " "
              )}
            </Badge>

            <Badge tone="black">
              Entry{" "}
              {formatMoney(
                tournament.entryFee
              )}
            </Badge>
          </div>

          <h1
            className="
              mt-4
              max-w-4xl
              text-4xl
              font-black
              leading-tight
              text-white
              xl:text-6xl
            "
          >
            {tournament.title}
          </h1>

          <p
            className="
              mt-4
              max-w-3xl
              text-base
              leading-8
              text-zinc-300
              xl:text-lg
            "
          >
            {tournament.description}
          </p>

          {/* STATS */}

          <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">

            <StatCard
              icon={Trophy}
              label="Prize Pool"
              value={formatMoney(
                tournament.prizePool
              )}
            />

            <StatCard
              icon={Users}
              label="Slots"
              value={`${tournament.filledSlots}/${tournament.maxSlots}`}
            />

            <StatCard
              icon={Clock3}
              label="Starts At"
              value={new Date(
                tournament.startsAt
              ).toLocaleString()}
            />

            <StatCard
              icon={Flame}
              label="Status"
              value={tournament.status.replace(
                "_",
                " "
              )}
            />
          </div>
        </div>
      </section>

      {/* GRID */}

      <div className="mt-7 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">

        {/* LEFT */}

        <div className="space-y-6">

          {/* PRIZES */}

          <Card
            className="
              rounded-[30px]
              border
              border-white/5
              bg-[#101010]
              p-6
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-yellow-500/10
                  text-yellow-400
                "
              >
                <Trophy size={20} />
              </div>

              <div>

                <h2 className="text-2xl font-bold text-white">
                  Prize Distribution
                </h2>

                <p className="text-sm text-zinc-400">
                  Winning breakdown
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">

              {tournament.prizeDistributions.map(
                (prize) => (

                  <div
                    key={prize.rank}
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-2xl
                      border
                      border-white/5
                      bg-[#181818]
                      px-5
                      py-4
                    "
                  >

                    <div className="flex items-center gap-3">

                      <div
                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          bg-blue-500/10
                          text-blue-400
                        "
                      >
                        #{prize.rank}
                      </div>

                      <div>

                        <div className="font-bold text-white">
                          Rank {prize.rank}
                        </div>

                        <div className="text-xs text-zinc-500">
                          Tournament Reward
                        </div>
                      </div>
                    </div>

                    <div className="text-lg font-black text-green-400">
                      {formatMoney(
                        prize.amount
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </Card>

          {/* MATCHES */}

          <Card
            className="
              rounded-[30px]
              border
              border-white/5
              bg-[#101010]
              p-6
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-cyan-500/10
                  text-cyan-400
                "
              >
                <Gamepad2 size={20} />
              </div>

              <div>

                <h2 className="text-2xl font-bold text-white">
                  Match Schedule
                </h2>

                <p className="text-sm text-zinc-400">
                  Upcoming battle rounds
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">

              {tournament.matches.map(
                (match) => (

                  <div
                    key={match.id}
                    className="
                      rounded-2xl
                      border
                      border-white/5
                      bg-[#181818]
                      p-4
                    "
                  >

                    <div className="flex items-center justify-between gap-3">

                      <div>

                        <div className="font-bold text-white">
                          {match.mapName}
                        </div>

                        <div className="mt-1 text-sm text-zinc-500">
                          {new Date(
                            match.startsAt
                          ).toLocaleString()}
                        </div>
                      </div>

                      <Badge
                        tone={
                          match.status ===
                          "LIVE"
                            ? "green"
                            : "blue"
                        }
                      >
                        {match.status}
                      </Badge>
                    </div>
                  </div>
                )
              )}
            </div>
          </Card>
        </div>

        {/* RIGHT */}

        <div className="space-y-6">

          {/* SLOT STATUS */}

          <Card
            className="
              rounded-[30px]
              border
              border-white/5
              bg-[#101010]
              p-6
            "
          >

            <div className="flex items-center justify-between gap-3">

              <div>

                <h2 className="text-2xl font-bold text-white">
                  Slot Capacity
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  Tournament registrations
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  bg-blue-500/10
                  px-4
                  py-2
                  text-sm
                  font-bold
                  text-blue-300
                "
              >
                {slots}%
              </div>
            </div>

            <Progress
              value={slots}
              className="mt-4"
            />

            <div className="mt-7 grid gap-3 sm:grid-cols-2">

              {tournament.participants.map(
                (participant) => (

                  <div
                    key={participant.id}
                    className="
                      rounded-2xl
                      border
                      border-white/5
                      bg-[#181818]
                      p-4
                    "
                  >

                    <div className="flex items-center justify-between">

                      <div>

                        <div className="font-bold text-white">
                          Slot{" "}
                          {
                            participant.slotNumber
                          }
                        </div>

                        <div className="mt-1 text-sm text-zinc-400">
                          {participant
                            .team?.name ??
                            participant
                              .user
                              ?.username ??
                            "Player"}
                        </div>
                      </div>

                      <div
                        className="
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          bg-green-500/10
                          text-green-400
                        "
                      >
                        <ShieldCheck
                          size={18}
                        />
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </Card>

          {/* RULES */}

          <Card
            className="
              rounded-[30px]
              border
              border-white/5
              bg-[#101010]
              p-6
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-2xl
                  bg-purple-500/10
                  text-purple-400
                "
              >
                <Swords size={20} />
              </div>

              <div>

                <h2 className="text-2xl font-bold text-white">
                  Rules & Guidelines
                </h2>

                <p className="text-sm text-zinc-400">
                  Read carefully before joining
                </p>
              </div>
            </div>

            <div
              className="
                mt-4
                rounded-3xl
                border
                border-white/5
                bg-[#181818]
                p-6
              "
            >

              <p
                className="
                  whitespace-pre-wrap
                  text-sm
                  leading-8
                  text-zinc-300
                "
              >
                {tournament.rules}
              </p>

              <div
                className="
                  mt-4
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-blue-400
                "
              >
                Follow all rules carefully

                <ArrowRight size={16} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({
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
        rounded-3xl
        border
        border-white/10
        bg-black/25
        p-4
        backdrop-blur-xl
      "
    >

      <div
        className="
          mb-4
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-blue-500/10
          text-blue-400
        "
      >
        <Icon size={22} />
      </div>

      <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </div>

      <div className="mt-1 text-lg font-black text-white">
        {value}
      </div>
    </div>
  );
}