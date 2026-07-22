import { Logo } from "./Logo";

const groups = [
  {
    title: "Produit",
    links: ["Fonctionnalités", "Intégrations", "Tarifs", "Nouveautés"],
  },
  {
    title: "Ressources",
    links: ["Guide de démarrage", "Centre d'aide", "Blog", "Statut"],
  },
  {
    title: "Entreprise",
    links: ["À propos", "Contact", "Confidentialité", "Conditions"],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-line py-14">
      <div className="shell">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-3">
              La plateforme qui crée et gère votre boutique e-commerce avec l&apos;IA, de A à Z.
            </p>
          </div>

          {groups.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-medium text-ink">{group.title}</h4>
              <ul className="mt-4 flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-ink-3 transition-colors hover:text-ink">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="hairline my-10" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-ink-3 sm:flex-row">
          <span>© {new Date().getFullYear()} Sigmood IA. Tous droits réservés.</span>
          <span>Conçu en France · Propulsé par l&apos;IA générative</span>
        </div>
      </div>
    </footer>
  );
}
