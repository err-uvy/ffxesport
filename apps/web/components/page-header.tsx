export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-blue-200">{eyebrow}</div>
        <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">{title}</h1>
      </div>
      {children}
    </div>
  );
}
