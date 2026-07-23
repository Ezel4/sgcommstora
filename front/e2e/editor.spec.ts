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

test("le changement de page affiche les sections de la page choisie", async ({ page }) => {
  await page.goto("/editeur");
  await expect(page.getByTestId("sidebar-section-item").first()).toBeVisible();

  // Onglet Pages → choisir « À propos » (désormais configurée).
  await page.getByRole("button", { name: "Pages", exact: true }).click();
  await page.getByRole("button", { name: /À propos/ }).click();

  // La sidebar rebascule sur Sections et montre le bloc de texte de la page.
  await expect(page.getByTestId("sidebar-section-select").filter({ hasText: "Bloc de texte" })).toBeVisible();
});

test("ajout d'un item répétable dans une section depuis le panneau", async ({ page }) => {
  await page.goto("/editeur");

  // Sélectionner la section FAQ dans l'arborescence pour ouvrir son panneau.
  await page.getByTestId("sidebar-section-select").filter({ hasText: "FAQ" }).click();

  // On compte les blocs dans l'arborescence (stable : l'ajout sélectionne le
  // nouveau bloc, ce qui bascule le panneau de droite en édition de bloc).
  const blocks = page.getByTestId("sidebar-block-item");
  await expect(blocks.first()).toBeVisible();
  const before = await blocks.count();

  await page.getByTestId("inspector-add-item").first().click();
  await expect(blocks).toHaveCount(before + 1);
});
