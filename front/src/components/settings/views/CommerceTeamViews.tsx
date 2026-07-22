"use client";

import { useState } from "react";
import { Badge, Button, Input, Textarea } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  ConnectionNotice,
  InlineFeedback,
  LocalOnlyNotice,
  SettingsCard,
  SettingsRow,
  SettingsSelect,
  SettingsToggle,
} from "../SettingsPrimitives";

type ViewProps = { onChange: () => void };

function Disclosure({ title, summary, children, open = false }: { title: string; summary: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group rounded-2xl border border-line bg-surface">
      <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 px-4 py-3 focus-visible:outline-2 focus-visible:outline-accent-ink [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-ink">{title}</span><span className="mt-0.5 block text-xs leading-5 text-ink-3">{summary}</span></span>
        <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-ink-3 transition-transform group-open:rotate-180 motion-reduce:transition-none" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><path d="m7 10 5 5 5-5" /></svg>
      </summary>
      <div className="border-t border-line p-4 sm:p-5">{children}</div>
    </details>
  );
}

export function CheckoutView({ onChange }: ViewProps) {
  const [guestCheckout, setGuestCheckout] = useState(true);
  const [phone, setPhone] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [notes, setNotes] = useState(false);
  const [addressValidation, setAddressValidation] = useState(true);
  const [abandonedCart, setAbandonedCart] = useState(false);
  const toggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, value: boolean) => { setter(value); onChange(); };
  return (
    <div className="space-y-4">
      <ConnectionNotice>Les choix modifient seulement cet aperçu. Ils ne changent pas le checkout public sans moteur de commande connecté.</ConnectionNotice>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-3">
          <Disclosure title="Informations client" summary="Compte, téléphone et notes de commande" open>
            <SettingsRow title="Autoriser la commande sans compte" description="Réduit la friction pour un premier achat."><SettingsToggle checked={guestCheckout} label="Commande sans compte" onCheckedChange={(value) => toggle(setGuestCheckout, value)} /></SettingsRow><div className="border-t border-line" />
            <SettingsRow title="Collecter le numéro de téléphone" description="À demander seulement si utile pour la livraison."><SettingsToggle checked={phone} label="Collecter le téléphone" onCheckedChange={(value) => toggle(setPhone, value)} /></SettingsRow><div className="border-t border-line" />
            <SettingsRow title="Autoriser les notes de commande"><SettingsToggle checked={notes} label="Notes de commande" onCheckedChange={(value) => toggle(setNotes, value)} /></SettingsRow>
          </Disclosure>
          <Disclosure title="Consentements" summary="Newsletter, CGV et confidentialité">
            <SettingsRow title="Proposer l’inscription à la newsletter" description="La case restera décochée par défaut."><SettingsToggle checked={newsletter} label="Inscription newsletter" onCheckedChange={(value) => toggle(setNewsletter, value)} /></SettingsRow><div className="border-t border-line" />
            <SettingsRow title="Acceptation des conditions" description="Lien vers les CGV et la politique de confidentialité."><Badge tone="warning">Documents à connecter</Badge></SettingsRow>
          </Disclosure>
          <Disclosure title="Paiement" summary="Validation d’adresse et libellé du bouton">
            <SettingsRow title="Valider le format de l’adresse"><SettingsToggle checked={addressValidation} label="Validation d’adresse" onCheckedChange={(value) => toggle(setAddressValidation, value)} /></SettingsRow>
            <div className="mt-4 border-t border-line pt-4" onChange={onChange}><Input label="Texte du bouton" defaultValue="Payer maintenant" /></div>
          </Disclosure>
          <Disclosure title="Confirmation" summary="Page de remerciement après commande">
            <div onChange={onChange}><Textarea label="Message de confirmation" placeholder="Merci pour votre commande…" rows={3} /></div>
          </Disclosure>
          <Disclosure title="Paniers abandonnés" summary="Relances automatisées dans une version ultérieure">
            <SettingsRow title="Préparer la récupération" description="Aucun e-mail ne sera envoyé dans le MVP local."><SettingsToggle checked={abandonedCart} label="Récupération des paniers" onCheckedChange={(value) => toggle(setAbandonedCart, value)} /></SettingsRow>
          </Disclosure>
        </div>
        <aside className="h-fit rounded-[24px] bg-ink p-5 text-white lg:sticky lg:top-20">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Aperçu checkout</p>
          <div className="mt-5 rounded-2xl bg-white p-4 text-ink">
            <div className="h-3 w-1/2 rounded-full bg-surface-2" /><div className="mt-4 space-y-2"><div className="h-10 rounded-xl border border-line" /><div className="h-10 rounded-xl border border-line" />{phone && <div className="h-10 rounded-xl border border-line" />}</div>
            {newsletter && <div className="mt-3 flex items-center gap-2 text-xs text-ink-3"><span className="size-3 rounded border border-line-strong" />Recevoir les nouveautés</div>}
            <div className="mt-5 rounded-full bg-ink px-4 py-3 text-center text-xs font-semibold text-white">Payer maintenant</div>
          </div>
          <p className="mt-3 text-xs leading-5 text-white/55">Aperçu illustratif, sans transaction.</p>
        </aside>
      </div>
    </div>
  );
}

function PaymentMethodCard({ name, description, status, future = false }: { name: string; description: string; status: string; future?: boolean }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface-2 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface text-sm font-bold text-ink">{name.slice(0, 2).toUpperCase()}</span><div><p className="text-sm font-semibold text-ink">{name}</p><p className="mt-1 text-xs leading-5 text-ink-3">{description}</p></div></div>
      <Badge tone={future ? "neutral" : "warning"}>{status}</Badge>
    </div>
  );
}

export function PaymentsView({ onChange }: ViewProps) {
  const [mode, setMode] = useState<"test" | "live">("test");
  return (
    <div className="space-y-4">
      <ConnectionNotice title="Aucun compte de paiement connecté">Aucune donnée bancaire ni statut Stripe réel n’est disponible. Les cartes ci-dessous décrivent les emplacements prévus.</ConnectionNotice>
      <SettingsCard title="Environnement de paiement" description="Le choix reste un brouillon local et n’active aucun encaissement.">
        <div className="grid gap-3 sm:grid-cols-2">
          {([{"id":"test","label":"Mode test","description":"Simuler le parcours sans argent réel."},{"id":"live","label":"Mode réel","description":"Nécessite un compte vérifié et une activation serveur."}] as const).map((option) => <button key={option.id} type="button" aria-pressed={mode === option.id} onClick={() => { setMode(option.id); onChange(); }} className={cn("rounded-2xl border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-accent-ink", mode === option.id ? "border-accent bg-accent-soft/60" : "border-line hover:border-line-strong")}><span className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-ink">{option.label}</span>{mode === option.id && <span className="size-2 rounded-full bg-accent" />}</span><span className="mt-1 block text-xs leading-5 text-ink-3">{option.description}</span></button>)}
        </div>
      </SettingsCard>
      <SettingsCard title="Moyens de paiement" description="Paiements reçus par la boutique — distincts de la facturation Sigmood IA.">
        <div className="space-y-3"><PaymentMethodCard name="Stripe" description="Cartes bancaires et portefeuille de paiement." status="À connecter" /><PaymentMethodCard name="Apple Pay" description="Disponible après activation d’un prestataire compatible." status="À connecter" /><PaymentMethodCard name="Google Pay" description="Disponible après activation d’un prestataire compatible." status="À connecter" /><PaymentMethodCard name="PayPal" description="Emplacement prévu pour une version future." status="Bientôt disponible" future /><PaymentMethodCard name="Paiements manuels" description="Virement ou paiement à la livraison." status="Bientôt disponible" future /></div>
      </SettingsCard>
      <SettingsCard title="Versements">
        <div className="grid gap-5 sm:grid-cols-2" onChange={onChange}><SettingsSelect label="Devise de versement" defaultValue="EUR" disabled><option>EUR</option></SettingsSelect><SettingsSelect label="Fréquence" defaultValue="unknown" disabled><option value="unknown">À connecter</option></SettingsSelect><Input label="Compte bancaire" value="Non connecté" disabled /><Input label="État du compte" value="Action serveur requise" disabled /></div>
        <p className="mt-4 text-xs leading-5 text-ink-3">Les coordonnées bancaires complètes ne seront jamais affichées ici.</p>
      </SettingsCard>
    </div>
  );
}

export function ShippingView({ onChange }: ViewProps) {
  const [freeShipping, setFreeShipping] = useState(true);
  const [pickup, setPickup] = useState(false);
  return (
    <div className="space-y-4">
      <LocalOnlyNotice compact />
      <SettingsCard title="Origine des expéditions" description="Utilisée pour estimer les délais et préparer les étiquettes.">
        <div className="grid gap-5 sm:grid-cols-2" onChange={onChange}><Input label="Nom du lieu" placeholder="Entrepôt principal" /><Input label="Adresse d’expédition" placeholder="Adresse à renseigner" autoComplete="street-address" /><Input label="Ville" placeholder="Ville" autoComplete="address-level2" /><Input label="Code postal" placeholder="75000" autoComplete="postal-code" /></div>
      </SettingsCard>
      <SettingsCard title="Livraison nationale" description="Configuration MVP : tarif fixe et seuil de gratuité." action={<Badge tone="success">Zone active dans le brouillon</Badge>}>
        <div className="grid gap-5 sm:grid-cols-2" onChange={onChange}><Input label="Tarif fixe" type="number" min="0" step="0.01" defaultValue="5.90" /><Input label="Délai estimé" defaultValue="2 à 4 jours ouvrés" /></div>
        <div className="mt-5 border-t border-line pt-1"><SettingsRow title="Livraison gratuite" description="Appliquée au-dessus du montant défini."><SettingsToggle checked={freeShipping} label="Livraison gratuite" onCheckedChange={(value) => { setFreeShipping(value); onChange(); }} /></SettingsRow>{freeShipping && <div className="pb-4 sm:max-w-xs" onChange={onChange}><Input label="Montant minimum" type="number" min="0" step="1" defaultValue="75" hint="Devise du brouillon : EUR" /></div>}<div className="border-t border-line" /><SettingsRow title="Retrait sur place" description="Le client choisit un créneau après connexion du module."><SettingsToggle checked={pickup} label="Retrait sur place" onCheckedChange={(value) => { setPickup(value); onChange(); }} /></SettingsRow></div>
      </SettingsCard>
      <SettingsCard title="Règles avancées"><SettingsRow title="Tarifs par transporteur" description="Calculs en temps réel selon le poids et la destination."><Badge tone="neutral">Version future</Badge></SettingsRow><div className="border-t border-line" /><SettingsRow title="Plusieurs entrepôts" description="Stock et expédition multi-lieux."><Badge tone="neutral">Version future</Badge></SettingsRow></SettingsCard>
    </div>
  );
}

export function TaxesView({ onChange }: ViewProps) {
  const [collectTaxes, setCollectTaxes] = useState(true);
  const [shippingTaxes, setShippingTaxes] = useState(false);
  return (
    <div className="space-y-4">
      <div role="alert" className="rounded-2xl border border-warning/25 bg-warning-soft px-5 py-4 text-warning"><p className="text-sm font-semibold">Information fiscale, pas un conseil</p><p className="mt-1 text-xs leading-5">Sigmood IA ne remplace pas un conseiller fiscal. Vérifiez votre situation auprès d’un professionnel compétent.</p></div>
      <ConnectionNotice>Aucun moteur fiscal ne calcule automatiquement vos obligations. Ces champs sont un brouillon de configuration uniquement.</ConnectionNotice>
      <SettingsCard title="Immatriculation et TVA">
        <div className="grid gap-5 sm:grid-cols-2" onChange={onChange}><SettingsSelect label="Pays d’immatriculation" defaultValue="FR"><option value="FR">France</option><option value="BE">Belgique</option><option value="CH">Suisse</option></SettingsSelect><Input label="Numéro de TVA" placeholder="À renseigner" /><SettingsSelect label="Affichage des prix" defaultValue="ttc"><option value="ttc">Prix TTC</option><option value="ht">Prix HT</option></SettingsSelect><Input label="Taux par défaut (%)" type="number" min="0" max="100" step="0.1" defaultValue="20" /></div>
      </SettingsCard>
      <SettingsCard title="Règles de collecte">
        <SettingsRow title="Collecter les taxes" description="Active la configuration dans ce brouillon, sans calcul réel."><SettingsToggle checked={collectTaxes} label="Collecter les taxes" onCheckedChange={(value) => { setCollectTaxes(value); onChange(); }} /></SettingsRow><div className="border-t border-line" /><SettingsRow title="Taxes sur la livraison"><SettingsToggle checked={shippingTaxes} label="Taxes sur la livraison" onCheckedChange={(value) => { setShippingTaxes(value); onChange(); }} /></SettingsRow><div className="border-t border-line" /><SettingsRow title="Règles automatiques par pays" description="Nécessite un moteur fiscal et des données à jour."><Badge tone="neutral">Version future</Badge></SettingsRow>
      </SettingsCard>
    </div>
  );
}

const ROLES = [
  ["Propriétaire", "Tous les accès, y compris facturation et suppression."],
  ["Administrateur", "Gestion de la boutique, de l’équipe et des opérations."],
  ["Responsable boutique", "Produits, commandes, clients et contenu."],
  ["Responsable produits", "Catalogue, stocks et Images IA."],
  ["Responsable commandes", "Commandes, retours et clients."],
  ["Marketing", "Campagnes, contenu et statistiques."],
  ["Support client", "Clients, commandes et retours."],
  ["Analyste", "Statistiques en lecture seule."],
  ["Lecture seule", "Consultation sans modification."],
] as const;

export function TeamView({ onChange }: ViewProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <ConnectionNotice title="Aucune équipe connectée">Aucun membre, e-mail, rôle ou historique n’est présenté comme réel. La gestion nécessite un modèle d’organisation et de permissions.</ConnectionNotice>
      <SettingsCard title="Membres" description="Les utilisateurs réels apparaîtront ici après connexion du backend." action={<Button type="button" size="sm" onClick={() => setFeedback("Invitation non envoyée : le service d’équipe n’est pas connecté.")}>Préparer une invitation</Button>}>
        <div className="rounded-2xl border border-dashed border-line-strong px-5 py-9 text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-surface-2 text-ink-2"><svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0M18 8v6M15 11h6" /></svg></span><p className="mt-4 text-sm font-semibold text-ink">Aucun membre disponible</p><p className="mt-1 text-xs leading-5 text-ink-3">Le compte connecté et son rôle doivent être fournis par le backend.</p></div>
        {feedback && <div className="mt-4"><InlineFeedback>{feedback}</InlineFeedback></div>}
      </SettingsCard>
      <SettingsCard title="Rôles prédéfinis" description="Catalogue d’accès préparé pour le MVP. L’affectation n’est pas active.">
        <div className="grid gap-3 md:grid-cols-2">{ROLES.map(([role, description]) => <button key={role} type="button" onClick={() => { onChange(); setFeedback(`${role} sélectionné dans le brouillon. Aucun membre n’a été modifié.`); }} className="rounded-2xl border border-line p-4 text-left transition hover:border-line-strong hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent-ink"><span className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-ink">{role}</span><Badge tone="neutral">Prédéfini</Badge></span><span className="mt-1.5 block text-xs leading-5 text-ink-3">{description}</span></button>)}</div>
        <div className="mt-4 rounded-xl bg-surface-2 px-4 py-3 text-xs leading-5 text-ink-3">Les rôles personnalisés et les permissions granulaires sont prévus après le MVP.</div>
      </SettingsCard>
    </div>
  );
}

const AI_PRESETS = ["Premium", "Minimaliste", "Accessible", "Énergique", "Luxe", "Naturel", "Technique", "Amical"] as const;

export function AiPreferencesView({ onChange }: ViewProps) {
  const [preset, setPreset] = useState<(typeof AI_PRESETS)[number]>("Premium");
  const [tone, setTone] = useState("Premium");
  const [validate, setValidate] = useState(true);
  return (
    <div className="space-y-4">
      <LocalOnlyNotice compact />
      <SettingsCard title="Personnalité de marque" description="Choisissez un point de départ, puis adaptez chaque réglage.">
        <fieldset><legend className="sr-only">Preset IA</legend><div className="flex flex-wrap gap-2">{AI_PRESETS.map((name) => <button key={name} type="button" aria-pressed={preset === name} onClick={() => { setPreset(name); setTone(name); onChange(); }} className={cn("min-h-10 rounded-full border px-4 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink", preset === name ? "border-ink bg-ink text-white" : "border-line-strong bg-surface text-ink-2 hover:text-ink")}>{name}</button>)}</div></fieldset>
        <div className="mt-6 grid gap-5 sm:grid-cols-2" onChange={onChange}><SettingsSelect label="Langue de génération" defaultValue="fr"><option value="fr">Français</option><option value="en">English</option></SettingsSelect><SettingsSelect label="Niveau de créativité" defaultValue="balanced"><option value="precise">Précis</option><option value="balanced">Équilibré</option><option value="creative">Créatif</option></SettingsSelect><SettingsSelect label="Longueur des contenus" defaultValue="medium"><option value="short">Courte</option><option value="medium">Moyenne</option><option value="long">Longue</option></SettingsSelect><SettingsSelect label="Adresse au client" defaultValue="vous"><option value="vous">Vouvoiement</option><option value="tu">Tutoiement</option></SettingsSelect><div className="sm:col-span-2"><Input label="Public cible" placeholder="Décrivez votre audience" /></div><div className="sm:col-span-2"><Textarea label="Ton de marque" value={tone} onChange={(event) => { setTone(event.target.value); onChange(); }} rows={3} /></div></div>
      </SettingsCard>
      <SettingsCard title="Vocabulaire et contrôle">
        <div className="grid gap-5 sm:grid-cols-2" onChange={onChange}><Textarea label="Mots à privilégier" placeholder="Séparez les termes par des virgules" rows={3} /><Textarea label="Mots interdits" placeholder="Séparez les termes par des virgules" rows={3} /></div>
        <div className="mt-5 border-t border-line"><SettingsRow title="Toujours valider avant application" description="Recommandé : aucune génération n’est insérée automatiquement."><SettingsToggle checked={validate} label="Validation avant application" onCheckedChange={(value) => { setValidate(value); onChange(); }} /></SettingsRow></div>
      </SettingsCard>
      <ConnectionNotice title="Génération non connectée">Ces préférences ne sont envoyées à aucun modèle et ne déclenchent aucune génération.</ConnectionNotice>
    </div>
  );
}
