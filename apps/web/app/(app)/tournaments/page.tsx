
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

    <div
      className="
        pb-10
        space-y-8
      "
    >

      {/* HERO */}

      <section
        className="
          rounded-[32px]
          border
          border-border
          bg-card
          p-8
          xl:p-10
        "
      >

        <div>

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-4
            "
          >

            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                border
                border-border
                bg-background-secondary
                text-white
              "
            >
              <Trophy size={26} />
            </div>

            <div>

              <div
                className="
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.3em]
                  text-muted
                "
              >
                FFX ESPORTS
              </div>

              <h1
                className="
                  mt-1
                  text-4xl
                  font-bold
                  tracking-tight
                  text-white
                  xl:text-5xl
                "
              >
                Tournaments
              </h1>
            </div>
          </div>

          <p
            className="
              mt-5
              max-w-3xl
              text-base
              leading-8
              text-muted
            "
          >
            Browse active esports tournaments,
            monitor prize pools,
            join competitive events,
            and track participation across games.
          </p>

          {/* STATS */}

          <div
            className="
              mt-10
              grid
              gap-4
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >

            <InfoCard
              icon={Flame}
              title="Live Events"
              value={String(
                tournaments.length
              )}
            />

            <InfoCard
              icon={Users}
              title="Players"
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

      <PageHeader
        eyebrow="Tournament Browser"
        title="Browse Events"
      >

        <div
          className="
            flex
            flex-wrap
            gap-3
          "
        >

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
                font-medium

                ${
                  game === item
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-card text-muted hover:bg-background-secondary"
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

      {/* CONTENT */}

      {loading ? (

        <div
          className="
            grid
            gap-6
            md:grid-cols-2
            xl:grid-cols-3
          "
        >

          {Array.from({
            length: 6
          }).map((_, index) => (

            <Skeleton
              key={index}
              className="
                h-[420px]
                rounded-3xl
              "
            />
          ))}
        </div>

      ) : filtered.length ? (

        <div
          className="
            grid
            gap-6
            md:grid-cols-2
            xl:grid-cols-3
          "
        >

          {filtered.map(
            (tournament) => (

              <div
                key={tournament.id}
                className="
                  rounded-3xl
                  border
                  border-border
                  bg-card
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
            )
          )}
        </div>

      ) : (

        <EmptyState
          icon={Trophy}
          title="No tournaments found"
          body="There are currently no tournaments available for the selected category."
        />
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
        rounded-2xl
        border
        border-border
        bg-background-secondary
        p-5
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div>

          <div
            className="
              text-xs
              font-medium
              uppercase
              tracking-[0.2em]
              text-muted
            "
          >
            {title}
          </div>

          <div
            className="
              mt-3
              text-3xl
              font-bold
              text-white
            "
          >
            {value}
          </div>
        </div>

        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            border
            border-border
            bg-card
            text-white
          "
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

