import { ParticleField } from "./particle-field";

export function AuthShell({
  children,
  title,
  subtitle
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {

  return (

    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#050816]
        px-4
        py-8
        text-white
        sm:px-6
      "
    >

      {/* PARTICLES */}

      <ParticleField />

      {/* GRID BACKGROUND */}

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
            "40px 40px"
        }}
      />

      {/* GLOW EFFECTS */}

      <div
        className="
          absolute
          left-[-120px]
          top-[-120px]
          h-[320px]
          w-[320px]
          rounded-full
          bg-cyan-500/10
          blur-[120px]
        "
      />

      <div
        className="
          absolute
          bottom-[-120px]
          right-[-120px]
          h-[320px]
          w-[320px]
          rounded-full
          bg-blue-600/10
          blur-[120px]
        "
      />

      {/* CONTENT */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[calc(100vh-4rem)]
          w-full
          max-w-full
          items-center
          justify-center
        "
      >

        <section
          className="
            grid
            w-full
            items-center
            gap-10
            lg:grid-cols-[1fr_460px]
          "
        >

          {/* LEFT SIDE */}

          <div
            className="
              hidden
              lg:block
            "
          >

            {/* BADGE */}

            <div
              className="
                mb-6
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-cyan-400/20
                bg-cyan-400/10
                px-5
                py-2
                text-xs
                font-bold
                uppercase
                tracking-[0.35em]
                text-cyan-300
                backdrop-blur-xl
              "
            >

              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-cyan-400
                  shadow-[0_0_12px_rgba(34,211,238,1)]
                "
              />

              FFX ESPORTS
            </div>

            {/* HEADING */}

            <h1
              className="
                max-w-3xl
                text-5xl
                font-black
                leading-[1.1]
                text-white
                xl:text-7xl
              "
            >

              India’s
              <span
                className="
                  bg-gradient-to-r
                  from-cyan-300
                  via-blue-400
                  to-purple-400
                  bg-clip-text
                  text-transparent
                "
              >
                {" "}
                next-gen{" "}
              </span>

              esports arena for elite battle royale players.
            </h1>

            {/* SUBTEXT */}

            <p
              className="
                mt-4
                max-w-2xl
                text-lg
                leading-8
                text-slate-400
              "
            >

              Join premium tournaments, real-time match rooms,
              verified wallets, secure prize pools, and
              competitive squad battles — all in one futuristic
              gaming ecosystem.
            </p>

            {/* FEATURE BOXES */}

            <div
              className="
                mt-10
                grid
                max-w-3xl
                grid-cols-3
                gap-4
              "
            >

              {[
                "Free Fire",
                "BGMI",
                "CODM",
                "Valorant",
                "Instant Wallet",
                "Live Match Rooms"
              ].map((item) => (

                <div
                  key={item}
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    p-4
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:border-cyan-400/20
                    hover:bg-cyan-400/[0.05]
                  "
                >

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-br
                      from-cyan-500/[0.03]
                      to-blue-500/[0.02]
                      opacity-0
                      transition
                      duration-300
                      group-hover:opacity-100
                    "
                  />

                  <div
                    className="
                      relative
                      text-sm
                      font-bold
                      text-slate-200
                    "
                  >
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AUTH CARD */}

          <div
            className="
              relative
            "
          >

            {/* OUTER GLOW */}

            <div
              className="
                absolute
                inset-0
                rounded-[32px]
                bg-gradient-to-br
                from-cyan-400/20
                via-blue-500/10
                to-purple-500/20
                blur-2xl
              "
            />

            {/* CARD */}

            <div
              className="
                relative
                overflow-hidden
                rounded-[32px]
                border
                border-white/10
                bg-[#081120]/80
                p-7
                shadow-[0_0_80px_rgba(0,0,0,.45)]
                backdrop-blur-3xl
                sm:p-9
              "
            >

              {/* TOP LIGHT */}

              <div
                className="
                  absolute
                  inset-x-0
                  top-0
                  h-[2px]
                  bg-gradient-to-r
                  from-transparent
                  via-cyan-400
                  to-transparent
                "
              />

              {/* HEADER */}

              <div
                className="
                  mb-8
                "
              >

                <div
                  className="
                    mb-4
                    inline-flex
                    rounded-full
                    border
                    border-cyan-400/20
                    bg-cyan-400/10
                    px-4
                    py-1.5
                    text-[11px]
                    font-bold
                    uppercase
                    tracking-[0.3em]
                    text-cyan-300
                  "
                >
                  FFX ESPORTS
                </div>

                <h2
                  className="
                    text-2xl
                    font-black
                    tracking-tight
                    text-white
                  "
                >
                  {title}
                </h2>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-7
                    text-slate-400
                  "
                >
                  {subtitle}
                </p>
              </div>

              {/* FORM CONTENT */}

              <div>
                {children}
              </div>

              {/* BOTTOM GLOW */}

              <div
                className="
                  absolute
                  bottom-[-60px]
                  right-[-60px]
                  h-40
                  w-40
                  rounded-full
                  bg-cyan-500/10
                  blur-[80px]
                "
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}