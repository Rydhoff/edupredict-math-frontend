import Logo from "../components/ui/Logo";
import HeroSection from "../components/landing/HeroSection";
import StatsSection from "../components/landing/StatsSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F8F2FF] via-white to-white">
      <div className="mx-auto min-h-screen w-full max-w-[460px] overflow-hidden">
        <header className="px-[18px] pt-[49px]">
          <Logo />
        </header>

        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <CTASection />
        <Footer />
      </div>
    </main>
  );
};

export default LandingPage;