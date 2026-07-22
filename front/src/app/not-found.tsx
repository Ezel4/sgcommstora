import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-base px-5 py-16 text-center">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-line bg-white/75 p-8 shadow-[var(--elevation-2)] backdrop-blur-xl sm:p-10">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-20 size-48 rounded-full bg-accent-soft blur-3xl" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-ink">Erreur 404</p>
        <h1 className="relative mt-4 text-4xl font-medium tracking-[-0.045em] text-ink">Cette page n’existe pas.</h1>
        <p className="relative mt-4 text-sm leading-6 text-ink-2">
          Le lien est peut-être obsolète, ou cette boutique n’est pas encore publiée.
        </p>
        <Link href="/" className="btn btn-light relative mt-7 min-h-11">Revenir à l’accueil</Link>
      </div>
    </main>
  );
}
