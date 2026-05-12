import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryBar from "@/components/CategoryBar";
import VillasSection from "@/components/VillasSection";
import YachtsSection from "@/components/YachtsSection";
import ExperiencesSection from "@/components/ExperiencesSection";
import ServicesSection from "@/components/ServicesSection";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";

export default function HomePage() {
  return (
    <main className="bg-[#060606]">
      <Navbar />
      <HeroSection />
      <CategoryBar />
      <VillasSection />
      <YachtsSection />
      <ExperiencesSection />
      <ServicesSection />
      <StatsSection />
      <CTASection />
      <Footer />
      {/* MobileBar: full-width bottom strip on mobile, floating pill on desktop */}
      <MobileBar />
    </main>
  );
}
