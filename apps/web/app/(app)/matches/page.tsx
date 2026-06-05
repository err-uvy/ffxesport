"use client";

import {
  useEffect,
  useState
} from "react";

import {
  Clock,
  ImageUp,
  ShieldCheck,
  Swords,
  Trophy,
  Users,
  Gamepad2
} from "lucide-react";

import {
  toast
} from "sonner";

import {
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
        setMatches(
          response.data.data
        )
      );
  }

  async function submitResult() {

    if (
      !selected ||
      !screenshot
    ) {

      return toast.error(
        "Select match and screenshot"
      );
    }

    const body =
      new FormData();

    body.append(
      "kills",
      String(kills)
    );

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
              "multipart/form-data"
          }
        }
      );

      toast.success(
        "Result submitted successfully"
      );

      setSelected(null);

      setScreenshot(null);

      loadMatches();

    } catch (error) {

      toast.error(
        apiMessage(error)
      );
    }
  }

  return (
    <div className="space-y-6 pb-10">

      {/* HEADER */}

      <PageHeader
        eyebrow="Tournament Operations"
        title="Matches"
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
            Active Matches
          </div>

          <div
            className="
              mt-1
              text-2xl
              font-bold
              text-white
            "
          >
            {matches.length}
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
              FFX Match Center
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
              Competitive match
              operations & result
              verification.
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
              Access room credentials,
              join battle matches,
              and upload verified screenshots
              for automated tournament scoring.
            </p>

            {/* STATS */}

            <div
              className="
                mt-8
                grid
                gap-4
                sm:grid-cols-2
                xl:grid-cols-4
              "
            >

              <QuickCard
                icon={Gamepad2}
                label="Live Rooms"
                value={String(
                  matches.length
                )}
              />

              <QuickCard
                icon={Users}
                label="Competitive"
                value="Realtime"
              />

              <QuickCard
                icon={ShieldCheck}
                label="Verification"
                value="Secure"
              />

              <QuickCard
                icon={Trophy}
                label="Scoring"
                value="Automated"
              />
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
                  Match Status
                </div>

                <div
                  className="
                    mt-2
                    text-3xl
                    font-bold
                    text-white
                  "
                >
                  Live Ops
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
                <Swords size={30} />
              </div>
            </div>

            <div className="mt-8 space-y-4">

              <InfoRow
                icon={Clock}
                title="Realtime Rooms"
              />

              <InfoRow
                icon={ShieldCheck}
                title="Verified Proofs"
              />

              <InfoRow
                icon={ImageUp}
                title="Screenshot Upload"
              />

              <InfoRow
                icon={Trophy}
                title="Leaderboard Sync"
              />
            </div>
          </div>
        </div>
      </section>

      {matches.length ? (

        <div
          className="
            grid
            gap-6
            xl:grid-cols-[1fr_380px]
          "
        >

          {/* MATCH LIST */}

          <div className="space-y-5">

            {matches.map((match) => (

              <Card
                key={match.id}
                className="
                  rounded-[30px]
                  border
                  border-border
                  bg-card
                  p-6
                "
              >

                <div
                  className="
                    flex
                    flex-col
                    gap-6
                    xl:flex-row
                    xl:items-start
                    xl:justify-between
                  "
                >

                  {/* LEFT */}

                  <div>

                    {/* BADGES */}

                    <div
                      className="
                        mb-5
                        flex
                        flex-wrap
                        gap-3
                      "
                    >

                      <div
                        className="
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
                          tracking-[0.25em]

                          ${
                            match.status ===
                            "LIVE"
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

                    <h2
                      className="
                        text-2xl
                        font-bold
                        text-white
                      "
                    >
                      {match.tournament.title}
                    </h2>

                    {/* META */}

                    <div
                      className="
                        mt-4
                        flex
                        flex-wrap
                        items-center
                        gap-3
                        text-sm
                        text-muted
                      "
                    >

                      <div className="flex items-center gap-2">

                        <Clock
                          className="
                            h-4
                            w-4
                          "
                        />

                        {new Date(
                          match.startsAt
                        ).toLocaleString()}
                      </div>

                      <div
                        className="
                          h-1
                          w-1
                          rounded-full
                          bg-border
                        "
                      />

                      <div>
                        {match.mapName}
                      </div>
                    </div>
                  </div>

                  {/* BUTTON */}

                  <Button
                    onClick={() =>
                      setSelected(
                        match
                      )
                    }
                    className="
                      h-12
                      rounded-2xl
                      bg-primary
                      px-5
                      font-semibold
                    "
                  >
                    Submit Result
                  </Button>
                </div>

                {/* ROOMS */}

                <div
                  className="
                    mt-8
                    grid
                    gap-4
                    sm:grid-cols-2
                  "
                >

                  <RoomCard
                    label="Room ID"
                    value={
                      match.roomId ??
                      "Locked"
                    }
                  />

                  <RoomCard
                    label="Password"
                    value={
                      match.roomPassword ??
                      "Locked"
                    }
                  />
                </div>

                {/* RULES */}

                <div
                  className="
                    mt-6
                    rounded-3xl
                    border
                    border-border
                    bg-background-secondary
                    p-5
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
                    Instructions
                  </div>

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-7
                      text-muted
                    "
                  >
                    {match.instructions}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* SIDEBAR */}

          <Card
            className="
              sticky
              top-6
              h-fit
              rounded-[30px]
              border
              border-border
              bg-card
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
                  bg-primary/10
                  text-primary
                "
              >
                <ShieldCheck
                  className="
                    h-6
                    w-6
                  "
                />
              </div>

              <div>

                <div
                  className="
                    text-sm
                    text-muted
                  "
                >
                  Match Verification
                </div>

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-white
                  "
                >
                  Proof Upload
                </h2>
              </div>
            </div>

            <p
              className="
                mt-4
                text-sm
                leading-7
                text-muted
              "
            >
              Upload valid screenshots
              for automated result processing
              and leaderboard synchronization.
            </p>

            {/* SELECTED */}

            <div
              className="
                mt-5
                rounded-3xl
                border
                border-border
                bg-background-secondary
                p-5
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
                Selected Match
              </div>

              <div
                className="
                  mt-2
                  text-lg
                  font-semibold
                  text-white
                "
              >
                {selected
                  ? selected
                      .tournament
                      .title
                  : "No Match Selected"}
              </div>
            </div>

            {/* FORM */}

            <div className="mt-5 space-y-4">

              <div>

                <div
                  className="
                    mb-2
                    text-sm
                    font-medium
                    text-white
                  "
                >
                  Kills
                </div>

                <Input
                  type="number"
                  min={0}
                  value={kills}
                  onChange={(
                    event: any
                  ) =>
                    setKills(
                      Number(
                        event.target
                          .value
                      )
                    )
                  }
                  className="
                    h-12
                    rounded-2xl
                    border-border
                    bg-background-secondary
                  "
                />
              </div>

              <div>

                <div
                  className="
                    mb-2
                    text-sm
                    font-medium
                    text-white
                  "
                >
                  Placement
                </div>

                <Input
                  type="number"
                  min={1}
                  value={placement}
                  onChange={(
                    event: any
                  ) =>
                    setPlacement(
                      Number(
                        event.target
                          .value
                      )
                    )
                  }
                  className="
                    h-12
                    rounded-2xl
                    border-border
                    bg-background-secondary
                  "
                />
              </div>

              {/* UPLOAD */}

              <label
                className="
                  flex
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  gap-4
                  rounded-3xl
                  border
                  border-dashed
                  border-border
                  bg-background-secondary
                  px-6
                  py-10
                  text-center
                  transition-all
                  hover:border-primary/40
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
                    bg-primary/10
                    text-primary
                  "
                >
                  <ImageUp
                    className="
                      h-6
                      w-6
                    "
                  />
                </div>

                <div>

                  <div
                    className="
                      font-semibold
                      text-white
                    "
                  >
                    {screenshot?.name ??
                      "Upload Screenshot"}
                  </div>

                  <div
                    className="
                      mt-1
                      text-sm
                      text-muted
                    "
                  >
                    PNG or JPG • Max 10MB
                  </div>
                </div>

                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(
                    event: any
                  ) =>
                    setScreenshot(
                      event.target
                        .files?.[0] ??
                        null
                    )
                  }
                />
              </label>

              <Button
                onClick={
                  submitResult
                }
                className="
                  h-12
                  w-full
                  rounded-2xl
                  bg-primary
                  font-semibold
                "
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
          body="Tournament rooms and match operations will appear after successful registration."
        />
      )}
    </div>
  );
}

function QuickCard({
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
        border-border
        bg-background-secondary
        p-4
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
          tracking-[0.25em]
          text-muted
        "
      >
        {label}
      </div>

      <div
        className="
          mt-1
          text-2xl
          font-bold
          text-white
        "
      >
        {value}
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  title
}: {
  icon: any;
  title: string;
}) {

  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-border
        bg-card
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
        <Icon size={18} />
      </div>

      <div
        className="
          text-sm
          font-medium
          text-white
        "
      >
        {title}
      </div>
    </div>
  );
}

function RoomCard({
  label,
  value
}: {
  label: string;
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
          mt-3
          text-lg
          font-semibold
          text-white
        "
      >
        {value}
      </div>
    </div>
  );
}

