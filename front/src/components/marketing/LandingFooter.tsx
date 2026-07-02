import { Logo } from "./Logo";

// Footer allégé : pas de colonnes de liens qui font sortir le visiteur de la page,
// juste les mentions légales attendues.
export function LandingFooter() {
  return (
    <footer className="relative border-t border-line py-10">
      <div className="shell flex flex-col items-center gap-4 text-sm text-ink-3 sm:flex-row sm:justify-between">
        <Logo />
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <a href="#" className="transition-colors hover:text-ink">Mentions légales</a>
          <a href="#" className="transition-colors hover:text-ink">Confidentialité</a>
          <a href="#" className="transition-colors hover:text-ink">Conditions</a>
        </div>
        <span>© {new Date().getFullYear()} Stora AI</span>
      </div>
    </footer>
  );
}
