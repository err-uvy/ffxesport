import * as React from "react";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* =========================================================
   BUTTON
========================================================= */

type ButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?:
      | "primary"
      | "secondary"
      | "ghost"
      | "danger";
  };

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {

  const variants = {

    primary:
      `
      relative
      overflow-hidden
      border
      border-white/5

      bg-[linear-gradient(135deg,#06B6D4,#2563EB,#7C3AED)]

      text-white

      shadow-[0_0_30px_rgba(34,211,238,.18)]

      hover:shadow-[0_0_50px_rgba(59,130,246,.28)]

      hover:-translate-y-[1px]
      `,

    secondary:
      `
      border
      border-white/10

      bg-white/[0.04]

      text-white

      hover:border-cyan-400/30
      hover:bg-cyan-400/[0.06]
      `,

    ghost:
      `
      text-slate-300

      hover:bg-white/[0.06]
      hover:text-white
      `,

    danger:
      `
      border
      border-rose-400/20

      bg-rose-500/[0.08]

      text-rose-100

      hover:bg-rose-500/[0.16]
      `
  };

  return (
    <button
      className={cn(

        `
        inline-flex
        h-11
        items-center
        justify-center
        gap-2

        rounded-2xl

        px-5

        text-sm
        font-bold

        transition-all
        duration-300

        disabled:pointer-events-none
        disabled:opacity-50
        `,

        variants[variant],

        className
      )}

      {...props}
    />
  );
}

/* =========================================================
   CARD
========================================================= */

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {

  return (

    <div

      className={cn(

        `
        relative
        overflow-hidden

        rounded-[28px]

        border
        border-white/10

        bg-[#081120]/80

        backdrop-blur-2xl

        shadow-[0_15px_50px_rgba(0,0,0,.45)]

        before:absolute
        before:inset-0

        before:bg-[linear-gradient(180deg,rgba(255,255,255,.03),transparent)]

        before:pointer-events-none
        `,

        className
      )}

      {...props}
    />
  );
}

/* =========================================================
   INPUT
========================================================= */

export function Input(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {

  return (

    <input

      {...props}

      className={cn(

        `
        h-12
        w-full

        rounded-2xl

        border
        border-white/10

        bg-[#050B16]/80

        px-4

        text-sm
        text-white

        outline-none

        backdrop-blur-xl

        transition-all
        duration-300

        placeholder:text-slate-500

        focus:border-cyan-400/40

        focus:bg-[#07111F]

        focus:ring-4
        focus:ring-cyan-400/10
        `,

        props.className
      )}
    />
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {

  return (

    <textarea

      {...props}

      className={cn(

        `
        min-h-32
        w-full

        rounded-2xl

        border
        border-white/10

        bg-[#050B16]/80

        px-4
        py-4

        text-sm
        text-white

        outline-none

        backdrop-blur-xl

        transition-all
        duration-300

        placeholder:text-slate-500

        focus:border-cyan-400/40

        focus:bg-[#07111F]

        focus:ring-4
        focus:ring-cyan-400/10
        `,

        props.className
      )}
    />
  );
}

/* =========================================================
   BADGE
========================================================= */

export function Badge({

  className,

  tone = "blue",

  ...props

}: React.HTMLAttributes<HTMLSpanElement> & {

  tone?:
    | "blue"
    | "pink"
    | "black"
    | "green"
    | "amber";
}) {

  const tones = {

    blue:
      `
      border-white/5
      bg-cyan-400/[0.08]
      text-cyan-200
      `,

    pink:
      `
      border-fuchsia-400/20
      bg-fuchsia-500/[0.08]
      text-fuchsia-200
      `,

    black:
      `
      border-violet-400/20
      bg-violet-500/[0.08]
      text-violet-200
      `,

    green:
      `
      border-emerald-400/20
      bg-emerald-500/[0.08]
      text-emerald-200
      `,

    amber:
      `
      border-amber-300/20
      bg-amber-400/[0.08]
      text-amber-100
      `
  };

  return (

    <span

      className={cn(

        `
        inline-flex
        items-center

        rounded-full

        border

        px-3
        py-1

        text-[11px]
        font-bold

        uppercase
        tracking-[0.16em]

        backdrop-blur-xl
        `,

        tones[tone],

        className
      )}

      {...props}
    />
  );
}

/* =========================================================
   SKELETON
========================================================= */

export function Skeleton({
  className
}: {
  className?: string;
}) {

  return (

    <div

      className={cn(

        `
        animate-pulse

        rounded-2xl

        bg-white/[0.06]
        `,

        className
      )}
    />
  );
}

/* =========================================================
   PROGRESS
========================================================= */

export function Progress({

  value,

  className

}: {

  value: number;

  className?: string;
}) {

  return (

    <div

      className={cn(

        `
        h-3

        overflow-hidden

        rounded-full

        bg-white/[0.06]

        backdrop-blur-xl
        `,

        className
      )}
    >

      <div

        className="
          h-full

          rounded-full

          bg-[linear-gradient(90deg,#06B6D4,#2563EB,#7C3AED)]

          shadow-[0_0_25px_rgba(34,211,238,.35)]

          transition-all
          duration-500
        "

        style={{
          width: `${Math.max(
            0,
            Math.min(100, value)
          )}%`
        }}
      />
    </div>
  );
}