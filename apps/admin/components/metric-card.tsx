import type { LucideIcon } from "lucide-react";

import { Card } from "@/ui";

export function MetricCard({

  icon: Icon,

  label,

  value

}: {

  icon: LucideIcon;

  label: string;

  value: string;
}) {

  return (

    <Card
      className="
      group

      relative
      overflow-hidden

      p-4

      transition-all
      duration-300

      hover:-translate-y-1
      hover:border-cyan-400/20

      hover:shadow-[0_0_40px_rgba(34,211,238,.12)]
    "
    >

      {/* Glow Layer */}

      <div
        className="
        absolute
        inset-0

        bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.10),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(124,58,237,.10),transparent_35%)]

        opacity-0
        transition-opacity
        duration-300

        group-hover:opacity-100
      "
      />

      {/* Animated Border */}

      <div
        className="
        absolute
        inset-0

        rounded-[28px]

        border
        border-white/[0.03]

        group-hover:border-cyan-400/10
      "
      />

      <div className="relative z-10 flex items-center justify-between">

        {/* LEFT */}

        <div>

          <div
            className="
            text-xs
            font-bold

            uppercase
            tracking-[0.18em]

            text-slate-400
          "
          >
            {label}
          </div>

          <div
            className="
            mt-3

            text-2xl
            font-black

            tracking-tight

            text-white
          "
          >
            {value}
          </div>

          <div
            className="
            mt-3

            h-[2px]
            w-14

            rounded-full

            bg-[linear-gradient(90deg,#06B6D4,#2563EB,#7C3AED)]
          "
          />
        </div>

        {/* RIGHT ICON */}

        <div
          className="
          relative

          flex
          h-16
          w-16
          items-center
          justify-center

          rounded-2xl

          border
          border-cyan-400/20

          bg-[linear-gradient(135deg,rgba(34,211,238,.14),rgba(59,130,246,.08),rgba(124,58,237,.12))]

          text-cyan-200

          shadow-[0_0_30px_rgba(34,211,238,.14)]

          transition-all
          duration-300

          group-hover:scale-105
          group-hover:shadow-[0_0_40px_rgba(34,211,238,.22)]
        "
        >

          <div
            className="
            absolute
            inset-0

            rounded-2xl

            bg-[radial-gradient(circle,rgba(255,255,255,.12),transparent_70%)]
          "
          />

          <Icon
            size={24}
            className="relative z-10"
          />
        </div>
      </div>
    </Card>
  );
}