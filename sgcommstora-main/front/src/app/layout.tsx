import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stora AI — Créez votre boutique e-commerce avec l’IA",
  description:
    "Décrivez votre projet : Stora génère le design, le catalogue, les visuels et les textes de votre boutique e-commerce, puis vous aide à la piloter.",
  keywords: [
    "e-commerce",
    "IA",
    "boutique en ligne",
    "Stora AI",
    "générateur de boutique IA",
    "alternative Shopify",
  ],
  openGraph: {
    title: "Stora AI — Créez votre boutique e-commerce avec l’IA",
    description:
      "Décrivez votre projet et obtenez une boutique complète, cohérente et prête à personnaliser en quelques minutes.",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stora AI — Votre boutique e-commerce, générée par l’IA",
    description: "Design, catalogue, visuels et textes réunis dans une seule interface.",
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
