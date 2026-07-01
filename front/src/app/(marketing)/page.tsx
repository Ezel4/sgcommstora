import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { LogoMarquee } from "@/components/marketing/LogoMarquee";
import { Features } from "@/components/marketing/Features";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Stats } from "@/components/marketing/Stats";
import { Integrations } from "@/components/marketing/Integrations";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Pricing } from "@/components/marketing/Pricing";
import { Faq } from "@/components/marketing/Faq";
import { FinalCta } from "@/components/marketing/FinalCta";
import { Footer } from "@/components/marketing/Footer";
import { GlassFilters } from "@/components/marketing/GlassFilters";
import { SmoothScroll } from "@/components/marketing/SmoothScroll";

export default function HomePage() {
  return (
    <main className="grain relative min-h-screen bg-base">
      <GlassFilters />
      <SmoothScroll />

      <Navbar />
      <Hero />
      <LogoMarquee />
      <Features />
      <HowItWorks />
      <Stats />
      <Integrations />
      <Testimonials />
      <Pricing />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  );
}
