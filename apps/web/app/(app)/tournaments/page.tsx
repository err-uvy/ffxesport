"use client";

import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Filter,
  Trophy,
  Flame,
  ShieldCheck,
  Users,
  Sparkles
} from "lucide-react";

import { toast } from "sonner";

import {
  Button,
  Skeleton
} from "@/ui";

import { EmptyState } from "@/components/empty-state";

import { PageHeader } from "@/components/page-header";

import {
  TournamentCard,
  type Tournament
} from "@/components/tournament-card";

import {
  api,
  apiMessage
} from "@/lib/api";

type Team = {
  id: string;

  name: string;

  game: string;
};

export default function TournamentsPage() {

  const [game, setGame] =
    useState("ALL");

  const [tournaments, setTournaments] =
    useState<Tournament[]>([]);

  const [teams, setTeams] =
    useState<Team[]>([]);

  const [loading, setLoading] =
    useState(true);

  const filtered = useMemo(
    () =>
      game === "ALL"
        ? tournaments
        : tournaments.filter(
            (item) =>
              item.game === game
          ),
    [game, tournaments]
  );

  useEffect(() => {

    Promise.all([
      api.get(
        "/tournaments?pageSize=50"
      ),

      api.get("/teams")
    ])
      .then(
        ([
          tournamentRes,
          teamRes
        ]) => {

          setTournaments(
            tournamentRes.data.data
          );

          setTeams(
            teamRes.data.data
          );
        }
      )
      .finally(() =>
        setLoading(false)
      );

  }, []);

  async function joinTournament(
    tournament: Tournament & {
      maxTeamSize?: number;
    }
  ) {

    try {

      const team =
        Number(
          tournament.maxTeamSize ??
            1
        ) > 1
          ? teams.find(
              (item) =>
                item.game ===
                tournament.game
            )
          : undefined;

      await api.post(
        `/tournaments/${tournament.id}/join`,
        {
          teamId: team?.id
        }
      );

      toast.success(
        "Tournament joined successfully"
      );

      setTournaments((items) =>
        items.map((item) =>
          item.id === tournament.id
            ? {
                ...item,
                filledSlots:
                  item.filledSlots +
                  1
              }
            : item
        )
      );

    } catch (error) {

      toast.error(
        apiMessage(error)
      );
    }
  }

  return (
    <div className="pb-10">

      {/* HERO */}

      <section
        className="
          relative
          overflow-hidden
          rounded-[36px]
          border
          border-white/10
          bg-[#0d0d0d]
          p-7
          xl:p-10
        "
      >

        {/* BG */}

        <div
          className="
            absolute
            inset-0
            opacity-20
          "
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition:
              "center"
          }}
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-blue-600/20
            via-black/80
            to-cyan-500/10
          "
        />

        {/* CONTENT */}

        <div className="relative z-10">

          <div className="flex flex-wrap items-center gap-3">

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
              <Trophy size={28} />
            </div>

            <div>

              <div
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                  text-zinc-500
                "
              >
                FFX ESPORTS
              </div>

              <h1
                className="
                  mt-1
                  text-4xl
                  font-black
                  text-white
                  xl:text-6xl
                "
              >
                Tournaments
              </h1>
            </div>
          </div>

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
            Discover premium esports tournaments,
            compete with top players,
            earn rewards,
            and dominate the battlefield.
          </p>

          {/* STATS */}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <InfoCard
              icon={Flame}
              title="Live Events"
              value={String(
                tournaments.length
              )}
            />

            <InfoCard
              icon={Users}
              title="Registered Players"
              value="25K+"
            />

            <InfoCard
              icon={ShieldCheck}
              title="Verified Matches"
              value="100%"
            />

            <InfoCard
              icon={Sparkles}
              title="Prize Pools"
              value="₹10L+"
            />
          </div>
        </div>
      </section>

      {/* FILTERS */}

      <div className="mt-8">

        <PageHeader
          eyebrow="Arena Browser"
          title="Browse Tournaments"
        >

          <div className="flex flex-wrap gap-3">

            {[
              "ALL",
              "FREE_FIRE",
              "BGMI",
              "CODM",
              "VALORANT"
            ].map((item) => (

              <Button
                key={item}
                variant={
                  game === item
                    ? "primary"
                    : "secondary"
                }
                onClick={() =>
                  setGame(item)
                }
                className={`
                  h-11
                  rounded-2xl
                  border
                  px-5
                  font-semibold
                  transition-all

                  ${
                    game === item
                      ? "border-blue-500/30 bg-blue-600 text-white"
                      : "border-white/10 bg-[#151515] text-zinc-300 hover:bg-[#1d1d1d]"
                  }
                `}
              >

                <Filter size={16} />

                {item.replace(
                  "_",
                  " "
                )}
              </Button>
            ))}
          </div>
        </PageHeader>
      </div>

      {/* CONTENT */}

      {loading ? (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {Array.from({
            length: 6
          }).map((_, index) => (

            <Skeleton
              key={index}
              className="
                h-[430px]
                rounded-[30px]
              "
            />
          ))}
        </div>

      ) : filtered.length ? (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {filtered.map(
            (tournament) => (

              <div
                key={tournament.id}
                className="
                  rounded-[32px]
                  border
                  border-white/5
                  bg-[#101010]
                  p-[1px]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-blue-500/20
                "
              >

                <div
                  className="
                    rounded-[32px]
                    bg-[#101010]
                  "
                >

                  <TournamentCard
                    tournament={
                      tournament
                    }
                    onJoin={() =>
                      joinTournament(
                        tournament
                      )
                    }
                  />
                </div>
              </div>
            )
          )}
        </div>

      ) : (

        <div className="mt-10">

          <EmptyState
            icon={Trophy}
            title="No tournaments found"
            body="Your selected filters currently have no active tournament slots available."
          />
        </div>
      )}
    </div>
  );
}

function InfoCard({
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
        border-white/10
        bg-black/30
        p-4
        backdrop-blur-xl
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
          bg-blue-500/10
          text-blue-400
        "
      >
        <Icon size={22} />
      </div>

      <div className="mt-4 text-xs uppercase tracking-[0.2em] text-zinc-500">
        {title}
      </div>

      <div className="mt-1 text-2xl font-black text-white">
        {value}
      </div>
    </div>
  );
}