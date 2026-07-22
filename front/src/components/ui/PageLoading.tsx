export function PageLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="space-y-5 py-4"
    >
      <span className="sr-only">Chargement de la page…</span>
      <div aria-hidden className="space-y-5">
        <div className="skeleton-shimmer h-8 w-52 max-w-[70%] rounded-full" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="skeleton-shimmer h-28 rounded-[23px] border border-line"
            />
        ))}
        </div>
        <div className="skeleton-shimmer h-72 rounded-[23px] border border-line" />
      </div>
    </div>
  );
}
