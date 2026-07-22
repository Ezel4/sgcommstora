export function ComingSoon({
  title,
  description,
  Icon,
}: {
  title: string;
  description: string;
  Icon: (p: { className?: string }) => React.ReactElement;
}) {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface/40 px-6 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-2xl border border-line bg-white/[0.03] text-rose">
        <Icon className="size-6" />
      </span>
      <h2 className="mt-5 text-xl font-light tracking-tight text-ink">{title}</h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-2">{description}</p>
      <span className="pill mt-6">Bientôt disponible</span>
    </div>
  );
}
