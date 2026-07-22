"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/marketing/Logo";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseConfig, SUPABASE_CONFIGURATION_MESSAGE } from "@/lib/supabase/config";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabaseConfigured = hasSupabaseConfig();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!supabaseConfigured) {
      setError(SUPABASE_CONFIGURATION_MESSAGE);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="grid min-h-screen place-items-center bg-base px-4 py-8 sm:py-12">
      <div className="w-full max-w-sm rounded-3xl border border-line bg-elevated p-6 shadow-[var(--elevation-2)] sm:p-8">
        <Link href="/" aria-label="Retour à l’accueil de Sigmood IA" className="inline-flex items-center gap-2.5 rounded-full">
          <LogoMark className="size-7" />
          <span className="text-[1.05rem] font-medium tracking-tight text-ink">
            Sigmood IA <span className="text-ink-3">· Admin</span>
          </span>
        </Link>

        <h1 className="mt-7 text-2xl font-normal tracking-tight text-ink">
          Connexion
        </h1>
        <p className="mt-1 text-sm text-ink-3">
          Accès réservé à l&apos;équipe Sigmood IA pour le CRM interne.
        </p>

        {!supabaseConfigured && (
          <p role="alert" className="mt-5 rounded-2xl border border-danger/25 bg-danger-soft p-4 text-sm text-danger">
            {SUPABASE_CONFIGURATION_MESSAGE}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-3.5">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-[0.8125rem] font-medium text-ink-2">Email</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              disabled={!supabaseConfigured || loading}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-11 w-full rounded-xl border border-line bg-white/35 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="toi@sigmood.app"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1.5 block text-[0.8125rem] font-medium text-ink-2">Mot de passe</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              disabled={!supabaseConfigured || loading}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-h-11 w-full rounded-xl border border-line bg-white/35 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          {error && <p role="alert" className="text-sm text-danger">{error}</p>}

          <button type="submit" disabled={loading || !supabaseConfigured} aria-busy={loading} className="btn btn-light w-full !py-2.5 text-sm">
            {loading ? "Chargement…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
