"use client";

import { motion } from "framer-motion";

const particles = Array.from(
  { length: 55 },
  (_, index) => ({
    id: index,

    left:
      `${(index * 17) % 100}%`,

    top:
      `${(index * 11) % 100}%`,

    delay:
      (index % 10) * 0.35,

    duration:
      7 + (index % 6),

    size:
      2 + (index % 5)
  })
);

export function ParticleField() {

  return (

    <div
      className="
        pointer-events-none
        fixed
        inset-0
        -z-10
        overflow-hidden
        bg-[#050816]
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
            "42px 42px"
        }}
      />

      {/* MAIN BACKGROUND */}

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top,rgba(34,211,238,.08),transparent_28%),linear-gradient(180deg,#050816_0%,#070d1d_55%,#050816_100%)]
        "
      />

      {/* CYAN GLOW */}

      <motion.div
        className="
          absolute
          left-[-180px]
          top-[-180px]
          h-[520px]
          w-[520px]
          rounded-full
          bg-cyan-500/[0.12]
          blur-[140px]
        "
        animate={{
          x: [0, 40, 0],
          y: [0, 20, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* BLUE GLOW */}

      <motion.div
        className="
          absolute
          right-[-200px]
          top-[10%]
          h-[480px]
          w-[480px]
          rounded-full
          bg-blue-600/[0.10]
          blur-[140px]
        "
        animate={{
          x: [0, -50, 0],
          y: [0, 30, 0]
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* PURPLE GLOW */}

      <motion.div
        className="
          absolute
          bottom-[-220px]
          left-[30%]
          h-[520px]
          w-[520px]
          rounded-full
          bg-purple-600/[0.10]
          blur-[160px]
        "
        animate={{
          x: [0, 30, 0],
          y: [0, -25, 0]
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* LIGHT BEAMS */}

      <div
        className="
          absolute
          left-0
          top-0
          h-[1px]
          w-full
          bg-gradient-to-r
          from-transparent
          via-cyan-400/40
          to-transparent
        "
      />

      <div
        className="
          absolute
          bottom-0
          left-0
          h-[1px]
          w-full
          bg-gradient-to-r
          from-transparent
          via-blue-400/30
          to-transparent
        "
      />

      {/* PARTICLES */}

      {particles.map((particle) => (

        <motion.span
          key={particle.id}

          className="
            absolute
            rounded-full
            bg-cyan-300
            shadow-[0_0_14px_rgba(34,211,238,.85)]
          "

          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size
          }}

          animate={{
            y: [-10, -120],
            opacity: [0, 1, 0],
            scale: [0.8, 1.4, 0.8]
          }}

          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* FLOATING DOTS */}

      {Array.from({ length: 12 }).map(
        (_, index) => (

          <motion.div
            key={index}

            className="
              absolute
              rounded-full
              border
              border-cyan-400/10
              bg-cyan-400/[0.04]
              backdrop-blur-xl
            "

            style={{
              width:
                120 + index * 12,

              height:
                120 + index * 12,

              left:
                `${(index * 8) % 100}%`,

              top:
                `${(index * 14) % 100}%`
            }}

            animate={{
              y: [0, -20, 0],
              opacity: [0.15, 0.3, 0.15]
            }}

            transition={{
              duration: 8 + index,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )
      )}
    </div>
  );
}