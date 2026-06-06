"use client";

import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
  Bell,
  ExternalLink,
  Instagram,
  ShieldCheck,
  Swords,
  Trophy,
  Twitter,
  Users,
  Wallet,
  Youtube,
  Zap
} from "lucide-react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const stats = [
  { label: "Active Players", value: "12K+", sub: "and growing daily" },
  { label: "Prize Pool Paid", value: "₹24L+", sub: "across all seasons" },
  { label: "Tournaments Held", value: "320+", sub: "since launch" },
  { label: "Platform Uptime", value: "99.9%", sub: "guaranteed reliability" },
];

const features = [
  {
    icon: Trophy,
    title: "Premium Tournaments",
    body:
      "Professionally managed Free Fire tournaments with automated brackets, live score updates, and tamper-proof match handling — built for serious competitors.",
  },
  {
    icon: Wallet,
    title: "Instant Wallet System",
    body:
      "Deposit securely, withdraw fast. Automated prize payouts hit your wallet within minutes of a verified win — no delays, no friction.",
  },
  {
    icon: ShieldCheck,
    title: "Anti-Fraud Protection",
    body:
      "Multi-layer verification, fair-play monitoring, and protected match environments ensure every tournament is 100% legitimate.",
  },
  {
    icon: Bell,
    title: "Real-Time Notifications",
    body:
      "Room IDs, payout confirmations, match reminders, and platform announcements — delivered instantly so you never miss a moment.",
  },
  {
    icon: Swords,
    title: "Competitive Matchmaking",
    body:
      "Form squads, challenge rivals in scrims, and compete in skill-rated tournaments. Climb the global leaderboard and make your name known.",
  },
  {
    icon: Zap,
    title: "Lightning Performance",
    body:
      "Built on modern cloud infrastructure with real-time systems optimised for high-concurrency esports operations — zero lag when it matters most.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Create Your Account",
    body: "Sign up in under 60 seconds. Verify your profile and join the FFX community instantly.",
  },
  {
    step: "02",
    title: "Fund Your Wallet",
    body: "Add funds securely via UPI, Paytm, or bank transfer. Your money is always protected.",
  },
  {
    step: "03",
    title: "Register & Compete",
    body: "Browse open tournaments, register solo or with your squad, and lock in your slot.",
  },
  {
    step: "04",
    title: "Win & Withdraw",
    body: "Finish strong, collect your prize automatically, and withdraw earnings in minutes.",
  },
];

const socials = [
  {
    platform: "Instagram",
    handle: "@ffxesports",
    href: "https://instagram.com/ffxesports",
    icon: Instagram,
    followers: "18K Followers",
    color: "from-pink-500/20 to-orange-500/20",
    border: "border-pink-500/20 hover:border-pink-500/40",
    text: "text-pink-400",
  },
  {
    platform: "YouTube",
    handle: "FFX Esports",
    href: "https://youtube.com/@ffxesports",
    icon: Youtube,
    followers: "9.2K Subscribers",
    color: "from-red-600/20 to-red-500/10",
    border: "border-red-500/20 hover:border-red-500/40",
    text: "text-red-400",
  },
  {
    platform: "Twitter / X",
    handle: "@ffxesports",
    href: "https://twitter.com/ffxesports",
    icon: Twitter,
    followers: "6.5K Followers",
    color: "from-sky-500/20 to-blue-500/10",
    border: "border-sky-500/20 hover:border-sky-500/40",
    text: "text-sky-400",
  },
];

const footerLinks = {
  Platform: [
    { label: "Tournaments", href: "/tournaments" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Wallet", href: "/wallet" },
    { label: "Results", href: "/results" },
  ],
  Company: [
    { label: "About FFX", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Careers", href: "/careers" },
    { label: "Press Kit", href: "/press" },
  ],
  Legal: [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Refund Policy", href: "/refunds" },
    { label: "Fair Play Policy", href: "/fairplay" },
  ],
};

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#05070d] text-white overflow-hidden">

      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/[0.08] blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-cyan-500/[0.05] blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#05070d]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5">

          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl">
              <div className="absolute inset-0 bg-blue-500/10 blur-xl" />
              <img src="/logo-1.png" alt="FFX Esports" className="relative z-10 h-10 w-10 object-contain" />
            </div>
            <div>
              <div className="text-lg font-black tracking-wide">FFX ESPORTS</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-500">COMPETITIVE PLATFORM</div>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden items-center gap-8 lg:flex">
            {["Features", "How It Works", "Tournaments", "Community"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm font-medium text-zinc-400 transition hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/[0.06]"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-bold text-black transition-all hover:scale-[1.02]"
            >
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative z-10 mx-auto flex max-w-[1400px] flex-col items-center px-6 pb-20 pt-24 text-center">

        {/* Hero Logo */}
        <div className="relative mb-10 flex justify-center">
          <div className="absolute h-32 w-32 rounded-full bg-blue-500/20 blur-[80px]" />
          <img
            src="/logo.png"
            alt="FFX Esports"
            className="relative z-10 h-20 w-auto object-contain drop-shadow-[0_0_30px_rgba(37,99,235,.35)] transition-all duration-300 hover:scale-105"
          />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-[11px] font-bold uppercase tracking-[0.32em] text-zinc-300">
          <BadgeCheck size={14} />
          India's #1 Free Fire Esports Platform
        </div>

        {/* Headline */}
        <h1 className="mt-8 max-w-5xl text-5xl font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-6xl lg:text-8xl">
          Compete.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Dominate.
          </span>{" "}
          Earn.
        </h1>

        {/* Subtitle */}
        <p className="mt-8 max-w-3xl text-lg leading-9 text-zinc-400 sm:text-xl">
          FFX Esports is India's most trusted Free Fire tournament platform — built for players who play to win.
          Compete in daily tournaments, climb skill-rated leaderboards, and withdraw real prize money instantly.
        </p>

        {/* CTAs */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-white px-7 text-base font-bold text-black transition-all hover:scale-[1.02]"
          >
            Start Playing Free <ArrowRight size={18} />
          </Link>
          <Link
            href="/tournaments"
            className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-7 text-base font-semibold text-white transition-all hover:border-white/20 hover:bg-white/[0.05]"
          >
            Browse Tournaments
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold uppercase tracking-widest text-zinc-600">
          <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-zinc-500" /> Secure Payments</span>
          <span className="h-3 w-px bg-zinc-800" />
          <span className="flex items-center gap-1.5"><BadgeCheck size={12} className="text-zinc-500" /> Verified Results</span>
          <span className="h-3 w-px bg-zinc-800" />
          <span className="flex items-center gap-1.5"><Zap size={12} className="text-zinc-500" /> Instant Payouts</span>
          <span className="h-3 w-px bg-zinc-800" />
          <span className="flex items-center gap-1.5"><Users size={12} className="text-zinc-500" /> 12,000+ Players</span>
        </div>

        {/* Stats */}
        <div className="relative mt-24 w-full overflow-hidden rounded-[40px] border border-zinc-800 bg-[#0b0d14]/90 p-8 shadow-[0_0_80px_rgba(0,0,0,.45)]">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.04] via-transparent to-cyan-500/[0.03]" />
          <div className="relative z-10 grid gap-6 lg:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="rounded-3xl border border-zinc-800 bg-white/[0.02] p-6 text-left">
                <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-500">{item.label}</div>
                <div className="mt-4 text-5xl font-black tracking-[-0.05em]">{item.value}</div>
                <div className="mt-2 text-xs text-zinc-600">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="relative z-10 mx-auto max-w-[1400px] px-6 pb-24">
        <div className="max-w-3xl">
          <div className="text-[11px] font-bold uppercase tracking-[0.32em] text-zinc-500">Platform Features</div>
          <h2 className="mt-5 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
            Everything you need
            <br />
            <span className="text-zinc-500">to compete at your best.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-zinc-500">
            FFX Esports is engineered from the ground up for competitive Free Fire — every feature designed around what real players need.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-[32px] border border-white/10 bg-[#0b0d14]/90 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-800 hover:bg-white/[0.02]"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-zinc-200 transition-all group-hover:bg-white/[0.06]">
                  <Icon size={28} />
                </div>
                <h3 className="mt-7 text-2xl font-bold tracking-tight">{feature.title}</h3>
                <p className="mt-4 text-base leading-8 text-zinc-400">{feature.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="relative z-10 mx-auto max-w-[1400px] px-6 pb-28">
        <div className="relative overflow-hidden rounded-[40px] border border-white/[0.06] bg-[#0b0d14]/80 px-8 py-16">
          <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-blue-500/[0.05] blur-[100px]" />

          <div className="relative z-10">
            <div className="text-center">
              <div className="text-[11px] font-bold uppercase tracking-[0.32em] text-zinc-500">How It Works</div>
              <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                From signup to payout
                <br />
                <span className="text-zinc-500">in four simple steps.</span>
              </h2>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {howItWorks.map((step, i) => (
                <div key={step.step} className="relative">
                  {/* connector line */}
                  {i < howItWorks.length - 1 && (
                    <div className="absolute right-0 top-7 hidden h-px w-6 bg-gradient-to-r from-zinc-700 to-transparent lg:block translate-x-full" />
                  )}
                  <div className="text-[11px] font-black tracking-[0.3em] text-blue-500/70">{step.step}</div>
                  <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-500">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMUNITY / SOCIAL ── */}
      <section id="community" className="relative z-10 mx-auto max-w-[1400px] px-6 pb-28">
        <div className="max-w-3xl">
          <div className="text-[11px] font-bold uppercase tracking-[0.32em] text-zinc-500">Community</div>
          <h2 className="mt-5 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
            Join the FFX family.
            <br />
            <span className="text-zinc-500">Follow us everywhere.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-zinc-500">
            Stay updated on new tournaments, prize announcements, highlight reels, and exclusive giveaways across all our social channels.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {socials.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.platform}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative overflow-hidden rounded-[28px] border ${s.border} bg-[#0b0d14]/90 p-7 transition-all duration-300 hover:-translate-y-1`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <Icon size={28} className={s.text} />
                    <ExternalLink size={14} className="text-zinc-600 transition group-hover:text-zinc-400" />
                  </div>
                  <div className="mt-6">
                    <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-500">{s.platform}</div>
                    <div className="mt-2 text-xl font-bold text-white">{s.handle}</div>
                    <div className="mt-1 text-sm text-zinc-500">{s.followers}</div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative z-10 mx-auto max-w-[1400px] px-6 pb-32">
        <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-[#0b0d14]/95 px-8 py-20 text-center">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.06] blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[200px] w-[300px] rounded-full bg-cyan-500/[0.04] blur-[80px]" />

          <div className="relative z-10">
            <div className="text-[11px] font-bold uppercase tracking-[0.32em] text-zinc-500">Ready to Dominate?</div>
            <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-tight tracking-[-0.05em] sm:text-6xl">
              Your next tournament
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                starts right now.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              Join 12,000+ competitive Free Fire players on FFX Esports. Create your account in 60 seconds, enter a tournament today, and compete for real prizes.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-white px-7 text-base font-bold text-black transition-all hover:scale-[1.02]"
              >
                Create Free Account <ArrowRight size={18} />
              </Link>
              <Link
                href="/tournaments"
                className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-7 text-base font-semibold text-white transition-all hover:border-white/20 hover:bg-white/[0.05]"
              >
                View Live Tournaments
              </Link>
            </div>

            <p className="mt-6 text-xs text-zinc-600">
              No hidden fees · Verified payouts · 24/7 support · India-wide access
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/[0.05] bg-[#03040a]">
        <div className="mx-auto max-w-[1400px] px-6 py-16">

          {/* Top */}
          <div className="grid gap-12 lg:grid-cols-5">

            {/* Brand col */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02]">
                  <div className="absolute inset-0 bg-blue-500/10 blur-xl" />
                  <img src="/logo-1.png" alt="FFX Esports" className="relative z-10 h-8 w-8 object-contain" />
                </div>
                <div>
                  <div className="text-sm font-black tracking-wide">FFX ESPORTS</div>
                  <div className="text-[9px] font-bold uppercase tracking-[0.35em] text-zinc-600">COMPETITIVE PLATFORM</div>
                </div>
              </div>

              <p className="mt-6 max-w-xs text-sm leading-7 text-zinc-600">
                India's most trusted Free Fire esports platform. Compete in daily tournaments, earn real prizes, and be part of the next generation of Indian gaming.
              </p>

              {/* Social icons */}
              <div className="mt-8 flex items-center gap-4">
                <a href="https://instagram.com/ffxesports" target="_blank" rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-zinc-500 transition hover:border-pink-500/30 hover:text-pink-400">
                  <Instagram size={16} />
                </a>
                <a href="https://youtube.com/@ffxesports" target="_blank" rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-zinc-500 transition hover:border-red-500/30 hover:text-red-400">
                  <Youtube size={16} />
                </a>
                <a href="https://twitter.com/ffxesports" target="_blank" rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-zinc-500 transition hover:border-sky-500/30 hover:text-sky-400">
                  <Twitter size={16} />
                </a>
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-500">{category}</div>
                <ul className="mt-5 space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href}
                        className="text-sm text-zinc-600 transition hover:text-zinc-300">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.04] pt-8 sm:flex-row">
            <p className="text-xs text-zinc-700">
              © {new Date().getFullYear()} FFX Esports. All rights reserved. Made with ❤️ in India.
            </p>
            <div className="flex items-center gap-6 text-xs text-zinc-700">
              <Link href="/terms" className="transition hover:text-zinc-400">Terms</Link>
              <Link href="/privacy" className="transition hover:text-zinc-400">Privacy</Link>
              <Link href="/refunds" className="transition hover:text-zinc-400">Refunds</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
