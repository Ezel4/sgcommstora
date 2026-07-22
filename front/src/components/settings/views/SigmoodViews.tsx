"use client";

import { useState } from "react";
import { Badge, Button, ConfirmDialog, Input, Textarea } from "@/components/ui";
import { activeStore } from "@/data/mock-commerce";
import { cn } from "@/lib/utils";
import {
  ConnectionNotice,
  InlineFeedback,
  LocalOnlyNotice,
  SettingsCard,
  SettingsRow,
  SettingsSelect,
  SettingsToggle,
  UsageProgress,
} from "../SettingsPrimitives";

type ViewProps = { onChange: () => void };

export function VisualIdentityView({ onChange }: ViewProps) {
  const [primary, setPrimary] = useState("#1fc5be");
  const [secondary, setSecondary] = useState("#82a99e");
  const [radius, setRadius] = useState("rounded");
  const [feedback, setFeedback] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <ConnectionNotice>Le logo public, les polices et les couleurs de la vitrine ne sont pas connectés. Cet écran est un atelier visuel local.</ConnectionNotice>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-4">
          <SettingsCard title="Logos et icônes">
            <div className="grid gap-3 sm:grid-cols-3">{["Logo principal", "Logo secondaire", "Favicon"].map((label) => <button key={label} type="button" onClick={() => setFeedback(`${label} : import non envoyé, stockage média à connecter.`)} className="grid min-h-28 place-items-center rounded-2xl border border-dashed border-line-strong bg-surface-2 p-4 text-center transition hover:border-accent focus-visible:outline-2 focus-visible:outline-accent-ink"><span><span className="mx-auto grid size-9 place-items-center rounded-xl bg-surface text-xl text-ink-3">+</span><span className="mt-2 block text-xs font-semibold text-ink">{label}</span></span></button>)}</div>
            {feedback && <div className="mt-4"><InlineFeedback>{feedback}</InlineFeedback></div>}
          </SettingsCard>
          <SettingsCard title="Couleurs et composants">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-[0.8125rem] font-medium text-ink-2">Couleur principale<input type="color" value={primary} onChange={(event) => { setPrimary(event.target.value); onChange(); }} className="h-11 w-full cursor-pointer rounded-xl border border-line-strong bg-surface p-1" /></label>
              <label className="flex flex-col gap-2 text-[0.8125rem] font-medium text-ink-2">Couleur secondaire<input type="color" value={secondary} onChange={(event) => { setSecondary(event.target.value); onChange(); }} className="h-11 w-full cursor-pointer rounded-xl border border-line-strong bg-surface p-1" /></label>
              <SettingsSelect label="Typographie des titres" defaultValue="manrope" onChange={onChange}><option value="manrope">Manrope</option><option value="urbanist">Urbanist</option><option value="system">Système</option></SettingsSelect>
              <SettingsSelect label="Rayon des composants" value={radius} onChange={(event) => { setRadius(event.target.value); onChange(); }}><option value="soft">Discret</option><option value="rounded">Arrondi</option><option value="pill">Très arrondi</option></SettingsSelect>
            </div>
          </SettingsCard>
          <SettingsCard title="Ton de marque"><div onChange={onChange}><Textarea label="Principes éditoriaux" placeholder="Décrivez la voix, le vocabulaire et les émotions de votre marque." rows={4} /></div><Button type="button" variant="secondary" className="mt-4" onClick={() => setFeedback("Assistant IA non ouvert : génération de marque à connecter.")}>Modifier avec l’IA</Button></SettingsCard>
        </div>
        <aside className="h-fit overflow-hidden rounded-[24px] border border-line bg-surface lg:sticky lg:top-20">
          <div className="h-24" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }} />
          <div className="p-5"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-4">Aperçu local</p><h3 className="mt-3 text-2xl font-medium tracking-tight text-ink">{activeStore.name}</h3><p className="mt-2 text-xs leading-5 text-ink-3">{activeStore.niche}</p><span className={cn("mt-5 block w-full bg-ink px-4 py-3 text-center text-sm font-semibold text-white", radius === "soft" ? "rounded-lg" : radius === "pill" ? "rounded-full" : "rounded-2xl")}>Découvrir</span></div>
        </aside>
      </div>
    </div>
  );
}

const IMAGE_PRESETS = ["Packshot e-commerce", "Studio blanc", "Lifestyle", "Luxe", "Publicité", "Réseaux sociaux", "Hero section", "Marketplace"] as const;

export function AiImagesView({ onChange }: ViewProps) {
  const [preset, setPreset] = useState<(typeof IMAGE_PRESETS)[number]>("Packshot e-commerce");
  const [manualReview, setManualReview] = useState(true);
  const [keepOriginal, setKeepOriginal] = useState(true);
  return (
    <div className="space-y-4">
      <LocalOnlyNotice compact />
      <SettingsCard title="Preset d’image" description="Point de départ modifiable pour les futures générations.">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">{IMAGE_PRESETS.map((name) => <button key={name} type="button" aria-pressed={preset === name} onClick={() => { setPreset(name); onChange(); }} className={cn("min-h-20 rounded-2xl border p-3 text-left text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-accent-ink", preset === name ? "border-accent bg-accent-soft text-accent-ink" : "border-line bg-surface-2 text-ink-2 hover:border-line-strong")}>{name}</button>)}</div>
      </SettingsCard>
      <SettingsCard title="Valeurs par défaut">
        <div className="grid gap-5 sm:grid-cols-2" onChange={onChange}><SettingsSelect label="Format" defaultValue="webp"><option value="webp">WebP</option><option value="jpg">JPEG</option><option value="png">PNG</option></SettingsSelect><SettingsSelect label="Ratio" defaultValue="1:1"><option>1:1</option><option>4:5</option><option>16:9</option><option>9:16</option></SettingsSelect><SettingsSelect label="Résolution" defaultValue="2048"><option value="1024">1024 px</option><option value="2048">2048 px</option></SettingsSelect><SettingsSelect label="Fond" defaultValue="white"><option value="white">Blanc studio</option><option value="transparent">Transparent</option><option value="context">En contexte</option></SettingsSelect><Input label="Dossier de destination" defaultValue="Images IA" /><SettingsSelect label="Compression" defaultValue="balanced"><option value="quality">Qualité maximale</option><option value="balanced">Équilibrée</option><option value="light">Fichier léger</option></SettingsSelect></div>
      </SettingsCard>
      <SettingsCard title="Contrôle des résultats">
        <SettingsRow title="Validation manuelle" description="Aucune image ne sera insérée automatiquement dans la boutique."><SettingsToggle checked={manualReview} label="Validation manuelle" onCheckedChange={(value) => { setManualReview(value); onChange(); }} /></SettingsRow><div className="border-t border-line" /><SettingsRow title="Conserver l’image originale"><SettingsToggle checked={keepOriginal} label="Conserver l’image originale" onCheckedChange={(value) => { setKeepOriginal(value); onChange(); }} /></SettingsRow><div className="border-t border-line" /><SettingsRow title="Insertion automatique" description="Désactivée par défaut et indisponible tant que le workflow n’est pas connecté."><SettingsToggle checked={false} label="Insertion automatique" disabled onCheckedChange={() => undefined} /></SettingsRow>
      </SettingsCard>
      <ConnectionNotice title="Aucune génération déclenchée">Ces préférences ne consomment aucun crédit et ne sont envoyées à aucun modèle.</ConnectionNotice>
    </div>
  );
}

export function SubscriptionView() {
  const [feedback, setFeedback] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <ConnectionNotice title="Abonnement non connecté">La formule, le prix, le renouvellement et les limites réelles ne sont pas disponibles dans le projet actuel.</ConnectionNotice>
      <section className="overflow-hidden rounded-[26px] bg-ink text-white shadow-[var(--elevation-3)]">
        <div className="brand-gradient h-2" />
        <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-semibold uppercase tracking-[0.13em] text-accent">Formule actuelle</p><Badge tone="neutral" className="border-white/15 bg-white/10 text-white">À connecter</Badge></div><h3 className="mt-3 text-3xl font-medium tracking-tight">Donnée indisponible</h3><p className="mt-2 text-sm text-white/60">Tarif, périodicité et prochaine date de renouvellement : —</p></div>
          <Button type="button" variant="secondary" onClick={() => setFeedback("Catalogue de formules non ouvert : données d’abonnement requises.")}>Voir les formules</Button>
        </div>
      </section>
      <SettingsCard title="Limites et utilisation" description="Aucune jauge n’est présentée comme un usage réel.">
        <div className="space-y-5"><UsageProgress label="Crédits texte" detail="À connecter" /><UsageProgress label="Crédits Images IA" detail="À connecter" /><UsageProgress label="Boutiques incluses" detail="À connecter" /><UsageProgress label="Membres inclus" detail="À connecter" /><UsageProgress label="Stockage" detail="À connecter" /></div>
      </SettingsCard>
      <SettingsCard title="Gérer la formule">
        <div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => setFeedback("Changement de formule non envoyé.")} className="rounded-2xl border border-line p-4 text-left transition hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent-ink"><span className="text-sm font-semibold text-ink">Changer de formule</span><span className="mt-1 block text-xs leading-5 text-ink-3">Comparaison à connecter au catalogue d’offres.</span></button><button type="button" onClick={() => setFeedback("Achat de crédits non envoyé.")} className="rounded-2xl border border-line p-4 text-left transition hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent-ink"><span className="text-sm font-semibold text-ink">Acheter des crédits</span><span className="mt-1 block text-xs leading-5 text-ink-3">Checkout SaaS à connecter.</span></button></div>
        {feedback && <div className="mt-4"><InlineFeedback>{feedback}</InlineFeedback></div>}
      </SettingsCard>
    </div>
  );
}

export function BillingView({ onChange }: ViewProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-accent/20 bg-accent-soft px-5 py-4"><p className="text-sm font-semibold text-accent-ink">Facturation Sigmood IA</p><p className="mt-1 text-xs leading-5 text-accent-ink/80">Cette page concerne les frais du logiciel. Les encaissements clients se trouvent dans « Paiements boutique ».</p></div>
      <ConnectionNotice>Aucune facture, carte ou coordonnée de facturation réelle n’est disponible.</ConnectionNotice>
      <SettingsCard title="Coordonnées de facturation" description="Champs de brouillon local, vides par défaut.">
        <div className="grid gap-5 sm:grid-cols-2" onChange={onChange}><Input label="Raison sociale" placeholder="À renseigner" autoComplete="organization" /><Input label="Numéro de TVA" placeholder="À renseigner" /><Input label="Adresse" placeholder="À renseigner" autoComplete="street-address" /><Input label="Ville et code postal" placeholder="À renseigner" /><SettingsSelect label="Pays" defaultValue="FR"><option value="FR">France</option><option value="BE">Belgique</option><option value="CH">Suisse</option></SettingsSelect><Input label="E-mail de facturation" type="email" placeholder="facturation@exemple.fr" /></div>
      </SettingsCard>
      <SettingsCard title="Moyen de paiement" action={<Badge tone="neutral">Non connecté</Badge>}>
        <div className="flex flex-col gap-4 rounded-2xl bg-surface-2 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-ink">Aucun moyen de paiement disponible</p><p className="mt-1 text-xs text-ink-3">Les données bancaires complètes ne seront jamais affichées.</p></div><Button type="button" size="sm" variant="secondary" onClick={() => setFeedback("Modification non ouverte : portail de facturation à connecter.")}>Préparer la modification</Button></div>
      </SettingsCard>
      <SettingsCard title="Historique des factures" description="Les factures réelles seront listées avec date, montant, statut et téléchargement.">
        <div className="rounded-2xl border border-dashed border-line-strong px-5 py-9 text-center"><p className="text-sm font-semibold text-ink">Aucune facture disponible</p><p className="mt-1 text-xs leading-5 text-ink-3">Aucune fausse facture n’a été générée pour remplir cet état.</p></div>
        {feedback && <div className="mt-4"><InlineFeedback>{feedback}</InlineFeedback></div>}
      </SettingsCard>
    </div>
  );
}

export function UsageView() {
  return (
    <div className="space-y-4">
      <ConnectionNotice title="Métriques indisponibles">Le projet ne fournit aucun compteur d’usage ou crédit vérifiable.</ConnectionNotice>
      <SettingsCard title="Utilisation du cycle actuel"><div className="space-y-5"><UsageProgress label="Génération de texte" detail="— / —" /><UsageProgress label="Images IA" detail="— / —" /><UsageProgress label="Stockage" detail="—" /><UsageProgress label="Membres" detail="— / —" /></div></SettingsCard>
      <SettingsCard title="Prochaine réinitialisation"><p className="text-sm text-ink-2">Date à connecter à la période de facturation.</p></SettingsCard>
    </div>
  );
}

export function PrivacyView({ onChange }: ViewProps) {
  const [aiUse, setAiUse] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <ConnectionNotice>Les consentements et demandes RGPD nécessitent une persistance, un journal et un workflow serveur.</ConnectionNotice>
      <SettingsCard title="Consentements du dashboard">
        <SettingsRow title="Mesure d’audience fonctionnelle" description="Préférence locale illustrative, sans gestionnaire de consentement connecté."><SettingsToggle checked={analytics} label="Mesure d’audience" onCheckedChange={(value) => { setAnalytics(value); onChange(); }} /></SettingsRow><div className="border-t border-line" /><SettingsRow title="Utiliser mes données pour améliorer l’IA" description="Désactivé par défaut dans ce brouillon."><SettingsToggle checked={aiUse} label="Utilisation des données pour l’IA" onCheckedChange={(value) => { setAiUse(value); onChange(); }} /></SettingsRow>
      </SettingsCard>
      <SettingsCard title="Vos données" description="Chaque demande devra afficher sa date, son statut et son résultat.">
        <div className="grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => setFeedback("Export non demandé : service d’export à connecter.")} className="rounded-2xl border border-line p-4 text-left transition hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent-ink"><span className="text-sm font-semibold text-ink">Exporter mes données</span><span className="mt-1 block text-xs leading-5 text-ink-3">Préparer une archive de compte.</span></button><button type="button" onClick={() => setFeedback("Téléchargement non lancé : factures indisponibles.")} className="rounded-2xl border border-line p-4 text-left transition hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent-ink"><span className="text-sm font-semibold text-ink">Télécharger mes factures</span><span className="mt-1 block text-xs leading-5 text-ink-3">Rassembler les documents SaaS.</span></button><button type="button" onClick={() => setFeedback("Historique IA non supprimé : action serveur indisponible.")} className="rounded-2xl border border-line p-4 text-left transition hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent-ink"><span className="text-sm font-semibold text-ink">Supprimer l’historique IA</span><span className="mt-1 block text-xs leading-5 text-ink-3">Demande irréversible après confirmation serveur.</span></button><button type="button" onClick={() => setFeedback("Demande RGPD non envoyée : workflow à connecter.")} className="rounded-2xl border border-line p-4 text-left transition hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent-ink"><span className="text-sm font-semibold text-ink">Exercer un droit RGPD</span><span className="mt-1 block text-xs leading-5 text-ink-3">Accès, rectification ou opposition.</span></button></div>
        {feedback && <div className="mt-4"><InlineFeedback>{feedback}</InlineFeedback></div>}
      </SettingsCard>
    </div>
  );
}

export function SupportView({ onChange, contactRequested = false }: ViewProps & { contactRequested?: boolean }) {
  const [feedback, setFeedback] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      {contactRequested && <div role="status" className="rounded-2xl border border-accent/25 bg-accent-soft px-5 py-4 text-accent-ink"><p className="text-sm font-semibold">Contact du support demandé</p><p className="mt-1 text-xs leading-5">Le formulaire est prêt ci-dessous. Son envoi reste désactivé tant que le service de support n’est pas connecté.</p></div>}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["Centre d’aide","Guides de prise en main"],["Documentation","Références produit"],["Tutoriels","Parcours pas à pas"],["Statut","État de la plateforme"]].map(([title, description]) => <button key={title} type="button" onClick={() => setFeedback(`${title} : destination à connecter.`)} className="rounded-2xl border border-line bg-surface p-4 text-left shadow-[var(--elevation-1)] transition hover:-translate-y-0.5 hover:shadow-[var(--elevation-2)] focus-visible:outline-2 focus-visible:outline-accent-ink motion-reduce:transform-none"><span className="text-sm font-semibold text-ink">{title}</span><span className="mt-1 block text-xs leading-5 text-ink-3">{description}</span></button>)}</div>
      <SettingsCard title="Contacter le support" description="Préparez votre demande. Aucun ticket ni e-mail ne sera envoyé depuis cette version.">
        <form onSubmit={(event) => { event.preventDefault(); setFeedback("Brouillon de demande préparé localement. Aucun ticket n’a été créé."); }} onChange={onChange}>
          <div className="grid gap-5 sm:grid-cols-2"><Input label="Sujet" name="subject" required autoFocus={contactRequested} placeholder="Résumez votre demande" /><SettingsSelect label="Catégorie" defaultValue="question"><option value="question">Question</option><option value="bug">Signaler un bug</option><option value="billing">Facturation</option><option value="idea">Proposer une fonctionnalité</option></SettingsSelect><SettingsSelect label="Priorité" defaultValue="normal" hint="La priorité urgente dépendra de la formule."><option value="low">Faible</option><option value="normal">Normale</option><option value="high" disabled>Urgente — plan requis</option></SettingsSelect><Input label="E-mail de réponse" name="replyEmail" type="email" placeholder="vous@exemple.fr" /><div className="sm:col-span-2"><Textarea label="Description" name="description" required rows={5} placeholder="Décrivez le contexte et le résultat attendu…" /></div></div>
          <div className="mt-5 flex flex-wrap items-center gap-3"><Button type="submit">Conserver le brouillon local</Button><Badge tone="warning">Envoi non connecté</Badge></div>
        </form>
        {feedback && <div className="mt-4"><InlineFeedback>{feedback}</InlineFeedback></div>}
      </SettingsCard>
      <p className="text-xs text-ink-4">Version de l’interface : locale · numéro de version produit à connecter</p>
    </div>
  );
}

const DANGER_ACTIONS = [
  ["Transférer la propriété", "Préparer le transfert vers un autre compte vérifié."],
  ["Désactiver temporairement", "Suspendre l’accès public sans supprimer les données."],
  ["Dépublier la boutique", "Retirer la vitrine du web tout en conservant le brouillon."],
  ["Réinitialiser la boutique", "Revenir à une base vide après export et confirmation."],
  ["Supprimer la boutique", "Supprimer la boutique et ses ressources après délai de sécurité."],
  ["Supprimer le compte", "Fermer le compte et lancer le workflow de suppression des données."],
] as const;

export function DangerView() {
  const [selected, setSelected] = useState<(typeof DANGER_ACTIONS)[number] | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <div role="alert" className="rounded-[24px] border border-danger/25 bg-danger-soft px-5 py-5 text-danger"><p className="text-base font-semibold">Zone sensible</p><p className="mt-1 text-sm leading-6">Aucune action n’est exécutable dans cette version. Chaque parcours final devra vérifier l’identité, expliquer les conséquences et demander une confirmation explicite.</p></div>
      <SettingsCard className="border-danger/20">
        <div className="divide-y divide-line">{DANGER_ACTIONS.map((action) => <div key={action[0]} className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"><div className="pr-4"><p className="text-sm font-semibold text-ink">{action[0]}</p><p className="mt-1 text-xs leading-5 text-ink-3">{action[1]}</p></div><Button type="button" size="sm" variant={action[0].startsWith("Supprimer") ? "danger" : "secondary"} onClick={() => setSelected(action)}>Voir la confirmation</Button></div>)}</div>
        {feedback && <div className="mt-5"><InlineFeedback>{feedback}</InlineFeedback></div>}
      </SettingsCard>
      {selected && <ConfirmDialog title={selected[0]} description={`${selected[1]} Cette prévisualisation n’enverra aucune demande et ne modifiera pas « ${activeStore.name} ». Le parcours backend devra ensuite demander le nom de la boutique et une authentification récente.`} confirmLabel="Fermer sans agir" onCancel={() => setSelected(null)} onConfirm={() => { setFeedback(`Aucune action « ${selected[0]} » n’a été envoyée.`); setSelected(null); }} />}
    </div>
  );
}

export function LegalView() {
  const [feedback, setFeedback] = useState<string | null>(null);
  const documents = ["Conditions générales de vente", "Mentions légales", "Politique de confidentialité", "Politique de retour", "Politique de remboursement", "Politique de livraison", "Politique relative aux cookies"];
  return (
    <div className="space-y-4"><ConnectionNotice title="Éditeur juridique non connecté">Les documents générés devront être vérifiés par le commerçant ou un professionnel compétent.</ConnectionNotice><SettingsCard title="Documents"><div className="divide-y divide-line">{documents.map((name) => <div key={name} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium text-ink">{name}</p><p className="mt-1 text-xs text-ink-3">Aucun contenu disponible</p></div><Button type="button" size="sm" variant="secondary" onClick={() => setFeedback(`${name} : génération IA non lancée.`)}>Préparer avec l’IA</Button></div>)}</div>{feedback && <div className="mt-4"><InlineFeedback>{feedback}</InlineFeedback></div>}</SettingsCard></div>
  );
}

export function IntegrationsView() {
  const integrations = ["Google Analytics", "Meta Pixel", "TikTok Pixel", "Google Merchant Center", "Klaviyo", "Mailchimp", "Zapier", "Make"];
  return <div className="space-y-4"><ConnectionNotice>Aucune intégration n’est présentée comme connectée.</ConnectionNotice><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{integrations.map((name) => <article key={name} className="rounded-[22px] border border-line bg-surface p-5"><span className="grid size-11 place-items-center rounded-xl bg-surface-2 text-sm font-bold text-ink">{name.slice(0, 2).toUpperCase()}</span><h3 className="mt-4 text-sm font-semibold text-ink">{name}</h3><p className="mt-1 text-xs leading-5 text-ink-3">Connexion prévue dans une version ultérieure.</p><Badge tone="neutral" className="mt-4">Bientôt disponible</Badge></article>)}</div></div>;
}

export function PlaceholderView({ title, description, status = "soon" }: { title: string; description: string; status?: "soon" | "visual" }) {
  return (
    <div className="space-y-4"><ConnectionNotice title={status === "soon" ? "Bientôt disponible" : "Interface préparée"}>{description}</ConnectionNotice><SettingsCard><div className="py-8 text-center"><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-surface-2 text-ink-3"><svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><path d="M12 3v18M3 12h18" /></svg></span><h3 className="mt-4 text-base font-semibold text-ink">{title}</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-3">Le parcours est positionné dans la navigation, mais ses données et ses actions attendent un service backend vérifiable.</p><Badge tone="neutral" className="mt-4">{status === "soon" ? "Bientôt disponible" : "À connecter"}</Badge></div></SettingsCard></div>
  );
}
