export type SettingsSectionId =
  | "profile"
  | "appearance"
  | "notifications"
  | "security"
  | "sessions"
  | "store-general"
  | "visual-identity"
  | "domains"
  | "locale"
  | "checkout"
  | "payments"
  | "shipping"
  | "taxes"
  | "legal"
  | "team"
  | "invitations"
  | "roles"
  | "activity"
  | "ai-preferences"
  | "store-generation"
  | "content-generation"
  | "ai-images"
  | "ai-history"
  | "subscription"
  | "billing"
  | "usage"
  | "integrations"
  | "privacy"
  | "support"
  | "danger";

export type SettingsIconName =
  | "user"
  | "appearance"
  | "bell"
  | "lock"
  | "device"
  | "store"
  | "palette"
  | "globe"
  | "locale"
  | "checkout"
  | "card"
  | "truck"
  | "tax"
  | "document"
  | "team"
  | "role"
  | "history"
  | "sparkles"
  | "image"
  | "plan"
  | "invoice"
  | "usage"
  | "integration"
  | "privacy"
  | "support"
  | "danger";

export type SettingsSectionDefinition = {
  id: SettingsSectionId;
  title: string;
  description: string;
  icon: SettingsIconName;
  keywords: string[];
  status?: "soon" | "visual";
};

export type SettingsGroupDefinition = {
  id: string;
  label: string;
  sections: SettingsSectionDefinition[];
};
