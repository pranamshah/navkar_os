import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import ServicePreview from "@/components/home/ServicePreview";
import TrustTicker from "@/components/home/TrustTicker";
import ProblemSection from "@/components/home/ProblemSection";
import WhoItsFor from "@/components/home/WhoItsFor";
import SuiteScroll from "@/components/home/SuiteScroll";
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
        <ServicePreview />
        <TrustTicker />
        <ProblemSection />
        <WhoItsFor />
        <SuiteScroll />
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
