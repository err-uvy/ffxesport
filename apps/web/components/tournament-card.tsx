import Link from "next/link";

import {
  Clock,
  Gamepad2,
  Trophy,
  Users
} from "lucide-react";

import {
  Badge,
  Button,
  Card,
  Progress
} from "@/ui";

import { formatMoney } from "@ffx/utils";

export type Tournament = {
  id: string;
  title: string;
  slug: string;
  game: string;
  mode: string;
  entryFee: string | number;
  prizePool: string | number;
  maxSlots: number;
  filledSlots: number;
  startsAt: string;
  status: string;
  bannerUrl?: string | null;
};

export function TournamentCard({
  tournament,
  onJoin
}: {
  tournament: Tournament;
  onJoin?: (id: string) => void;
}) {

  const slots = Math.round(
    (tournament.filledSlots /
      tournament.maxSlots) * 100
  );

  return (

    <Card
      className="
        group
        relative
        overflow-hidden
        rounded-[30px]
        border
        border-white/10
        bg-[#081120]/80
        backdrop-blur-2xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-cyan-400/20
        hover:shadow-[0_0_50px_rgba(34,211,238,.12)]
      "
    >

      {/* BACKGROUND GRID */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.03]
        "
        style={{
          backgroundImage:
            `
            linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
          `,
          backgroundSize:
            "34px 34px"
        }}
      />

      {/* TOP LIGHT */}

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-[2px]
          bg-gradient-to-r
          from-transparent
          via-cyan-400/70
          to-transparent
        "
      />

      {/* HERO IMAGE */}

      <div
        className="
          relative
          h-52
          overflow-hidden
        "
      >

        {/* IMAGE */}

        <div
          className="
            absolute
            inset-0
            scale-100
            bg-cover
            bg-center
            transition-transform
            duration-500
            group-hover:scale-105
          "
          style={{
            backgroundImage:
              `
              linear-gradient(
                180deg,
                rgba(0,0,0,.1),
                rgba(0,0,0,.75)
              ),
              linear-gradient(
                135deg,
                rgba(34,211,238,.30),
                rgba(59,130,246,.15),
                rgba(147,51,234,.20)
              ),
              url(${
                tournament.bannerUrl ??
                "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"
              })
            `
          }}
        />

        {/* GLOW */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#081120]
            via-transparent
            to-transparent
          "
        />

        {/* BADGES */}

        <div
          className="
            absolute
            left-4
            top-4
            flex
            flex-wrap
            gap-2
          "
        >

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

        {/* TITLE */}

        <div
          className="
            absolute
            bottom-5
            left-5
            right-5
          "
        >

          <h3
            className="
              text-2xl
              font-black
              leading-tight
              text-white
            "
          >
            {tournament.title}
          </h3>

          <div
            className="
              mt-1
              flex
              items-center
              gap-2
              text-xs
              uppercase
              tracking-[0.22em]
              text-cyan-300
            "
          >

            <span
              className="
                h-2
                w-2
                rounded-full
                bg-cyan-400
                shadow-[0_0_10px_rgba(34,211,238,1)]
              "
            />

            LIVE ESPORTS EVENT
          </div>
        </div>
      </div>

      {/* CONTENT */}

      <div
        className="
          relative
          z-10
          p-4
        "
      >

        {/* STATS */}

        <div
          className="
            grid
            grid-cols-2
            gap-3
          "
        >

          <StatBox
            icon={Trophy}
            label="Prize Pool"
            value={formatMoney(
              tournament.prizePool
            )}
            iconColor="text-yellow-300"
          />

          <StatBox
            icon={Gamepad2}
            label="Entry Fee"
            value={
              Number(
                tournament.entryFee
              )
                ? formatMoney(
                    tournament.entryFee
                  )
                : "FREE"
            }
            iconColor="text-pink-300"
          />

          <StatBox
            icon={Users}
            label="Players"
            value={`${tournament.filledSlots}/${tournament.maxSlots}`}
            iconColor="text-cyan-300"
          />

          <StatBox
            icon={Clock}
            label="Starts"
            value={new Date(
              tournament.startsAt
            ).toLocaleDateString()}
            iconColor="text-blue-300"
          />
        </div>

        {/* PROGRESS */}

        <div className="mt-4">

          <div
            className="
              mb-2
              flex
              items-center
              justify-between
              text-xs
              font-bold
              uppercase
              tracking-[0.18em]
              text-slate-400
            "
          >
            <span>Slot Fill</span>
            <span>{slots}%</span>
          </div>

          <Progress
            value={slots}
            className="h-3"
          />
        </div>

        {/* BUTTONS */}

        <div
          className="
            mt-4
            flex
            gap-3
          "
        >

          <Button
            className="
              flex-1
            "
            onClick={() =>
              onJoin?.(
                tournament.id
              )
            }
          >
            Join Now
          </Button>

          <Link
            href={`/tournaments/${tournament.slug}`}

            className="
              inline-flex
              h-11
              flex-1
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white/[0.04]
              px-4
              text-sm
              font-bold
              text-white
              transition-all
              duration-300
              hover:border-cyan-400/30
              hover:bg-cyan-400/[0.08]
            "
          >
            View Details
          </Link>
        </div>
      </div>
    </Card>
  );
}

function StatBox({
  icon: Icon,
  label,
  value,
  iconColor
}: {
  icon: any;
  label: string;
  value: string;
  iconColor: string;
}) {

  return (

    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/[0.03]
        p-4
        backdrop-blur-xl
      "
    >

      <div
        className="
          flex
          items-center
          gap-2
        "
      >

        <Icon
          size={16}
          className={iconColor}
        />

        <span
          className="
            text-[11px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-slate-500
          "
        >
          {label}
        </span>
      </div>

      <div
        className="
          mt-3
          text-lg
          font-black
          text-white
        "
      >
        {value}
      </div>
    </div>
  );
}