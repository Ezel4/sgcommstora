import { expect, test } from "@playwright/test";

// Parcours public : la boutique de démonstration (Atelier Nival) se rend
// depuis son document structuré, avec le nom de la boutique visible.
test("la boutique de démonstration se rend depuis son document", async ({ page }) => {
  await page.goto("/boutique/atelier-nival");

  // Le nom de la boutique apparaît (header + hero), ainsi que le bandeau d'aperçu local.
  await expect(page.getByText("Atelier Nival").first()).toBeVisible();
  await expect(page.getByText("Boutique générée avec")).toBeVisible();
});
