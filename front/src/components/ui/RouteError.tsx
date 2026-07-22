"use client";

export function RouteError({ reset }: { reset: () => void }) {
  return (
    <div className="grid min-h-[60vh] place-items-center px-5 py-16">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[26px] border border-danger/15 bg-elevated p-7 text-center shadow-[var(--elevation-2)] sm:p-9">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 size-44 rounded-full bg-danger-soft blur-3xl" />
        <span className="relative mx-auto grid size-12 place-items-center rounded-2xl bg-danger-soft text-lg font-semibold text-danger">!</span>
        <p className="relative mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-danger">Une erreur est survenue</p>
        <h1 className="relative mt-3 text-2xl font-medium text-ink">Impossible de charger cet écran.</h1>
        <p className="relative mt-3 text-sm leading-6 text-ink-2">
          Vos données n’ont pas été modifiées. Réessayez ou revenez plus tard si le problème persiste.
        </p>
        <button type="button" onClick={reset} className="btn btn-light relative mt-6 min-h-11">
          Réessayer
        </button>
      </div>
    </div>
  );
}
