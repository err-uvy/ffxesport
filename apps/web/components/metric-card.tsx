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
        rounded-[28px]
        border
        border-white/10
        bg-[#081120]/80
        p-4
        backdrop-blur-2xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-cyan-400/20
        hover:shadow-[0_0_40px_rgba(34,211,238,.12)]
      "
    >

      {/* GRID */}

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

      {/* GLOW */}

      <div
        className="
          absolute
          right-[-50px]
          top-[-50px]
          h-40
          w-40
          rounded-full
          bg-cyan-400/[0.08]
          blur-[80px]
        "
      />

      {/* TOP BORDER */}

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

        <div>

          <div
            className="
              text-xs
              font-bold
              uppercase
              tracking-[0.25em]
              text-slate-500
            "
          >
            {label}
          </div>

          <div
            className="
              mt-3
              text-4xl
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
              inline-flex
              items-center
              rounded-full
              border
              border-cyan-400/10
              bg-cyan-400/[0.06]
              px-3
              py-1
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-cyan-300
            "
          >
            {detail}
          </div>
        </div>

        {/* RIGHT ICON */}

        <div
          className="
            relative
          "
        >

          {/* ICON GLOW */}

          <div
            className="
              absolute
              inset-0
              rounded-2xl
              bg-cyan-400/20
              blur-xl
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
              border-cyan-400/20
              bg-gradient-to-br
              from-cyan-400/15
              via-blue-500/10
              to-purple-500/15
              text-cyan-300
              shadow-[0_0_25px_rgba(34,211,238,.15)]
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