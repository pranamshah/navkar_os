import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import ModuleShowcaseSection from "@/components/home/ModuleShowcaseSection";
import TrustTicker from "@/components/home/TrustTicker";
import ProblemSection from "@/components/home/ProblemSection";
import CommandSuite from "@/components/home/CommandSuite";
import WorkflowSection from "@/components/home/WorkflowSection";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import PricingSection from "@/components/home/PricingSection";
import StatsSection from "@/components/home/StatsSection";
import FAQSection from "@/components/home/FAQSection";
import BeyondBorders from "@/components/home/BeyondBorders";
import ContactSection from "@/components/home/ContactSection";
import Footer from "@/components/home/Footer";
import CustomCursor from "@/components/home/CustomCursor";
import ScrollReveal from "@/components/home/ScrollReveal";

export default function Home() {
  return (
    <>
      <CustomCursor />
      <ScrollReveal />
      <main className="flex flex-col min-h-screen">
        <Navbar />
        <HeroSection />
        <ModuleShowcaseSection />
        <TrustTicker />
        <ProblemSection />
        <CommandSuite />
        <WorkflowSection />
        <TestimonialsCarousel />
        <PricingSection />
        <StatsSection />
        <FAQSection />
        <BeyondBorders />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
