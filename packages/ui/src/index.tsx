import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  const variants = {
    primary:
      "bg-[linear-gradient(135deg,#7C3AED,#00E5FF,#FF0080)] text-white shadow-[0_0_28px_rgba(34,211,238,.28)] hover:shadow-[0_0_42px_rgba(255,0,128,.32)]",
    secondary:
      "border border-blue-300/25 bg-white/8 text-white hover:border-blue-300/60 hover:bg-white/12",
    ghost: "text-slate-200 hover:bg-white/10",
    danger: "border border-rose-400/30 bg-rose-500/15 text-rose-100 hover:bg-rose-500/25"
  };

  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/5 bg-[#0F172A] shadow-xl shadow-black/20 backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-11 w-full rounded-lg border border-white/10 bg-[#020817]/70 px-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-300/70 focus:ring-2 focus:ring-blue-300/15",
        props.className
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-28 w-full rounded-lg border border-white/10 bg-[#020817]/70 px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-300/70 focus:ring-2 focus:ring-blue-300/15",
        props.className
      )}
    />
  );
}

export function Badge({
  className,
  tone = "blue",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: "blue" | "pink" | "black" | "green" | "amber" }) {
  const tones = {
    blue: "border-blue-300/30 bg-blue-300/10 text-blue-100",
    pink: "border-pink-400/30 bg-pink-500/10 text-pink-100",
    black: "border-violet-400/30 bg-violet-500/10 text-violet-100",
    green: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
    amber: "border-amber-300/30 bg-amber-400/10 text-amber-100"
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-1 text-xs font-semibold uppercase tracking-wide",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-white/10", className)} />;
}

export function Progress({
  value,
  className
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-white/10", className)}>
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,#00E5FF,#7C3AED,#FF0080)] transition-all"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
