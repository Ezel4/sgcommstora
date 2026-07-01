"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/marketing/Logo";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

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
      router.push("/admin");
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
      router.push("/admin");
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
          <span className="text-[1.05rem] font-medium tracking-tight text-ink">
            Sigmood <span className="text-ink-3">· Admin</span>
          </span>
        </div>

        <h1 className="mt-6 text-xl font-light tracking-tight text-ink">
          {mode === "signin" ? "Connexion" : "Créer le compte admin"}
        </h1>
        <p className="mt-1 text-sm text-ink-3">
          Accès réservé à l'équipe Sigmood pour le CRM interne.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-3">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-line bg-white/[0.03] px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-4 focus:border-line-strong focus:outline-none"
              placeholder="toi@sigmood.app"
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
          {mode === "signin" ? "Premier accès ? Créer le compte admin" : "Déjà un compte ? Se connecter"}
        </button>
      </div>
    </div>
  );
}
