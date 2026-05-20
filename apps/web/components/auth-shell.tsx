import { ParticleField } from "./particle-field";

export function AuthShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <main className="min-h-screen overflow-hidden px-4 py-8 text-white sm:px-6">
      <ParticleField />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <section className="grid w-full items-center gap-8 lg:grid-cols-[1fr_440px]">
          <div className="hidden lg:block">
            <div className="mb-6 inline-flex rounded-md border border-blue-300/20 bg-blue-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
              FFX ESPORTS
            </div>
            <h1 className="max-w-2xl text-5xl font-black leading-tight text-white xl:text-6xl">
              Battle royale tournaments locked, verified, and built for serious squads.
            </h1>
            <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
              {["Free Fire", "BGMI", "CODM", "Valorant", "Wallet", "Live Rooms"].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-[#0F172A] px-4 py-3 text-sm font-semibold text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rgb-border rounded-xl">
            <div className="glass-panel rounded-xl p-6 shadow-neon sm:p-8">
              <div className="mb-7">
                <div className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-blue-200">FFX ESPORTS</div>
                <h2 className="text-2xl font-black text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
              </div>
              {children}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
