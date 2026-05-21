"use client";

import { motion } from "framer-motion";

export function MiniChart({
  values
}: {
  values: number[];
}) {

  const max = Math.max(...values, 1);

  return (

    <div
      className="
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-white/10
        bg-[#081120]/80
        p-4
        backdrop-blur-2xl
      "
    >

      {/* GRID */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.04]
        "
        style={{
          backgroundImage:
            `
            linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
          `,
          backgroundSize:
            "32px 32px"
        }}
      />

      {/* GLOW */}

      <div
        className="
          absolute
          right-[-80px]
          top-[-80px]
          h-60
          w-60
          rounded-full
          bg-cyan-500/[0.06]
          blur-[120px]
        "
      />

      {/* TOP LINE */}

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

      {/* CHART */}

      <div
        className="
          relative
          z-10
          flex
          h-52
          items-end
          gap-3
        "
      >

        {values.map((value, index) => (

          <div
            key={`${value}-${index}`}
            className="
              relative
              flex
              flex-1
              items-end
              justify-center
            "
          >

            {/* BAR GLOW */}

            <div
              className="
                absolute
                bottom-0
                w-full
                rounded-full
                bg-cyan-400/20
                blur-xl
              "
              style={{
                height:
                  `${Math.max(
                    12,
                    (value / max) * 100
                  )}%`
              }}
            />

            {/* BAR */}

            <motion.div
              className="
                relative
                w-full
                rounded-t-[18px]
                border
                border-cyan-400/10
                bg-gradient-to-t
                from-cyan-400
                via-blue-500
                to-purple-500
                shadow-[0_0_20px_rgba(34,211,238,.15)]
              "
              initial={{
                height: 0,
                opacity: 0
              }}
              animate={{
                height:
                  `${Math.max(
                    12,
                    (value / max) * 100
                  )}%`,
                opacity: 1
              }}
              transition={{
                delay: index * 0.05,
                duration: 0.7,
                type: "spring",
                stiffness: 90
              }}
            >

              {/* SHINE */}

              <div
                className="
                  absolute
                  inset-x-0
                  top-0
                  h-10
                  rounded-t-[18px]
                  bg-gradient-to-b
                  from-white/30
                  to-transparent
                "
              />

            </motion.div>
          </div>
        ))}
      </div>

      {/* BOTTOM LABELS */}

      <div
        className="
          relative
          z-10
          mt-4
          flex
          justify-between
          px-1
          text-[10px]
          font-bold
          uppercase
          tracking-[0.25em]
          text-slate-500
        "
      >
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
        <span>Jul</span>
        <span>Aug</span>
        <span>Sep</span>
        <span>Oct</span>
        <span>Nov</span>
        <span>Dec</span>
      </div>
    </div>
  );
}