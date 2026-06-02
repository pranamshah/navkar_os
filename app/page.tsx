import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import TrustTicker from "@/components/home/TrustTicker";
import ProblemSection from "@/components/home/ProblemSection";
import WhoItsFor from "@/components/home/WhoItsFor";
import CommandSuite from "@/components/home/CommandSuite";
import WorkflowSection from "@/components/home/WorkflowSection";
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
        <TrustTicker />
        <ProblemSection />
        <WhoItsFor />
        <CommandSuite />
        <WorkflowSection />
        <StatsSection />
        <FAQSection />
        <BeyondBorders />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
