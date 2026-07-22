import { Logo } from "./Logo";

// Navbar allégée pour les pages de conversion : pas de liens de navigation qui
// font sortir le visiteur de la page, uniquement le CTA principal + connexion discrète.
export function LandingNavbar({ signupHref }: { signupHref: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="shell">
        <div className="glass-bar mt-4 flex items-center justify-between rounded-full px-4 py-2.5">
          <Logo brandName="Sigmood IA" compactOnMobile />

          <div className="flex items-center gap-2">
            <a href="/login" className="hidden text-sm text-ink-3 transition-colors hover:text-ink sm:inline-flex sm:px-3">
              Déjà client ?
            </a>
            <a href={signupHref} className="btn btn-light min-h-10 !px-4 !py-2 text-sm sm:!px-5">
              <span className="sm:hidden">Commencer</span>
              <span className="hidden sm:inline">Commencer gratuitement</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
