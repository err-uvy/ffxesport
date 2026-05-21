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
        rounded-[28px]
        border
        border-white/10
        bg-[#081120]/80
        px-6
        py-6
        backdrop-blur-2xl
      "
    >

      {/* GRID */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.03]
        "
        style={{
          backgroundImage:
            `
            linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
          `,
          backgroundSize:
            "36px 36px"
        }}
      />

      {/* GLOW */}

      <div
        className="
          absolute
          right-[-100px]
          top-[-100px]
          h-72
          w-64
          rounded-full
          bg-cyan-500/[0.06]
          blur-[120px]
        "
      />

      {/* TOP LINE */}

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-[2px]
          bg-gradient-to-r
          from-transparent
          via-cyan-400/70
          to-transparent
        "
      />

      {/* CONTENT */}

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

          {/* EYEBROW */}

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-cyan-400/20
              bg-cyan-400/[0.08]
              px-4
              py-1.5
              text-[11px]
              font-bold
              uppercase
              tracking-[0.35em]
              text-cyan-300
            "
          >

            <span
              className="
                h-2
                w-2
                rounded-full
                bg-cyan-400
                shadow-[0_0_10px_rgba(34,211,238,1)]
              "
            />

            {eyebrow}
          </div>

          {/* TITLE */}

          <h1
            className="
              mt-4
              text-4xl
              font-black
              leading-tight
              tracking-tight
              text-white
              sm:text-5xl
            "
          >
            {title}
          </h1>

          {/* BOTTOM ACCENT */}

          <div
            className="
              mt-4
              h-[3px]
              w-24
              rounded-full
              bg-gradient-to-r
              from-cyan-400
              via-blue-500
              to-purple-500
            "
          />
        </div>

        {/* RIGHT ACTIONS */}

        {children && (

          <div
            className="
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