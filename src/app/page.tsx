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
import { fetchListingsByCategory } from "@/lib/listings";

export const revalidate = 60

export default async function HomePage() {
  const [villas, yachts, experiences, services] = await Promise.all([
    fetchListingsByCategory('villa'),
    fetchListingsByCategory('yacht'),
    fetchListingsByCategory('experience'),
    fetchListingsByCategory('service'),
  ])

  return (
    <main className="bg-[#060606]">
      <Navbar />
      <HeroSection />
      <CategoryBar />
      <VillasSection listings={villas} />
      <YachtsSection listings={yachts} />
      <ExperiencesSection listings={experiences} />
      <ServicesSection listings={services} />
      <StatsSection />
      <CTASection />
      <Footer />
      <MobileBar />
    </main>
  );
}
