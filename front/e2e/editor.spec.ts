import { expect, test } from "@playwright/test";

// Parcours éditeur (mode démo, persistance locale) : l'arborescence des
// sections se charge, le drawer « Ajouter une section » ajoute réellement une
// section, et l'annulation clavier la retire — le tout piloté depuis le shell,
// sans dépendre du contenu de l'iframe canvas.
test("ajout puis annulation d'une section depuis l'éditeur", async ({ page }) => {
  await page.goto("/editeur");

  const sections = page.getByTestId("sidebar-section-item");
  await expect(sections.first()).toBeVisible();
  const initialCount = await sections.count();
  expect(initialCount).toBeGreaterThan(0);

  // Ouvrir le drawer et ajouter une section « Newsletter ».
  await page.getByTestId("add-section-button").click();
  const drawer = page.getByTestId("section-library-drawer");
  await expect(drawer).toBeVisible();
  await drawer.getByTestId("section-card-newsletter").click();

  await expect(drawer).toBeHidden();
  await expect(sections).toHaveCount(initialCount + 1);

  // Annuler (Ctrl+Z) retire la section ajoutée.
  await page.keyboard.press("Control+z");
  await expect(sections).toHaveCount(initialCount);
});
