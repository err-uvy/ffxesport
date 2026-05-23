"use client";

import { useEffect, useState } from "react";
import { Crown } from "lucide-react";

import { Button, Card } from "@/ui";
import { formatMoney } from "@ffx/utils";

import { EmptyState } from "@/components/empty-state";
import { api } from "@/lib/api";

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
    useState<(typeof views)[number]>("global");

  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    api
      .get(`/leaderboard/${view}`)
      .then((response) =>
        setRows(response.data.data)
      );
  }, [view]);

  return (
    <div className="main-container">

      {/* HEADER */}

      <div className="mb-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-zinc-500">
            Competitive Rankings
          </p>

          <h1 className="mt-3 text-5xl font-bold tracking-tight text-white">
            Leaderboards
          </h1>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Real-time performance rankings across tournaments,
            earnings, eliminations, and clan dominance.
          </p>
        </div>

        {/* FILTER BUTTONS */}

        <div className="flex flex-wrap gap-3">

          {views.map((item) => (
            <button
              key={item}
              onClick={() => setView(item)}
              className={`
                rounded-2xl
                border
                px-5
                py-3
                text-sm
                font-semibold
                capitalize
                transition-all
                duration-200

                ${
                  view === item
                    ? `
                      border-blue-500/30
                      bg-blue-500
                      text-white
                      shadow-lg
                    `
                    : `
                      border-white/5
                      bg-[#111111]
                      text-zinc-400
                      hover:border-white/10
                      hover:bg-[#151515]
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

      {/* TABLE */}

      <Card className="premium-card overflow-hidden">

        {rows.length ? (

          <div className="divide-y divide-white/5">

            {rows.map((row, index) => {

              const name =
                row.user?.username ??
                row.name ??
                row.handle ??
                "Player";

              const subtext =
                row.tag ??
                row.uid ??
                `Score ${
                  row.score ??
                  row._sum?.score ??
                  0
                }`;

              const value = row.earnings
                ? formatMoney(row.earnings)
                : `${
                    row.kills ??
                    row._sum?.kills ??
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
                    flex
                    items-center
                    justify-between
                    gap-4
                    px-6
                    py-5
                    transition-all
                    duration-200
                    hover:bg-[#151515]
                  "
                >

                  {/* LEFT */}

                  <div className="flex items-center gap-5">

                    {/* RANK */}

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
                              border-white/5
                              bg-[#18181b]
                              text-zinc-300
                            `
                        }
                      `}
                    >
                      {index === 0 ? (
                        <Crown className="h-5 w-5" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    {/* PLAYER */}

                    <div>

                      <h3 className="text-lg font-semibold text-white">
                        {name}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-500">
                        {subtext}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}

                  <div
                    className="
                      rounded-2xl
                      border
                      border-white/5
                      bg-[#18181b]
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      text-zinc-200
                    "
                  >
                    {value}
                  </div>
                </div>
              );
            })}

          </div>

        ) : (

          <div className="p-12">

            <EmptyState
              icon={Crown}
              title="Leaderboard Empty"
              body="Verified competitive rankings will appear after tournament completion."
            />

          </div>
        )}

      </Card>
    </div>
  );
}