"use client";

import { motion } from "framer-motion";

export function MiniChart({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex h-40 items-end gap-2 rounded-lg border border-white/10 bg-[#070B14]/55 p-4">
      {values.map((value, index) => (
        <motion.div
          key={`${value}-${index}`}
          className="flex-1 rounded-t-md bg-[linear-gradient(180deg,#00E5FF,#7C3AED,#FF0080)]"
          initial={{ height: 0 }}
          animate={{ height: `${Math.max(8, (value / max) * 100)}%` }}
          transition={{ delay: index * 0.04, type: "spring", stiffness: 90 }}
        />
      ))}
    </div>
  );
}
