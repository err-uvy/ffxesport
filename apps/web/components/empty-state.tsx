import type { LucideIcon } from "lucide-react";
import { Card } from "@/ui";

export function EmptyState({
  icon: Icon,
  title,
  body
}: {
  icon: LucideIcon;
  title: string;
  body: string;
}) {

  return (

    <Card
      className="
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-white/10
        bg-[#081120]/80
        p-8
        backdrop-blur-2xl
      "
    >

      {/* BACKGROUND GLOW */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[260px]
          w-[260px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-cyan-500/[0.06]
          blur-[90px]
        "
      />

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
            "36px 36px"
        }}
      />

      {/* CONTENT */}

      <div
        className="
          relative
          z-10
          flex
          min-h-[320px]
          flex-col
          items-center
          justify-center
          text-center
        "
      >

        {/* ICON */}

        <div
          className="
            relative
            mb-6
          "
        >

          {/* OUTER GLOW */}

          <div
            className="
              absolute
              inset-0
              rounded-3xl
              bg-cyan-400/20
              blur-2xl
            "
          />

          {/* ICON BOX */}

          <div
            className="
              relative
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-[24px]
              border
              border-cyan-400/20
              bg-gradient-to-br
              from-cyan-400/15
              via-blue-500/10
              to-purple-500/15
              shadow-[0_0_35px_rgba(34,211,238,.15)]
              backdrop-blur-xl
            "
          >

            <Icon
              size={34}
              className="
                text-cyan-300
              "
            />
          </div>
        </div>

        {/* TITLE */}

        <h3
          className="
            text-2xl
            font-black
            tracking-tight
            text-white
          "
        >
          {title}
        </h3>

        {/* BODY */}

        <p
          className="
            mt-4
            max-w-lg
            text-sm
            leading-8
            text-slate-400
          "
        >
          {body}
        </p>

        {/* BOTTOM LINE */}

        <div
          className="
            mt-8
            h-[2px]
            w-28
            rounded-full
            bg-gradient-to-r
            from-transparent
            via-cyan-400/70
            to-transparent
          "
        />
      </div>
    </Card>
  );
}