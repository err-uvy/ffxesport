"use client";

import { motion } from "framer-motion";

const particles = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  top: `${(index * 23) % 100}%`,
  delay: (index % 9) * 0.34,
  size: 2 + (index % 4)
}));

export function ParticleField() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#070B14] gaming-grid">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(0,229,255,.16),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(255,0,128,.12),transparent_26%),linear-gradient(180deg,rgba(7,11,20,.2),#070B14_82%)]" />
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-cyan-200 shadow-[0_0_14px_rgba(34,211,238,.75)]"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size
          }}
          animate={{ y: [-12, -80], opacity: [0.2, 0.9, 0.1] }}
          transition={{
            duration: 8 + (particle.id % 5),
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}
