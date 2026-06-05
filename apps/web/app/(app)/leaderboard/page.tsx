"use client";

import {
  useEffect,
  useState
} from "react";

import {
  Crown,
  Trophy,
  Flame,
  ShieldCheck,
  Users
} from "lucide-react";

import {
  Card
} from "@/ui";

import {
  EmptyState
} from "@/components/empty-state";

import {
  PageHeader
} from "@/components/page-header";

import {
  api
} from "@/lib/api";

import {
  formatMoney
} from "@/utils";

type Row = {
  id?: string;
  uid?: string;
  handle?: string;
  kdRatio?: string;
  earnings?: string;

  user?: {
    username?: string;
    avatarUrl?: string;
  };

  team?: {
    name?: string;
  };

  name?: string;
  tag?: string;

  score?: number;
  kills?: number;

  _sum?: {
    kills?: number;
    score?: number;
  };
};

const views = [
  "global",
  "earnings",
  "kills",
  "clans",
] as const;

export default function LeaderboardPage() {

  const [view, setView] =
    useState<(typeof views)[number]>(
      "global"
    );

  const [rows, setRows] =
    useState<Row[]>([]);

  useEffect(() => {

    api
      .get(
        `/leaderboard/${view}`
      )
      .then((response) =>
        setRows(
          response.data.data
        )
      );

  }, [view]);

  return (
    <div className="space-y-6 pb-10">

      {/* HEADER */}

      <PageHeader
        eyebrow="Competitive Rankings"
        title="Leaderboards"
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
            Active Rankings
          </div>

          <div
            className="
              mt-1
              text-2xl
              font-bold
              text-white
            "
          >
            {rows.length}
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
            gap-8
            xl:grid-cols-[1fr_340px]
          "
        >

          {/* LEFT */}

          <div>

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-border
                bg-background-secondary
                px-4
                py-2
                text-xs
                font-semibold
                uppercase
                tracking-[0.25em]
                text-muted
              "
            >
              FFX Competitive System
            </div>

            <h1
              className="
                mt-6
                max-w-4xl
                text-4xl
                font-bold
                tracking-tight
                text-white
                xl:text-5xl
              "
            >
              Real-time esports
              rankings & dominance.
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
              Track top players,
              tournament earnings,
              kill leaders,
              and elite esports clans
              across FFX ESPORTS.
            </p>

            {/* FILTERS */}

            <div
              className="
                mt-8
                flex
                flex-wrap
                gap-3
              "
            >

              {views.map((item) => (

                <button
                  key={item}
                  onClick={() =>
                    setView(item)
                  }
                  className={`
                    rounded-2xl
                    border
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    capitalize
                    transition-all

                    ${
                      view === item
                        ? `
                          border-white
                          bg-white
                          text-black
                        `
                        : `
                          border-border
                          bg-background-secondary
                          text-muted
                          hover:text-white
                        `
                    }
                  `}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT */}

          <div
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
                  Current Mode
                </div>

                <div
                  className="
                    mt-2
                    text-3xl
                    font-bold
                    capitalize
                    text-white
                  "
                >
                  {view}
                </div>
              </div>

              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-3xl
                  bg-primary/10
                  text-primary
                "
              >
                <Crown size={30} />
              </div>
            </div>

            <div className="mt-8 space-y-4">

              <StatRow
                icon={Trophy}
                label="Tournament Rankings"
                value="Live"
              />

              <StatRow
                icon={Flame}
                label="Kills Tracking"
                value="Realtime"
              />

              <StatRow
                icon={ShieldCheck}
                label="Verified Scores"
                value="Secure"
              />

              <StatRow
                icon={Users}
                label="Clan Rankings"
                value="Global"
              />
            </div>
          </div>
        </div>
      </section>

      {/* LEADERBOARD */}

      <Card
        className="
          overflow-hidden
          rounded-[32px]
          border
          border-border
          bg-card
        "
      >

        {rows.length ? (

          <div>

            {/* TABLE HEADER */}

            <div
              className="
                grid
                grid-cols-[90px_1fr_auto]
                border-b
                border-border
                px-6
                py-4
                text-xs
                font-semibold
                uppercase
                tracking-[0.25em]
                text-muted
              "
            >

              <div>Rank</div>

              <div>Player</div>

              <div>Performance</div>
            </div>

            {/* ROWS */}

            <div>

              {rows.map(
                (
                  row,
                  index
                ) => {

                  const name =
                    row.user
                      ?.username ??
                    row.name ??
                    row.handle ??
                    "Player";

                  const subtext =
                    row.tag ??
                    row.uid ??
                    `Score ${
                      row.score ??
                      row._sum
                        ?.score ??
                      0
                    }`;

                  const value =
                    row.earnings
                      ? formatMoney(
                          row.earnings
                        )
                      : `${
                          row.kills ??
                          row._sum
                            ?.kills ??
                          row.score ??
                          0
                        } pts`;

                  return (

                    <div
                      key={
                        row.id ??
                        row.uid ??
                        `${view}-${index}`
                      }
                      className="
                        grid
                        grid-cols-[90px_1fr_auto]
                        items-center
                        gap-4
                        border-b
                        border-border
                        px-6
                        py-5
                        transition-all
                        hover:bg-background-secondary
                      "
                    >

                      {/* RANK */}

                      <div>

                        <div
                          className={`
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            text-lg
                            font-bold

                            ${
                              index === 0
                                ? `
                                  border-yellow-500/20
                                  bg-yellow-500/10
                                  text-yellow-400
                                `
                                : `
                                  border-border
                                  bg-background-secondary
                                  text-white
                                `
                            }
                          `}
                        >

                          {index === 0 ? (
                            <Crown
                              className="
                                h-5
                                w-5
                              "
                            />
                          ) : (
                            index + 1
                          )}
                        </div>
                      </div>

                      {/* PLAYER */}

                      <div>

                        <div
                          className="
                            text-lg
                            font-semibold
                            text-white
                          "
                        >
                          {name}
                        </div>

                        <div
                          className="
                            mt-1
                            text-sm
                            text-muted
                          "
                        >
                          {subtext}
                        </div>
                      </div>

                      {/* VALUE */}

                      <div
                        className="
                          rounded-2xl
                          border
                          border-border
                          bg-background-secondary
                          px-5
                          py-3
                          text-sm
                          font-semibold
                          text-white
                        "
                      >
                        {value}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

        ) : (

          <div className="p-12">

            <EmptyState
              icon={Crown}
              title="Leaderboard Empty"
              body="Competitive rankings will appear after tournament completion."
            />

          </div>
        )}
      </Card>
    </div>
  );
}

function StatRow({
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
        flex
        items-center
        justify-between
        rounded-2xl
        border
        border-border
        bg-card
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
            bg-primary/10
            text-primary
          "
        >
          <Icon size={18} />
        </div>

        <div>

          <div
            className="
              text-sm
              font-medium
              text-white
            "
          >
            {label}
          </div>

          <div
            className="
              text-xs
              text-muted
            "
          >
            FFX ESPORTS
          </div>
        </div>
      </div>

      <div
        className="
          text-sm
          font-semibold
          text-white
        "
      >
        {value}
      </div>
    </div>
  );
}

