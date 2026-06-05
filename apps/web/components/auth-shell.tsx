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
        min-h-screen
        bg-background
        px-4
        py-8
        text-white
        sm:px-6
      "
    >
      <div
        className="
          mx-auto
          flex
          min-h-[calc(100vh-4rem)]
          w-full
          max-w-[1400px]
          items-center
          justify-center
        "
      >
        <section
          className="
            grid
            w-full
            items-center
            gap-16
            lg:grid-cols-[1fr_480px]
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
                rounded-full
                border
                border-border
                bg-card
                px-4
                py-2
                text-xs
                font-semibold
                uppercase
                tracking-[0.25em]
                text-muted
              "
            >
              FFX ESPORTS
            </div>

            {/* HEADING */}

            <h1
              className="
                max-w-3xl
                text-5xl
                font-bold
                leading-[1.05]
                tracking-tight
                text-white
                xl:text-6xl
              "
            >
            Competitive esports platform
built for modern tournament
gaming.
            </h1>

            {/* SUBTEXT */}

            <p
              className="
                mt-6
                max-w-2xl
                text-lg
                leading-8
                text-muted
              "
            >
              Join premium tournaments,
              secure wallets, real-time
              match rooms, and competitive
              gaming events in one unified
              platform.
            </p>

            {/* FEATURE CARDS */}

            <div
              className="
                mt-10
                grid
                max-w-2xl
                grid-cols-2
                gap-4
                min-h-[88px]
              "
            >
              {[
                "Real-time Matches",
                "Instant Wallet",
                "Secure Prize Pools",
                "Tournament Analytics"
              ].map((item) => (
                <div
                  key={item}
                  className="
                   premium-card
min-h-[88px]
rounded-2xl
px-5
py-4
                    text-sm
                    font-medium
                    text-white
                  "
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* AUTH CARD */}

          <div
            className="
              relative
w-full
max-w-[480px]
ml-auto
            "
          >
            <div
              className="
                relative
                rounded-[32px]
                border
                border-border
                bg-card
                p-7
                shadow-card
transition-all
duration-200
hover:border-primary/20
                sm:p-9
              "
            >
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
                    border-border
                    bg-background-secondary
                    px-4
                    py-1.5
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.3em]
                    text-muted
                  "
                >
                  FFX ESPORTS
                </div>

                <h2
                  className="
                    text-2xl
                    font-bold
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
                    text-muted
                  "
                >
                  {subtitle}
                </p>
              </div>

              {/* FORM CONTENT */}

              <div>
                {children}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
