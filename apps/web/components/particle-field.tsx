"use client";

import { motion } from "framer-motion";

const particles = Array.from({ length: 70 }, (_, index) => ({
id: index,
left: `${(index * 13) % 100}%`,
top: `${(index * 9) % 100}%`,
delay: (index % 10) * 0.3,
duration: 8 + (index % 6),
size: 2 + (index % 4)
}));

export function ParticleField() {
return ( <div
   className="
     pointer-events-none
     fixed
     inset-0
     -z-10
     overflow-hidden
   "
 >
{/* GRID */} <div className="absolute inset-0 grid-fade opacity-40" />

```
  {/* MAIN BACKGROUND */}
  <div
    className="
      absolute
      inset-0
      bg-[radial-gradient(circle_at_10%_0%,rgba(0,229,255,.16),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(139,92,246,.14),transparent_28%),linear-gradient(135deg,#050816_0%,#0b1120_55%,#050816_100%)]
    "
  />

  {/* CYAN ORB */}
  <motion.div
    className="
      absolute
      -left-40
      -top-40
      h-[550px]
      w-[550px]
      rounded-full
      bg-primary/10
      blur-[160px]
    "
    animate={{
      x: [0, 40, 0],
      y: [0, 25, 0]
    }}
    transition={{
      duration: 14,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />

  {/* BLUE ORB */}
  <motion.div
    className="
      absolute
      right-[-220px]
      top-[10%]
      h-[520px]
      w-[520px]
      rounded-full
      bg-blue-500/10
      blur-[160px]
    "
    animate={{
      x: [0, -40, 0],
      y: [0, 30, 0]
    }}
    transition={{
      duration: 16,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />

  {/* PURPLE ORB */}
  <motion.div
    className="
      absolute
      bottom-[-220px]
      left-[30%]
      h-[560px]
      w-[560px]
      rounded-full
      bg-violet-500/10
      blur-[180px]
    "
    animate={{
      x: [0, 25, 0],
      y: [0, -30, 0]
    }}
    transition={{
      duration: 18,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />

  {/* TOP LIGHT BAR */}
  <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

  {/* PARTICLES */}
  {particles.map((particle) => (
    <motion.span
      key={particle.id}
      className="
        absolute
        rounded-full
        bg-cyan-300
        shadow-[0_0_18px_rgba(0,229,255,.9)]
      "
      style={{
        left: particle.left,
        top: particle.top,
        width: particle.size,
        height: particle.size
      }}
      animate={{
        y: [-10, -140],
        opacity: [0, 1, 0],
        scale: [0.8, 1.5, 0.8]
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  ))}
</div>


);
}
