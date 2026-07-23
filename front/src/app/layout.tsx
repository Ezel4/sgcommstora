import type { Metadata } from "next";
import { Urbanist, Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

// Polices auto-hébergées et préchargées par Next (next/font) : aucune requête
// externe bloquante vers Google Fonts, pas de décalage de mise en page.
const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--ff-urbanist",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--ff-manrope",
  display: "swap",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--ff-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sigmood IA — Créez votre boutique e-commerce avec l’IA",
  description:
    "Décrivez votre projet : Sigmood IA génère le design, le catalogue, les visuels et les textes de votre boutique e-commerce, puis vous aide à la piloter.",
  keywords: [
    "e-commerce",
    "IA",
    "boutique en ligne",
    "Sigmood IA",
    "générateur de boutique IA",
    "alternative Shopify",
  ],
  openGraph: {
    title: "Sigmood IA — Créez votre boutique e-commerce avec l’IA",
    description:
      "Décrivez votre projet et obtenez une boutique complète, cohérente et prête à personnaliser en quelques minutes.",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sigmood IA — Votre boutique e-commerce, générée par l’IA",
    description: "Design, catalogue, visuels et textes réunis dans une seule interface.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${urbanist.variable} ${manrope.variable} ${jakarta.variable}`}
    >
      <body className="bg-base text-ink antialiased">{children}</body>
    </html>
  );
}
