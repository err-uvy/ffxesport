"use client";

import { motion } from "framer-motion";

export function MiniChart({
values
}: {
values: number[];
}) {
const max = Math.max(...values, 1);

return ( <div
   className="
     glass-panel
     gradient-border
     relative
     overflow-hidden
     rounded-[30px]
     p-5
   "
 >
{/* GRID */}
<div
className="absolute inset-0 opacity-[0.04]"
style={{
backgroundImage: `             linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
          `,
backgroundSize: "34px 34px"
}}
/>

```
  {/* CYAN ORB */}
  <div
    className="
      pointer-events-none
      absolute
      -right-20
      -top-20
      h-64
      w-64
      rounded-full
      bg-primary/10
      blur-[120px]
    "
  />

  {/* PURPLE ORB */}
  <div
    className="
      pointer-events-none
      absolute
      -left-10
      bottom-0
      h-40
      w-40
      rounded-full
      bg-violet-500/10
      blur-[100px]
    "
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
      via-cyan-400/80
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
            bg-cyan-400/25
            blur-xl
          "
          style={{
            height: `${Math.max(
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
            border-cyan-400/15
            bg-gradient-to-t
            from-cyan-400
            via-blue-500
            to-violet-500
            shadow-[0_0_24px_rgba(0,229,255,.18)]
          "
          initial={{
            height: 0,
            opacity: 0
          }}
          animate={{
            height: `${Math.max(
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

  {/* LABELS */}
  <div
    className="
      relative
      z-10
      mt-5
      flex
      justify-between
      px-1
      text-[10px]
      font-semibold
      uppercase
      tracking-[0.25em]
      text-cyan-200/60
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
