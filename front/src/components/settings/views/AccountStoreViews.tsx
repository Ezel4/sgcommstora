"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { signOut, signOutEverywhere } from "@/app/(app)/actions";
import { useDashboardAccount } from "@/components/dashboard/DashboardAccountContext";
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
} from "../SettingsPrimitives";

type ViewProps = { onChange: () => void };

export function ProfileView({ onChange, email = "" }: ViewProps & { email?: string }) {
  const uploadRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string>("/avatar-sigmood.png");
  const [avatarLabel, setAvatarLabel] = useState("Avatar 3D Sigmood");

  const chooseAvatar = (value: string, label: string) => {
    setAvatar(value);
    setAvatarLabel(label);
    onChange();
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
        setAvatarLabel(`${file.name} · aperçu local`);
        onChange();
      }
    });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <LocalOnlyNotice />
      <SettingsCard title="Photo de profil" description="Votre profil personnel est distinct de l’identité publique de la boutique.">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div
            role="img"
            aria-label={`Aperçu : ${avatarLabel}`}
            className="size-24 shrink-0 rounded-[28px] border-4 border-white bg-gradient-to-br from-[#ffdca8] via-[#8eddd8] to-[#72a8d8] bg-cover bg-center shadow-[var(--elevation-3)]"
            style={avatar ? { backgroundImage: `url(${JSON.stringify(avatar).slice(1, -1)})` } : undefined}
          >
            {!avatar && <span className="grid size-full place-items-center text-xl font-semibold text-ink">SI</span>}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">{avatarLabel}</p>
            <p className="mt-1 text-xs leading-5 text-ink-3">JPG, PNG ou WebP. Le fichier choisi reste dans ce navigateur et n’est pas importé.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <input ref={uploadRef} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handleFile} />
              <Button type="button" size="sm" variant="secondary" onClick={() => uploadRef.current?.click()}>Choisir une photo</Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => chooseAvatar("/avatar-sigmood.png", "Avatar 3D Sigmood")}>Avatar Sigmood</Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => chooseAvatar("", "Initiales")}>Utiliser les initiales</Button>
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Informations personnelles" description="Seul l’e-mail peut provenir de la session connectée ; les autres champs restent vides tant que le profil client n’est pas connecté.">
        <div className="grid gap-5 sm:grid-cols-2" onChange={onChange}>
          <Input label="Prénom" name="firstName" placeholder="Votre prénom" autoComplete="given-name" />
          <Input label="Nom" name="lastName" placeholder="Votre nom" autoComplete="family-name" />
          <Input label="Adresse e-mail" name="email" type="email" defaultValue={email} placeholder="vous@exemple.fr" autoComplete="email" hint="La modification de l’e-mail devra être confirmée." />
          <Input label="Téléphone" name="phone" type="tel" placeholder="+33 6 00 00 00 00" autoComplete="tel" />
          <Input label="Fonction" name="jobTitle" placeholder="Ex. Fondatrice" autoComplete="organization-title" />
          <SettingsSelect label="Pays" defaultValue="FR"><option value="FR">France</option><option value="BE">Belgique</option><option value="CH">Suisse</option><option value="CA">Canada</option></SettingsSelect>
        </div>
      </SettingsCard>

      <SettingsCard title="Interface et formats" description="Préférences personnelles du dashboard, sans effet sur la vitrine.">
        <div className="grid gap-5 sm:grid-cols-2" onChange={onChange}>
          <SettingsSelect label="Langue de l’interface" defaultValue="fr"><option value="fr">Français</option><option value="en">English</option></SettingsSelect>
          <SettingsSelect label="Fuseau horaire" defaultValue="Europe/Paris"><option>Europe/Paris</option><option>Europe/Brussels</option><option>America/Montreal</option></SettingsSelect>
          <SettingsSelect label="Format de date" defaultValue="dd/MM/yyyy"><option value="dd/MM/yyyy">31/12/2026</option><option value="yyyy-MM-dd">2026-12-31</option></SettingsSelect>
          <SettingsSelect label="Format horaire" defaultValue="24"><option value="24">24 heures</option><option value="12">12 heures</option></SettingsSelect>
        </div>
      </SettingsCard>
    </div>
  );
}

const THEMES = [
  { id: "light", label: "Clair", surface: "bg-[#f8f7f3]", card: "bg-white" },
  { id: "dark", label: "Sombre", surface: "bg-[#1d211f]", card: "bg-[#303633]" },
  { id: "system", label: "Système", surface: "bg-gradient-to-r from-[#f8f7f3] to-[#1d211f]", card: "bg-white/80" },
] as const;

export function AppearanceView({ onChange }: ViewProps) {
  const [theme, setTheme] = useState<(typeof THEMES)[number]["id"]>("system");
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.dataset.sigmoodReduceMotion = "true";
    } else {
      delete document.documentElement.dataset.sigmoodReduceMotion;
    }
  }, [reduceMotion]);

  return (
    <div className="space-y-4">
      <ConnectionNotice title="Thème à connecter">Le choix clair, sombre ou système est interactif dans cette page, mais le thème global du dashboard n’est pas encore connecté.</ConnectionNotice>
      <SettingsCard title="Thème de l’interface" description="Choisissez l’apparence que le dashboard utilisera après connexion de la préférence.">
        <fieldset>
          <legend className="sr-only">Thème de l’interface</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {THEMES.map((option) => {
              const selected = theme === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => { setTheme(option.id); onChange(); }}
                  className={cn("rounded-2xl border p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink", selected ? "border-accent bg-accent-soft/40" : "border-line hover:border-line-strong")}
                >
                  <span className={cn("block h-24 rounded-xl p-3", option.surface)}>
                    <span className={cn("block h-3 w-2/3 rounded-full", option.card)} />
                    <span className={cn("mt-2 block h-10 rounded-lg", option.card)} />
                  </span>
                  <span className="mt-3 flex items-center justify-between gap-2 text-sm font-semibold text-ink"><span>{option.label}</span>{selected && <span className="size-2 rounded-full bg-accent" />}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </SettingsCard>
      <SettingsCard title="Confort visuel">
        <SettingsRow title="Réduire les animations" description="Appliqué immédiatement dans cet onglet. Ce brouillon n’est pas synchronisé avec votre compte.">
          <SettingsToggle checked={reduceMotion} label="Réduire les animations" onCheckedChange={(checked) => { setReduceMotion(checked); onChange(); }} />
        </SettingsRow>
        <div className="border-t border-line" />
        <SettingsRow title="Densité de l’interface" description="La personnalisation fine sera proposée dans une version ultérieure."><Badge tone="neutral">Bientôt disponible</Badge></SettingsRow>
        <div className="border-t border-line" />
        <SettingsRow title="Contraste renforcé" description="Emplacement préparé, sans modification globale à ce stade."><Badge tone="neutral">Bientôt disponible</Badge></SettingsRow>
      </SettingsCard>
    </div>
  );
}

const NOTIFICATION_ROWS = [
  "Nouvelles commandes",
  "Commandes annulées",
  "Paiements reçus",
  "Paiements échoués",
  "Stocks faibles",
  "Ruptures de stock",
  "Demandes de retour",
  "Nouveaux clients",
  "Performances de la boutique",
  "Suggestions IA",
  "Génération IA terminée",
  "Activité de l’équipe",
  "Sécurité du compte",
  "Abonnement et facturation",
  "Annonces produit Sigmood IA",
] as const;

type NotificationChannel = "app" | "email" | "browser";
type NotificationState = Record<string, Record<NotificationChannel, boolean>>;

function createRecommendedNotifications(): NotificationState {
  return Object.fromEntries(NOTIFICATION_ROWS.map((name) => [name, {
    app: true,
    email: name !== "Génération IA terminée" && name !== "Annonces produit Sigmood IA",
    browser: ["Nouvelles commandes", "Paiements échoués", "Stocks faibles", "Sécurité du compte"].includes(name),
  }])) as NotificationState;
}

function NotificationCheckbox({ checked, disabled, label, onChange }: { checked: boolean; disabled?: boolean; label: string; onChange: (checked: boolean) => void }) {
  return <input type="checkbox" checked={checked} disabled={disabled} aria-label={label} onChange={(event) => onChange(event.target.checked)} className="size-5 rounded border-line-strong accent-[#1fc5be] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink disabled:opacity-55" />;
}

export function NotificationsView({ onChange }: ViewProps) {
  const [values, setValues] = useState(createRecommendedNotifications);
  const setChannel = (name: string, channel: NotificationChannel, checked: boolean) => {
    setValues((current) => ({ ...current, [name]: { ...current[name], [channel]: checked } }));
    onChange();
  };
  const setAll = (checked: boolean) => {
    setValues(Object.fromEntries(NOTIFICATION_ROWS.map((name) => [name, name === "Sécurité du compte" ? { app: true, email: true, browser: checked } : { app: checked, email: checked, browser: checked }])) as NotificationState);
    onChange();
  };

  return (
    <div className="space-y-4">
      <LocalOnlyNotice compact />
      <SettingsCard
        title="Préférences par canal"
        description="Les alertes de sécurité essentielles restent activées dans l’application et par e-mail."
        action={<div className="flex flex-wrap gap-2"><Button type="button" size="sm" variant="ghost" onClick={() => setAll(true)}>Tout activer</Button><Button type="button" size="sm" variant="ghost" onClick={() => setAll(false)}>Tout désactiver</Button><Button type="button" size="sm" variant="secondary" onClick={() => { setValues(createRecommendedNotifications()); onChange(); }}>Réglages recommandés</Button></div>}
      >
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[620px] border-collapse text-left">
            <thead><tr className="border-b border-line text-xs text-ink-3"><th className="pb-3 font-medium">Notification</th><th className="w-28 pb-3 text-center font-medium">Application</th><th className="w-24 pb-3 text-center font-medium">E-mail</th><th className="w-28 pb-3 text-center font-medium">Navigateur</th></tr></thead>
            <tbody>{NOTIFICATION_ROWS.map((name) => <tr key={name} className="border-b border-line last:border-0"><th scope="row" className="py-3.5 text-sm font-medium text-ink">{name}{name === "Sécurité du compte" && <span className="ml-2 text-xs font-medium text-success">Essentiel</span>}</th>{(["app", "email", "browser"] as NotificationChannel[]).map((channel) => <td key={channel} className="py-3.5 text-center"><NotificationCheckbox checked={values[name][channel]} disabled={name === "Sécurité du compte" && channel !== "browser"} label={`${name} — ${channel}`} onChange={(checked) => setChannel(name, channel, checked)} /></td>)}</tr>)}</tbody>
          </table>
        </div>
        <div className="space-y-3 md:hidden">
          {NOTIFICATION_ROWS.map((name) => <div key={name} className="rounded-2xl bg-surface-2 p-4"><div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold text-ink">{name}</p>{name === "Sécurité du compte" && <Badge tone="success">Essentiel</Badge>}</div><div className="mt-4 grid grid-cols-3 gap-2">{(["app", "email", "browser"] as NotificationChannel[]).map((channel) => <label key={channel} className="flex min-h-16 flex-col items-center justify-center gap-2 rounded-xl bg-surface px-1 text-xs font-medium capitalize text-ink-3"><NotificationCheckbox checked={values[name][channel]} disabled={name === "Sécurité du compte" && channel !== "browser"} label={`${name} — ${channel}`} onChange={(checked) => setChannel(name, channel, checked)} />{channel === "app" ? "Application" : channel === "email" ? "E-mail" : "Navigateur"}</label>)}</div></div>)}
        </div>
      </SettingsCard>
    </div>
  );
}

export function SecurityView({ onChange }: ViewProps) {
  const { demoMode } = useDashboardAccount();
  const [twoFactor, setTwoFactor] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [confirmGlobalSignOut, setConfirmGlobalSignOut] = useState(false);
  const [globalSignOutPending, startGlobalSignOut] = useTransition();
  return (
    <div className="space-y-4">
      <ConnectionNotice>Le mot de passe, la double authentification et le détail des appareils restent à connecter. La déconnexion globale utilise Supabase uniquement pour un compte réellement authentifié.</ConnectionNotice>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <SettingsCard title="Mot de passe" description="Le formulaire valide uniquement l’intention dans l’interface.">
          <div className="grid gap-5" onChange={onChange}>
            <Input label="Mot de passe actuel" type="password" autoComplete="current-password" />
            <Input label="Nouveau mot de passe" type="password" autoComplete="new-password" hint="12 caractères minimum recommandés." />
            <Input label="Confirmer le mot de passe" type="password" autoComplete="new-password" />
          </div>
          <Button type="button" className="mt-5" onClick={() => setFeedback("Demande non envoyée : connectez d’abord le service d’authentification.")}>Préparer la modification</Button>
          {feedback && <div className="mt-3"><InlineFeedback>{feedback}</InlineFeedback></div>}
        </SettingsCard>
        <section className="rounded-[24px] border border-warning/20 bg-warning-soft p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-warning">Niveau de sécurité</p>
          <p className="mt-3 text-2xl font-medium tracking-tight text-ink">À vérifier</p>
          <p className="mt-2 text-xs leading-5 text-ink-2">Les signaux de sécurité du compte ne sont pas encore disponibles.</p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/70"><div className="h-full w-1/3 rounded-full bg-warning" /></div>
        </section>
      </div>
      <SettingsCard title="Double authentification" description="Ajoutez une seconde étape de vérification à la connexion.">
        <SettingsRow title="Application d’authentification" description={twoFactor ? "Activation préparée localement, sans QR code ni secret créé." : "Recommandé pour protéger les actions sensibles."}><SettingsToggle checked={twoFactor} label="Double authentification" onCheckedChange={(checked) => { setTwoFactor(checked); onChange(); }} /></SettingsRow>
        <div className="border-t border-line" />
        <SettingsRow title="Passkeys" description="Clés d’accès biométriques et appareils de confiance."><Badge tone="neutral">Version future</Badge></SettingsRow>
      </SettingsCard>
      <SettingsCard title="Appareils connectés" description="Aucune donnée de session n’est disponible dans cette interface.">
        <div className="rounded-2xl border border-line bg-surface-2 p-4 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-start gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface text-ink-2"><svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg></span><div><p className="text-sm font-semibold text-ink">Cet appareil</p><p className="mt-1 text-xs leading-5 text-ink-3">Navigateur, localisation et dernière activité : à connecter</p><Badge tone="success" className="mt-2">Session actuelle</Badge></div></div>
          <form action={signOut} className="mt-4 sm:mt-0">
            <Button type="submit" size="sm" variant="ghost" disabled={demoMode}>
              {demoMode ? "Indisponible en démo" : "Déconnecter"}
            </Button>
          </form>
        </div>
        <div className="mt-4 flex flex-col gap-4 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-ink">Déconnecter tous les appareils</p>
            <p className="mt-1 text-xs leading-5 text-ink-3">Révoque toutes les sessions Supabase, y compris celle-ci.</p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            disabled={demoMode}
            onClick={() => setConfirmGlobalSignOut(true)}
          >
            {demoMode ? "Indisponible en démo" : "Tout déconnecter"}
          </Button>
        </div>
      </SettingsCard>
      {confirmGlobalSignOut && (
        <ConfirmDialog
          title="Déconnecter tous les appareils ?"
          description="Toutes les sessions Supabase de ce compte seront révoquées. Vous devrez vous reconnecter sur chaque appareil."
          confirmLabel="Tout déconnecter"
          pending={globalSignOutPending}
          onCancel={() => setConfirmGlobalSignOut(false)}
          onConfirm={() => {
            startGlobalSignOut(async () => {
              await signOutEverywhere();
            });
          }}
        />
      )}
    </div>
  );
}

export function StoreGeneralView({ onChange }: ViewProps) {
  return (
    <div className="space-y-4">
      <ConnectionNotice title="Données de démonstration locales">Le nom, le positionnement et le sous-domaine proviennent du jeu de données local du dashboard. Les autres champs ne sont pas connectés.</ConnectionNotice>
      <SettingsCard title="Identité de la boutique" description="Informations internes utilisées pour organiser votre espace.">
        <div className="grid gap-5 sm:grid-cols-2" onChange={onChange}>
          <Input label="Nom de la boutique" defaultValue={activeStore.name} />
          <Input label="Raison sociale" placeholder="À renseigner" autoComplete="organization" />
          <div className="sm:col-span-2"><Textarea label="Description courte" defaultValue={activeStore.niche} rows={3} /></div>
          <SettingsSelect label="Secteur d’activité" defaultValue="beauty"><option value="beauty">Beauté et bien-être</option><option value="fashion">Mode</option><option value="home">Maison</option><option value="other">Autre</option></SettingsSelect>
          <Input label="Numéro d’entreprise" placeholder="À renseigner" />
          <Input label="Numéro de TVA" placeholder="FR XX 123456789" />
          <SettingsSelect label="Statut de la boutique" defaultValue={activeStore.status}><option value="draft">Brouillon</option><option value="needs-review">À vérifier</option><option value="published">Publiée</option></SettingsSelect>
        </div>
      </SettingsCard>
      <SettingsCard title="Informations publiques" description="Ces informations pourront être visibles par les clients sur la boutique et les documents.">
        <div className="grid gap-5 sm:grid-cols-2" onChange={onChange}>
          <Input label="E-mail de contact" type="email" placeholder="bonjour@votreboutique.fr" autoComplete="email" />
          <Input label="Téléphone" type="tel" placeholder="À renseigner" autoComplete="tel" />
          <div className="sm:col-span-2"><Input label="Adresse commerciale" placeholder="À renseigner" autoComplete="street-address" /></div>
          <SettingsSelect label="Pays" defaultValue="FR"><option value="FR">France</option><option value="BE">Belgique</option><option value="CH">Suisse</option></SettingsSelect>
          <SettingsSelect label="Devise principale" defaultValue="EUR"><option value="EUR">EUR — Euro</option><option value="CHF">CHF — Franc suisse</option><option value="CAD">CAD — Dollar canadien</option></SettingsSelect>
        </div>
      </SettingsCard>
      <aside className="overflow-hidden rounded-[24px] bg-ink p-5 text-white sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">Aperçu local</p>
        <div className="mt-5 flex items-center gap-4"><span className="brand-gradient grid size-14 place-items-center rounded-2xl text-xl font-semibold text-ink">{activeStore.name.slice(0, 1)}</span><div><p className="text-xl font-medium">{activeStore.name}</p><p className="mt-1 text-sm text-white/60">{activeStore.niche}</p></div></div>
        <p className="mt-5 text-xs text-white/50">{activeStore.subdomain} · aperçu issu des données de démonstration</p>
      </aside>
    </div>
  );
}

export function DomainsView({ onChange }: ViewProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <ConnectionNotice>Le statut DNS, le certificat SSL et la connexion d’un domaine personnalisé nécessitent un service de domaines.</ConnectionNotice>
      <SettingsCard title="Sous-domaine Sigmood" description="Adresse locale associée au jeu de démonstration du dashboard." action={<Badge tone="warning">À vérifier</Badge>}>
        <div className="flex flex-col gap-4 rounded-2xl bg-surface-2 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0"><p className="truncate text-sm font-semibold text-ink">{activeStore.subdomain}</p><p className="mt-1 text-xs text-ink-3">Domaine principal dans la démo · SSL non vérifié</p></div>
          <Button type="button" size="sm" variant="secondary" onClick={() => setFeedback("Vérification non lancée : connectez le service DNS.")}>Vérifier</Button>
        </div>
      </SettingsCard>
      <SettingsCard title="Domaine personnalisé" description="Connectez une adresse que vous possédez." action={<Badge tone="neutral">Non connecté</Badge>}>
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end" onChange={onChange}>
          <Input label="Nom de domaine" placeholder="www.votreboutique.fr" inputMode="url" />
          <Button type="button" onClick={() => setFeedback("Domaine non envoyé : cette action est une préparation d’interface.")}>Préparer la connexion</Button>
        </div>
        <details className="mt-5 rounded-2xl border border-line bg-surface-2">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-ink focus-visible:outline-2 focus-visible:outline-accent-ink [&::-webkit-details-marker]:hidden">Comprendre la configuration DNS</summary>
          <div className="border-t border-line px-4 py-4 text-xs leading-5 text-ink-2"><p>Le DNS relie votre domaine à votre boutique. Les valeurs exactes seront affichées ici lorsque le service de domaines sera disponible.</p><dl className="mt-3 grid gap-2 sm:grid-cols-3"><div><dt className="text-ink-4">Type</dt><dd className="font-medium text-ink">À connecter</dd></div><div><dt className="text-ink-4">Nom</dt><dd className="font-medium text-ink">—</dd></div><div><dt className="text-ink-4">Valeur</dt><dd className="font-medium text-ink">—</dd></div></dl></div>
        </details>
        {feedback && <div className="mt-4"><InlineFeedback>{feedback}</InlineFeedback></div>}
      </SettingsCard>
    </div>
  );
}

export function LocaleView({ onChange }: ViewProps) {
  return (
    <div className="space-y-4">
      <LocalOnlyNotice compact />
      <SettingsCard title="Marché principal" description="Réglages MVP utilisés comme brouillon pour la future configuration de la boutique.">
        <div className="grid gap-5 sm:grid-cols-2" onChange={onChange}>
          <SettingsSelect label="Langue principale" defaultValue="fr"><option value="fr">Français</option><option value="en">English</option><option value="de">Deutsch</option></SettingsSelect>
          <SettingsSelect label="Pays principal" defaultValue="FR"><option value="FR">France</option><option value="BE">Belgique</option><option value="CH">Suisse</option><option value="CA">Canada</option></SettingsSelect>
          <SettingsSelect label="Devise principale" defaultValue="EUR"><option value="EUR">EUR — Euro (€)</option><option value="CHF">CHF — Franc suisse</option><option value="CAD">CAD — Dollar canadien</option></SettingsSelect>
          <SettingsSelect label="Fuseau horaire" defaultValue="Europe/Paris"><option>Europe/Paris</option><option>Europe/Brussels</option><option>Europe/Zurich</option><option>America/Montreal</option></SettingsSelect>
          <SettingsSelect label="Unité de poids" defaultValue="kg"><option value="kg">Kilogrammes (kg)</option><option value="lb">Livres (lb)</option></SettingsSelect>
          <SettingsSelect label="Affichage des prix" defaultValue="after"><option value="after">49,00 €</option><option value="before">€ 49,00</option></SettingsSelect>
        </div>
      </SettingsCard>
      <SettingsCard title="Internationalisation avancée">
        <SettingsRow title="Langues secondaires" description="Traductions de catalogue et sélecteur de langue."><Badge tone="neutral">Version 1</Badge></SettingsRow><div className="border-t border-line" /><SettingsRow title="Multi-devises et marchés" description="Prix localisés et règles par marché."><Badge tone="neutral">Version 2</Badge></SettingsRow>
      </SettingsCard>
    </div>
  );
}
