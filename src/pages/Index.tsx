import BlueprintBackground from '@/components/BlueprintBackground';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import TimelineSection from '@/components/TimelineSection';
import FeaturesSection from '@/components/FeaturesSection';
import EditionsGallery from '@/components/EditionsGallery';
import CompaniesCarousel from '@/components/CompaniesCarousel';
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
        <CompaniesCarousel />
        <FeaturesSection />
        <CTASection />
        <EditionsGallery />
        <TimelineSection />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
