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
        rounded-[32px]
        border
        border-white/[0.06]
        bg-[#0B0F19]
        p-8
        shadow-[0_10px_60px_rgba(0,0,0,0.45)]
      "
    >

      {/* BACKGROUND */}

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_45%)]
        "
      />

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
            "42px 42px"
        }}
      />

      {/* CONTENT */}

      <div
        className="
          relative
          z-10
          flex
          min-h-[340px]
          flex-col
          items-center
          justify-center
          text-center
        "
      >

        {/* ICON */}

        <div className="relative mb-8">

          {/* GLOW */}

          <div
            className="
              absolute
              inset-0
              rounded-[30px]
              bg-blue-500/20
              blur-3xl
            "
          />

          {/* BOX */}

          <div
            className="
              relative
              flex
              h-24
              w-24
              items-center
              justify-center
              rounded-[28px]
              border
              border-white/[0.08]
              bg-gradient-to-br
              from-[#131A2A]
              to-[#0F172A]
              shadow-[0_0_40px_rgba(37,99,235,0.18)]
            "
          >

            <Icon
              size={38}
              className="
                text-blue-400
              "
            />
          </div>
        </div>

        {/* EYEBROW */}

        <div
          className="
            rounded-full
            border
            border-blue-500/20
            bg-blue-500/10
            px-4
            py-2
            text-[11px]
            font-bold
            uppercase
            tracking-[0.35em]
            text-blue-300
          "
        >
          FFX ESPORTS
        </div>

        {/* TITLE */}

        <h3
          className="
            mt-6
            text-3xl
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
            max-w-xl
            text-sm
            leading-8
            text-zinc-400
          "
        >
          {body}
        </p>

        {/* ACTION HINT */}

        <div
          className="
            mt-8
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-white/[0.06]
            bg-[#111827]
            px-5
            py-3
            text-xs
            font-semibold
            uppercase
            tracking-[0.2em]
            text-zinc-500
          "
        >
          Waiting For Activity
        </div>

        {/* LINE */}

        <div
          className="
            mt-8
            h-[2px]
            w-32
            rounded-full
            bg-gradient-to-r
            from-transparent
            via-blue-500
            to-transparent
          "
        />
      </div>
    </Card>
  );
}