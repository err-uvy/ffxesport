import type { LucideIcon } from "lucide-react";
import { Card } from "@/ui";

export function MetricCard({
  icon: Icon,
  label,
  value,
  detail
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
}) {

  return (

    <Card
      className="
        group
        relative
        overflow-hidden

        rounded-[26px]

        border
        border-white/8

        bg-[#0b0b0f]/95

        p-5

        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-white/20
hover:bg-[#101014]
hover:shadow-[0_0_40px_rgba(255,255,255,.04)]
      "
    >

      {/* GRID */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.025]
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

      {/* SOFT GLOW */}

      <div
        className="
          absolute
          right-0
          top-0
          h-40
          w-40
          rounded-full
          bg-blue-500/[0.05]
          blur-[90px]
        "
      />

      {/* TOP LINE */}

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-[1px]

          bg-gradient-to-r
          from-transparent
          via-blue-500/30
          to-transparent
        "
      />

      {/* CONTENT */}

      <div
        className="
          relative
          z-10

          flex
          items-start
          justify-between
          gap-4
        "
      >

        {/* LEFT */}

        <div className="flex-1">

          {/* LABEL */}

          <div
            className="
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.32em]
              text-zinc-600
transition-colors
duration-300
group-hover:text-zinc-300
            "
          >
            {label}
          </div>

          {/* VALUE */}

          <div
            className="
              mt-5

            text-[52px]
font-black
leading-none
tracking-[-0.04em]

text-zinc-100

transition-colors
duration-300

group-hover:text-white
            "
           
          >
            {value}
          </div>

          {/* DETAIL */}

          <div
            className="
              mt-5

              inline-flex
              items-center

              rounded-full

              border
             

           

              px-3
              py-1.5

              text-[10px]
              font-bold

              uppercase
              tracking-[0.22em]

              border-white/10
bg-white/[0.02]

text-zinc-500

transition-all
duration-300

group-hover:border-white/20
group-hover:bg-white/[0.05]
group-hover:text-zinc-200
            "
          >
            {detail}
          </div>
        </div>

        {/* ICON */}

        <div className="relative">

          {/* ICON GLOW */}

          <div
            className="
              absolute
              inset-0

              rounded-2xl

              bg-blue-500/[0.12]

              blur-2xl
            "
          />

          {/* ICON BOX */}

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
              

              
             border-blue-500/10

bg-gradient-to-br
from-blue-500/[0.10]
to-cyan-400/[0.04]

text-blue-300

              transition-all
              duration-300

              group-hover:scale-105
            "
          >
            <Icon size={28} />
          </div>
        </div>
      </div>
    </Card>
  );
}