"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogoMark } from "@/components/marketing/Logo";
import { createClient } from "@/lib/supabase/client";

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
    <Suspense>
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

  async function handleOAuth(provider: "google" | "azure") {
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

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

    const { error, data } = await supabase.auth.signUp({ email, password });
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
    <div className="grid min-h-screen place-items-center bg-base px-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 sm:p-7">
        <div className="flex items-center gap-2.5">
          <LogoMark className="size-7" />
          <span className="text-[1.05rem] font-medium tracking-tight text-ink">Stora AI</span>
        </div>

        <h1 className="mt-6 text-xl font-light tracking-tight text-ink">
          {mode === "signin" ? "Connexion" : "Créer ton compte"}
        </h1>
        <p className="mt-1 text-sm text-ink-3">Pilote ta boutique générée par l'IA.</p>

        <div className="mt-6 space-y-2.5">
          <button
            type="button"
            onClick={() => handleOAuth("google")}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink transition hover:bg-white/[0.06]"
          >
            <GoogleIcon /> Continuer avec Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuth("azure")}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink transition hover:bg-white/[0.06]"
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
            <label className="mb-1.5 block text-xs font-medium text-ink-3">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none"
              placeholder="toi@entreprise.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-3">Mot de passe</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-sm text-rose">{error}</p>}
          {info && <p className="text-sm text-accent">{info}</p>}

          <button type="submit" disabled={loading} className="btn btn-light w-full !py-2.5 text-sm">
            {loading ? "Chargement…" : mode === "signin" ? "Se connecter" : "Créer le compte"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setInfo(null);
          }}
          className="mt-4 w-full text-center text-xs text-ink-3 transition hover:text-ink"
        >
          {mode === "signin" ? "Pas encore de compte ? En créer un" : "Déjà un compte ? Se connecter"}
        </button>
      </div>
    </div>
  );
}
