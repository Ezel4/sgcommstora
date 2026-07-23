import { expect, test } from "@playwright/test";

// Parcours public : la page d'accueil marketing se charge et présente la
// proposition de valeur ainsi qu'un appel à l'action.
test("la landing page présente le titre et un CTA", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("Votre boutique e");
  await expect(page.getByText("générée par l’IA.")).toBeVisible();

  // Au moins un lien/bouton d'appel à l'action est présent.
  await expect(page.getByRole("link").first()).toBeVisible();
});
