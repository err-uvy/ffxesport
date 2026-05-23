"use client";

import { useEffect, useState } from "react";

import {
  Clock,
  ImageUp,
  ShieldCheck,
} from "lucide-react";

import { toast } from "sonner";

import {
  Button,
  Card,
  Input,
} from "@/ui";

import { EmptyState } from "@/components/empty-state";
import { api, apiMessage } from "@/lib/api";

type Match = {
  id: string;

  mapName: string;

  roomId?: string | null;
  roomPassword?: string | null;

  startsAt: string;

  status: string;

  instructions: string;

  tournament: {
    title: string;
    game: string;
  };
};

export default function MatchesPage() {
  const [matches, setMatches] =
    useState<Match[]>([]);

  const [selected, setSelected] =
    useState<Match | null>(null);

  const [kills, setKills] =
    useState(0);

  const [placement, setPlacement] =
    useState(1);

  const [screenshot, setScreenshot] =
    useState<File | null>(null);

  useEffect(() => {
    loadMatches();
  }, []);

  function loadMatches() {
    api
      .get("/matches")
      .then((response) =>
        setMatches(response.data.data)
      );
  }

  async function submitResult() {
    if (!selected || !screenshot) {
      return toast.error(
        "Select match and screenshot"
      );
    }

    const body = new FormData();

    body.append("kills", String(kills));

    body.append(
      "placement",
      String(placement)
    );

    body.append(
      "screenshot",
      screenshot
    );

    try {
      await api.post(
        `/matches/${selected.id}/submit-result`,
        body,
        {
          headers: {
            "content-type":
              "multipart/form-data",
          },
        }
      );

      toast.success(
        "Result submitted for verification"
      );

      setSelected(null);

      setScreenshot(null);

      loadMatches();
    } catch (error) {
      toast.error(apiMessage(error));
    }
  }

  return (
    <div className="main-container">

      {/* HEADER */}

      <div className="mb-10">

        <p className="text-sm font-medium uppercase tracking-[0.25em] text-zinc-500">
          Match Operations
        </p>

        <h1 className="mt-3 text-5xl font-bold tracking-tight text-white">
          Matches
        </h1>

        <p className="mt-3 max-w-2xl text-zinc-400">
          Access rooms, verify participation,
          and securely upload match proofs.
        </p>
      </div>

      {matches.length ? (

        <div className="grid gap-6 xl:grid-cols-[1fr_.75fr]">

          {/* LEFT */}

          <div className="space-y-5">

            {matches.map((match) => (

              <Card
                key={match.id}
                className="
                  premium-card
                  overflow-hidden
                  p-7
                "
              >

                {/* TOP */}

                <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">

                  <div>

                    {/* BADGES */}

                    <div className="mb-5 flex flex-wrap gap-3">

                      <div
                        className="
                          rounded-full
                          border
                          border-white/5
                          bg-[#18181b]
                          px-4
                          py-2
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                          text-zinc-300
                        "
                      >
                        {match.tournament.game.replace(
                          "_",
                          " "
                        )}
                      </div>

                      <div
                        className={`
                          rounded-full
                          border
                          px-4
                          py-2
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wider

                          ${
                            match.status === "LIVE"
                              ? `
                                border-green-500/20
                                bg-green-500/10
                                text-green-400
                              `
                              : `
                                border-blue-500/20
                                bg-blue-500/10
                                text-blue-400
                              `
                          }
                        `}
                      >
                        {match.status.replace(
                          "_",
                          " "
                        )}
                      </div>
                    </div>

                    {/* TITLE */}

                    <h2 className="text-2xl font-bold text-white">
                      {match.tournament.title}
                    </h2>

                    {/* DATE */}

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-zinc-400">

                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />

                        <span className="text-sm">
                          {new Date(
                            match.startsAt
                          ).toLocaleString()}
                        </span>
                      </div>

                      <div className="h-1 w-1 rounded-full bg-zinc-700" />

                      <span className="text-sm">
                        {match.mapName}
                      </span>
                    </div>
                  </div>

                  {/* BUTTON */}

                  <Button
                    className="
                      rounded-2xl
                      bg-blue-600
                      px-5
                      py-3
                      text-sm
                      font-semibold
                      hover:bg-blue-700
                    "
                    onClick={() =>
                      setSelected(match)
                    }
                  >
                    Submit Result
                  </Button>
                </div>

                {/* ROOM */}

                <div className="mt-8 grid gap-4 sm:grid-cols-2">

                  <Room
                    label="Room ID"
                    value={
                      match.roomId ??
                      "Locked"
                    }
                  />

                  <Room
                    label="Password"
                    value={
                      match.roomPassword ??
                      "Locked"
                    }
                  />
                </div>

                {/* INSTRUCTIONS */}

                <div
                  className="
                    mt-7
                    rounded-2xl
                    border
                    border-white/5
                    bg-[#151515]
                    p-4
                  "
                >
                  <p className="text-sm leading-7 text-zinc-400">
                    {match.instructions}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* RIGHT */}

          <Card
            className="
              premium-card
              sticky
              top-6
              h-fit
              p-7
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
                  bg-blue-500/10
                  text-blue-400
                "
              >
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div>
                <p className="text-sm text-zinc-500">
                  Verification
                </p>

                <h2 className="text-2xl font-bold text-white">
                  Proof Upload
                </h2>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-zinc-400">
              Upload authentic match screenshots
              for automated verification and
              leaderboard processing.
            </p>

            {/* SELECTED */}

            <div
              className="
                mt-4
                rounded-2xl
                border
                border-white/5
                bg-[#151515]
                p-4
              "
            >
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Selected Match
              </p>

              <h3 className="mt-1 text-lg font-semibold text-white">
                {selected
                  ? selected.tournament.title
                  : "No Match Selected"}
              </h3>
            </div>

            {/* FORM */}

            <div className="mt-4 space-y-4">

              <div>
                <p className="mb-2 text-sm font-medium text-zinc-400">
                  Kills
                </p>

                <Input
                  type="number"
                  min={0}
                  value={kills}
                  onChange={(event: any) =>
                    setKills(
                      Number(
                        event.target.value
                      )
                    )
                  }
                  className="
                    h-12
                    rounded-2xl
                    border-white/5
                    bg-[#151515]
                  "
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-zinc-400">
                  Placement
                </p>

                <Input
                  type="number"
                  min={1}
                  value={placement}
                  onChange={(event: any) =>
                    setPlacement(
                      Number(
                        event.target.value
                      )
                    )
                  }
                  className="
                    h-12
                    rounded-2xl
                    border-white/5
                    bg-[#151515]
                  "
                />
              </div>

              {/* FILE */}

              <label
                className="
                  flex
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  gap-3
                  rounded-3xl
                  border
                  border-dashed
                  border-white/10
                  bg-[#151515]
                  px-6
                  py-10
                  text-center
                  transition-all
                  duration-200
                  hover:border-blue-500/30
                  hover:bg-[#181818]
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
                    bg-blue-500/10
                    text-blue-400
                  "
                >
                  <ImageUp className="h-6 w-6" />
                </div>

                <div>

                  <p className="font-semibold text-white">
                    {screenshot?.name ??
                      "Upload Screenshot"}
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    PNG, JPG up to 10MB
                  </p>
                </div>

                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(event: any) =>
                    setScreenshot(
                      event.target.files?.[0] ??
                        null
                    )
                  }
                />
              </label>

              {/* BUTTON */}

              <Button
                className="
                  h-12
                  w-full
                  rounded-2xl
                  bg-blue-600
                  text-sm
                  font-semibold
                  hover:bg-blue-700
                "
                onClick={submitResult}
              >
                Submit Proof
              </Button>
            </div>
          </Card>
        </div>

      ) : (

        <EmptyState
          icon={Clock}
          title="No Matches Assigned"
          body="Tournament rooms and competitive matches will appear after successful registration."
        />
      )}
    </div>
  );
}

function Room({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-white/5
        bg-[#151515]
        p-4
      "
    >

      <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
        {label}
      </p>

      <div className="mt-3 text-lg font-semibold text-white">
        {value}
      </div>
    </div>
  );
}