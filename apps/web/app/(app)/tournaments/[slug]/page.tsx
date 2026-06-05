"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import {
  ArrowRight,
  Clock3,
  Flame,
  Gamepad2,
  ShieldCheck,
  Swords,
  Trophy,
  Users
} from "lucide-react";

import { toast } from "sonner";

import {
  Badge,
  Button,
  Card,
  Progress,
  Skeleton
} from "@/ui";

import { PageHeader } from "@/components/page-header";

import {
  api,
  apiMessage
} from "@/lib/api";

import { formatMoney } from "@/utils";

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
      <Skeleton
        className="
          h-[80vh]
          rounded-[32px]
        "
      />
    );
  }

  const slots = Math.round(
    (tournament.filledSlots /
      tournament.maxSlots) *
      100
  );

  return (
    <div className="space-y-6 pb-10">

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
            bg-white
            px-6
            text-sm
            font-semibold
            text-black
            hover:bg-zinc-200
          "
        >
          Join Tournament
        </Button>
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

        <div className="flex flex-wrap items-center gap-3">

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
            Entry Fee{" "}
            {formatMoney(
              tournament.entryFee
            )}
          </Badge>
        </div>

        <div
          className="
            mt-6
            grid
            gap-8
            xl:grid-cols-[1fr_340px]
          "
        >

          {/* LEFT */}

          <div>

            <h1
              className="
                max-w-4xl
                text-4xl
                font-bold
                tracking-tight
                text-white
                xl:text-5xl
              "
            >
              {tournament.title}
            </h1>

            <p
              className="
                mt-5
                max-w-3xl
                text-base
                leading-8
                text-muted
              "
            >
              {tournament.description}
            </p>

            <div
              className="
                mt-8
                grid
                gap-4
                sm:grid-cols-2
                xl:grid-cols-4
              "
            >

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
                ).toLocaleDateString()}
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

          {/* RIGHT */}

          <Card
            className="
              rounded-[28px]
              border
              border-border
              bg-background-secondary
              p-6
            "
          >

            <div className="flex items-center justify-between">

              <div>

                <div
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.25em]
                    text-muted
                  "
                >
                  Registration Status
                </div>

                <div
                  className="
                    mt-2
                    text-3xl
                    font-bold
                    text-white
                  "
                >
                  {slots}%
                </div>
              </div>

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-primary/10
                  text-primary
                "
              >
                <Users size={24} />
              </div>
            </div>

            <Progress
              value={slots}
              className="mt-6"
            />

            <div
              className="
                mt-6
                rounded-2xl
                border
                border-border
                bg-card
                p-4
              "
            >

              <div className="flex items-center justify-between">

                <div className="text-sm text-muted">
                  Registered Players
                </div>

                <div className="font-semibold text-white">
                  {tournament.filledSlots}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">

                <div className="text-sm text-muted">
                  Remaining Slots
                </div>

                <div className="font-semibold text-white">
                  {tournament.maxSlots -
                    tournament.filledSlots}
                </div>
              </div>
            </div>

            <Button
              onClick={join}
              className="
                mt-6
                h-12
                w-full
                rounded-2xl
                bg-white
                font-semibold
                text-black
                hover:bg-zinc-200
              "
            >

              Join Tournament

              <ArrowRight size={18} />
            </Button>
          </Card>
        </div>
      </section>

      {/* GRID */}

      <div
        className="
          grid
          gap-6
          xl:grid-cols-[0.9fr_1.1fr]
        "
      >

        {/* LEFT */}

        <div className="space-y-6">

          {/* PRIZES */}

          <Card
            className="
              rounded-[30px]
              border
              border-border
              bg-card
              p-6
            "
          >

            <SectionHeader
              icon={Trophy}
              title="Prize Distribution"
              subtitle="Winning rewards"
            />

            <div className="mt-6 space-y-3">

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
                      border-border
                      bg-background-secondary
                      px-5
                      py-4
                    "
                  >

                    <div className="flex items-center gap-4">

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
                          font-bold
                        "
                      >
                        #{prize.rank}
                      </div>

                      <div>

                        <div className="font-semibold text-white">
                          Rank {prize.rank}
                        </div>

                        <div className="text-sm text-muted">
                          Tournament Reward
                        </div>
                      </div>
                    </div>

                    <div
                      className="
                        text-lg
                        font-bold
                        text-white
                      "
                    >
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
              border-border
              bg-card
              p-6
            "
          >

            <SectionHeader
              icon={Gamepad2}
              title="Match Schedule"
              subtitle="Upcoming rounds"
            />

            <div className="mt-6 space-y-3">

              {tournament.matches.map(
                (match) => (

                  <div
                    key={match.id}
                    className="
                      rounded-2xl
                      border
                      border-border
                      bg-background-secondary
                      p-5
                    "
                  >

                    <div className="flex items-center justify-between">

                      <div>

                        <div className="font-semibold text-white">
                          {match.mapName}
                        </div>

                        <div className="mt-2 text-sm text-muted">
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

          {/* PARTICIPANTS */}

          <Card
            className="
              rounded-[30px]
              border
              border-border
              bg-card
              p-6
            "
          >

            <SectionHeader
              icon={ShieldCheck}
              title="Participants"
              subtitle="Registered tournament players"
            />

            <div
              className="
                mt-6
                grid
                gap-3
                sm:grid-cols-2
              "
            >

              {tournament.participants.map(
                (participant) => (

                  <div
                    key={participant.id}
                    className="
                      rounded-2xl
                      border
                      border-border
                      bg-background-secondary
                      p-4
                    "
                  >

                    <div className="flex items-center justify-between">

                      <div>

                        <div className="font-semibold text-white">
                          Slot {participant.slotNumber}
                        </div>

                        <div className="mt-1 text-sm text-muted">
                          {participant.team?.name ??
                            participant.user?.username ??
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
                        <ShieldCheck size={18} />
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
              border-border
              bg-card
              p-6
            "
          >

            <SectionHeader
              icon={Swords}
              title="Rules & Guidelines"
              subtitle="Tournament regulations"
            />

            <div
              className="
                mt-6
                rounded-2xl
                border
                border-border
                bg-background-secondary
                p-6
              "
            >

              <p
                className="
                  whitespace-pre-wrap
                  text-sm
                  leading-8
                  text-muted
                "
              >
                {tournament.rules}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle
}: {
  icon: any;
  title: string;
  subtitle: string;
}) {

  return (
    <div className="flex items-center gap-4">

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
        <Icon size={20} />
      </div>

      <div>

        <h2
          className="
            text-xl
            font-bold
            text-white
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1
            text-sm
            text-muted
          "
        >
          {subtitle}
        </p>
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
        rounded-2xl
        border
        border-border
        bg-background-secondary
        p-4
      "
    >

      <div
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          bg-primary/10
          text-primary
        "
      >
        <Icon size={20} />
      </div>

      <div
        className="
          mt-4
          text-xs
          font-semibold
          uppercase
          tracking-[0.25em]
          text-muted
        "
      >
        {label}
      </div>

      <div
        className="
          mt-2
          text-lg
          font-bold
          text-white
        "
      >
        {value}
      </div>
    </div>
  );
}

