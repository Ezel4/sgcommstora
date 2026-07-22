export const SUPABASE_CONFIGURATION_MESSAGE =
  "Le service d’authentification n’est pas configuré. Vérifie les variables Supabase du déploiement.";

export function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
  );
}

export function isDevelopmentDemoMode() {
  return process.env.NODE_ENV === "development" && !hasSupabaseConfig();
}

export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    throw new Error(SUPABASE_CONFIGURATION_MESSAGE);
  }

  return { url, anonKey };
}
