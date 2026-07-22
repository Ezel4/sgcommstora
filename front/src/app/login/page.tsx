"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogoMark } from "@/components/marketing/Logo";
import { createClient } from "@/lib/supabase/client";
import {
  hasSupabaseConfig,
  isDevelopmentDemoMode,
  SUPABASE_CONFIGURATION_MESSAGE,
} from "@/lib/supabase/config";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.3h6.47a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.66Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.88-3.02c-1.08.72-2.46 1.15-4.06 1.15-3.12 0-5.76-2.11-6.7-4.94H1.3v3.11A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.3 14.29a7.2 7.2 0 0 1 0-4.6V6.58H1.3a12 12 0 0 0 0 10.84l4-3.13Z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.3 6.58l4 3.11C6.24 6.86 8.88 4.75 12 4.75Z" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path fill="#F25022" d="M2 2h9.3v9.3H2z" />
      <path fill="#7FBA00" d="M12.7 2H22v9.3h-9.3z" />
      <path fill="#00A4EF" d="M2 12.7h9.3V22H2z" />
      <path fill="#FFB900" d="M12.7 12.7H22V22h-9.3z" />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center bg-base text-sm text-ink-2">Chargement…</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : "signin",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const supabaseConfigured = hasSupabaseConfig();
  const demoMode = isDevelopmentDemoMode();
  const queryError = searchParams.get("error");
  const queryErrorMessage =
    queryError === "configuration"
      ? SUPABASE_CONFIGURATION_MESSAGE
      : queryError === "oauth"
        ? "La connexion avec le fournisseur externe a échoué. Réessaie."
        : null;

  // Origine de l'inscription (ex: "lancement" pour la landing page). Récupérée depuis
  // l'URL puis conservée en cookie pour survivre à la redirection OAuth vers /auth/callback,
  // qui n'a plus les query params d'origine.
  useEffect(() => {
    const source = searchParams.get("source");
    if (source) {
      document.cookie = `stora_signup_source=${encodeURIComponent(source)}; path=/; max-age=${60 * 60 * 24 * 30}`;
    }
  }, [searchParams]);

  function getSignupSource() {
    return (
      searchParams.get("source") ??
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("stora_signup_source="))
        ?.split("=")[1]
    );
  }

  async function handleOAuth(provider: "google" | "azure") {
    setError(null);
    if (!supabaseConfigured) {
      setError(SUPABASE_CONFIGURATION_MESSAGE);
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    if (!supabaseConfigured) {
      setError(SUPABASE_CONFIGURATION_MESSAGE);
      setLoading(false);
      return;
    }

    const supabase = createClient();

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      router.push("/onboarding");
      router.refresh();
      return;
    }

    const signupSource = getSignupSource();
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: signupSource ? { data: { signup_source: signupSource } } : undefined,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      router.push("/onboarding");
      router.refresh();
      return;
    }
    setInfo("Compte créé. Vérifie ta boîte mail pour confirmer l'adresse, puis connecte-toi.");
    setMode("signin");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-base px-4 py-8 sm:py-12">
      <div className="w-full max-w-sm rounded-3xl border border-line bg-elevated p-6 shadow-[var(--elevation-2)] sm:p-8">
        <Link href="/" aria-label="Retour à l’accueil de Sigmood IA" className="inline-flex items-center gap-2.5 rounded-full">
          <LogoMark className="size-7" />
          <span className="text-[1.05rem] font-medium tracking-tight text-ink">Sigmood IA</span>
        </Link>

        <h1 className="mt-7 text-2xl font-normal tracking-tight text-ink">
          {mode === "signin" ? "Connexion" : "Créer ton compte"}
        </h1>
        <p className="mt-1 text-sm text-ink-3">Pilote ta boutique générée par l&apos;IA.</p>

        {!supabaseConfigured && (
          <div role="alert" className="mt-5 rounded-2xl border border-danger/25 bg-danger-soft p-4 text-sm text-danger">
            <p>{SUPABASE_CONFIGURATION_MESSAGE}</p>
            {demoMode && (
              <Link href="/dashboard" className="mt-3 inline-flex font-semibold underline underline-offset-4">
                Explorer le dashboard de démonstration
              </Link>
            )}
          </div>
        )}

        <div className="mt-7 space-y-2.5">
          <button
            type="button"
            disabled={!supabaseConfigured || loading}
            onClick={() => handleOAuth("google")}
            className="flex min-h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-white/35 px-3.5 py-2.5 text-sm text-ink transition hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white/35"
          >
            <GoogleIcon /> Continuer avec Google
          </button>
          <button
            type="button"
            disabled={!supabaseConfigured || loading}
            onClick={() => handleOAuth("azure")}
            className="flex min-h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-white/35 px-3.5 py-2.5 text-sm text-ink transition hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white/35"
          >
            <MicrosoftIcon /> Continuer avec Microsoft
          </button>
        </div>

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="text-xs text-ink-4">ou par email</span>
          <span className="h-px flex-1 bg-line" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-[0.8125rem] font-medium text-ink-2">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              disabled={!supabaseConfigured || loading}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-11 w-full rounded-xl border border-line bg-white/35 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="toi@entreprise.com"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-[0.8125rem] font-medium text-ink-2">Mot de passe</label>
            <input
              id="login-password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              disabled={!supabaseConfigured || loading}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-h-11 w-full rounded-xl border border-line bg-white/35 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          {(error ?? queryErrorMessage) && <p role="alert" className="text-sm text-danger">{error ?? queryErrorMessage}</p>}
          {info && <p role="status" className="text-sm text-accent-ink">{info}</p>}

          <button type="submit" disabled={loading || !supabaseConfigured} aria-busy={loading} className="btn btn-light w-full !py-2.5 text-sm">
            {loading ? "Chargement…" : mode === "signin" ? "Se connecter" : "Créer le compte"}
          </button>
        </form>

        <button
          type="button"
          disabled={!supabaseConfigured || loading}
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setInfo(null);
          }}
          className="mt-4 flex min-h-11 w-full items-center justify-center rounded-full px-3 text-center text-[0.8125rem] text-ink-3 transition hover:bg-white/45 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mode === "signin" ? "Pas encore de compte ? En créer un" : "Déjà un compte ? Se connecter"}
        </button>
      </div>
    </div>
  );
}
