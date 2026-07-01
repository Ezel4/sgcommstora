import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stora AI · Votre boutique e-commerce, generee par l'IA",
  description:
    "Decrivez votre projet, l'IA construit votre boutique : design, produits, visuels et textes. Gerez tout depuis un seul tableau de bord. Stora AI, c'est Shopify pilote par l'IA.",
  keywords: [
    "e-commerce",
    "IA",
    "boutique en ligne",
    "Stora AI",
    "generateur de boutique IA",
    "alternative Shopify",
  ],
  openGraph: {
    title: "Stora AI · Votre boutique e-commerce, generee par l'IA",
    description:
      "Decrivez votre projet, l'IA construit votre boutique complete en quelques minutes.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="bg-base text-ink antialiased">{children}</body>
    </html>
  );
}
