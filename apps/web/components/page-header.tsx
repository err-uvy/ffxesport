import React from "react";

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
        border-white/5

        bg-[#0B1120]

        px-8
        py-7

        shadow-[0_10px_40px_rgba(0,0,0,.35)]
      "
    >

      {/* SUBTLE GRID */}

      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px"
        }}
      />

      {/* SOFT RIGHT GLOW */}

      <div
        className="
          absolute
          right-0
          top-0
          h-full
          w-[35%]

          bg-[radial-gradient(circle_at_center,rgba(37,99,235,.12),transparent_70%)]

          opacity-80
        "
      />

      {/* TOP LIGHT LINE */}

      <div
        className="
          absolute
          inset-x-0
          top-0

          h-px

          bg-gradient-to-r
          from-transparent
          via-white/10
          to-transparent
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

        <div>

          {/* EYEBROW */}

          <div
            className="
              inline-flex
              items-center
              gap-2

              rounded-full

              border
              border-white/5

              bg-white/[0.03]

              px-4
              py-1.5

              text-[11px]
              font-bold
              uppercase
              tracking-[0.35em]

              text-zinc-300
            "
          >

            <span
              className="
                h-2
                w-2
                rounded-full

                bg-primary
              "
            />

            {eyebrow}
          </div>

          {/* TITLE */}

          <h1
            className="
              mt-5

              text-4xl
              font-black
              tracking-tight

              text-white

              sm:text-5xl
            "
          >
            {title}
          </h1>

          {/* ACCENT LINE */}

          <div
            className="
              mt-4

              h-[3px]
              w-28

              rounded-full

              bg-gradient-to-r
              from-primary
              to-blue-400/40
            "
          />
        </div>

        {/* RIGHT CONTENT */}

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

