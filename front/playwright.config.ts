import { defineConfig, devices } from "@playwright/test";

// Tests E2E des parcours clés (landing, éditeur, boutique publique).
//
// Le serveur est lancé en mode développement SANS configuration Supabase :
// l'application bascule alors en « mode démo » (données mock, éditeur en
// persistance locale), ce qui permet d'exécuter les parcours sans compte ni
// base de données. Voir src/lib/supabase/config.ts (isDevelopmentDemoMode).
const PORT = Number(process.env.PORT ?? 3000);
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "line" : "list",
  timeout: 60_000,
  expect: { timeout: 15_000 },
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    // Le premier build à froid (turbopack) peut être long.
    timeout: 180_000,
    // Force le mode démo : on neutralise toute config Supabase héritée.
    env: {
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
    },
  },
});
