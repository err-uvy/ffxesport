export function PageHeader({

  eyebrow,

  title,

  children

}: {

  eyebrow: string;

  title: string;

  children?: React.ReactNode;
}) {

  return (

    <div
      className="
      relative

      mb-8

      overflow-hidden

      rounded-[32px]

      border
      border-white/10

      bg-[#081120]/70

      px-6
      py-6

      backdrop-blur-2xl

      sm:px-8
      sm:py-7
    "
    >

      {/* BACKGROUND GLOW */}

      <div
        className="
        absolute
        inset-0

        bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,.12),transparent_35%),linear-gradient(180deg,rgba(255,255,255,.02),transparent)]

        pointer-events-none
      "
      />

      {/* TOP LINE */}

      <div
        className="
        absolute
        left-0
        right-0
        top-0

        h-[2px]

        bg-[linear-gradient(90deg,transparent,#06B6D4,#2563EB,#7C3AED,transparent)]

        opacity-80
      "
      />

      <div
        className="
        relative
        z-10

        flex
        flex-col
        gap-5

        md:flex-row
        md:items-end
        md:justify-between
      "
      >

        {/* LEFT */}

        <div>

          <div
            className="
            inline-flex
            items-center

            rounded-full

            border
            border-cyan-400/20

            bg-cyan-400/[0.06]

            px-4
            py-1.5

            text-[11px]
            font-black

            uppercase
            tracking-[0.28em]

            text-cyan-200

            backdrop-blur-xl
          "
          >
            {eyebrow}
          </div>

          <h1
            className="
            mt-4

            text-4xl
            font-black

            tracking-tight

            text-white

            sm:text-5xl
          "
          >
            {title}
          </h1>

          {/* UNDERLINE */}

          <div
            className="
            mt-4

            h-[3px]
            w-24

            rounded-full

            bg-[linear-gradient(90deg,#06B6D4,#2563EB,#7C3AED)]
          "
          />
        </div>

        {/* RIGHT ACTIONS */}

        {children && (

          <div
            className="
            relative
            z-10

            flex
            flex-wrap
            items-center
            gap-3
          "
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
}