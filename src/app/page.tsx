import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ExperiencesSection from "@/components/ExperiencesSection";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="bg-[#080808]">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <ExperiencesSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
