import BlueprintBackground from '@/components/BlueprintBackground';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import TimelineSection from '@/components/TimelineSection';
import FeaturesSection from '@/components/FeaturesSection';
import EditionsGallery from '@/components/EditionsGallery';
import CompaniesCarousel from '@/components/CompaniesCarousel';
import PartnersSection from '@/components/PartnersSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Blueprint grid background */}
      <BlueprintBackground />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main content */}
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <TimelineSection />
        <FeaturesSection />
        <EditionsGallery />
        <CompaniesCarousel />
        <PartnersSection />
        <CTASection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
