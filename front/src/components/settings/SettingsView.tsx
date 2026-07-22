"use client";

import { SETTINGS_SECTION_BY_ID } from "./settings-data";
import type { SettingsSectionId } from "./types";
import { AppearanceView, DomainsView, LocaleView, NotificationsView, ProfileView, SecurityView, StoreGeneralView } from "./views/AccountStoreViews";
import { AiPreferencesView, CheckoutView, PaymentsView, ShippingView, TaxesView, TeamView } from "./views/CommerceTeamViews";
import { AiImagesView, BillingView, DangerView, IntegrationsView, LegalView, PlaceholderView, PrivacyView, SubscriptionView, SupportView, UsageView, VisualIdentityView } from "./views/SigmoodViews";

export function SettingsView({ id, onChange, contactRequested = false, profileEmail = "" }: { id: SettingsSectionId; onChange: () => void; contactRequested?: boolean; profileEmail?: string }) {
  switch (id) {
    case "profile": return <ProfileView onChange={onChange} email={profileEmail} />;
    case "appearance": return <AppearanceView onChange={onChange} />;
    case "notifications": return <NotificationsView onChange={onChange} />;
    case "security": return <SecurityView onChange={onChange} />;
    case "store-general": return <StoreGeneralView onChange={onChange} />;
    case "visual-identity": return <VisualIdentityView onChange={onChange} />;
    case "domains": return <DomainsView onChange={onChange} />;
    case "locale": return <LocaleView onChange={onChange} />;
    case "checkout": return <CheckoutView onChange={onChange} />;
    case "payments": return <PaymentsView onChange={onChange} />;
    case "shipping": return <ShippingView onChange={onChange} />;
    case "taxes": return <TaxesView onChange={onChange} />;
    case "legal": return <LegalView />;
    case "team":
    case "roles": return <TeamView onChange={onChange} />;
    case "ai-preferences": return <AiPreferencesView onChange={onChange} />;
    case "ai-images": return <AiImagesView onChange={onChange} />;
    case "subscription": return <SubscriptionView />;
    case "billing": return <BillingView onChange={onChange} />;
    case "usage": return <UsageView />;
    case "integrations": return <IntegrationsView />;
    case "privacy": return <PrivacyView onChange={onChange} />;
    case "support": return <SupportView onChange={onChange} contactRequested={contactRequested} />;
    case "danger": return <DangerView />;
    default: {
      const section = SETTINGS_SECTION_BY_ID[id];
      return <PlaceholderView title={section.title} description={section.description} status={section.status} />;
    }
  }
}
