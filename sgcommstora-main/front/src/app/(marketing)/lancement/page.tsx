import { LandingNavbar } from "@/components/marketing/LandingNavbar";
import { LandingHero } from "@/components/marketing/LandingHero";
import { LandingValueProps } from "@/components/marketing/LandingValueProps";
import { LandingSteps } from "@/components/marketing/LandingSteps";
import { LandingProof } from "@/components/marketing/LandingProof";
import { LandingPricing } from "@/components/marketing/LandingPricing";
import { LandingFaqSimple } from "@/components/marketing/LandingFaqSimple";
import { LandingFinalCta } from "@/components/marketing/LandingFinalCta";
import { LandingFooter } from "@/components/marketing/LandingFooter";
import { GlassFilters } from "@/components/marketing/GlassFilters";
import { SmoothScroll } from "@/components/marketing/SmoothScroll";

// Identifiant par défaut de cette landing page visitée directement : propagé jusqu'à
// Supabase (user_metadata.signup_source) et jusqu'au CRM (crm_contacts.source).
// Une pub qui pointe ici avec ?ref=xxx écrase ce défaut, pour distinguer "arrivé
// directement sur /lancement" de "arrivé via telle pub précise".
const LANDING_SOURCE_DEFAULT = "lancement";

// Page de conversion dédiée aux campagnes : composants et copy propres à cette page,
// distincts de la home ("/") — pas de réutilisation brute des blocs de l'accueil.
export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const source = ref?.trim() || LANDING_SOURCE_DEFAULT;
  const SIGNUP_HREF = `/login?mode=signup&source=${encodeURIComponent(source)}`;

  return (
    <main className="grain relative min-h-screen bg-base">
      <GlassFilters />
      <SmoothScroll />

      <LandingNavbar signupHref={SIGNUP_HREF} />
      <LandingHero ctaHref={SIGNUP_HREF} />
      <LandingValueProps />
      <LandingSteps />
      <LandingProof />
      <LandingPricing ctaHref={SIGNUP_HREF} />
      <LandingFaqSimple />
      <LandingFinalCta ctaHref={SIGNUP_HREF} />
      <LandingFooter />
    </main>
  );
}
