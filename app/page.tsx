import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import ProblemBanner from "@/components/home/ProblemBanner";
import ModulesGrid from "@/components/home/ModulesGrid";
import DocAISpotlight from "@/components/home/DocAISpotlight";
import BillGenSpotlight from "@/components/home/BillGenSpotlight";
import StatsSection from "@/components/home/StatsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PricingPreview from "@/components/home/PricingPreview";
import IntegrationsSection from "@/components/home/IntegrationsSection";
import FinalCTA from "@/components/home/FinalCTA";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <HeroSection />
      <ProblemBanner />
      <ModulesGrid />
      <DocAISpotlight />
      <BillGenSpotlight />
      <StatsSection />
      <TestimonialsSection />
      <PricingPreview />
      <IntegrationsSection />
      <FinalCTA />
      <Footer />
    </main>
  );
}
