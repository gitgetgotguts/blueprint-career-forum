import { useEffect, useState, useRef, useCallback } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

interface Partner {
  name: string;
  logo: string;
}

const partners: Partner[] = [
  { name: 'ACTIA', logo: '/logo/ACTIA.png' },
  { name: 'COGNIRA', logo: '/logo/COGNIRA.png' },
  { name: 'CRNS', logo: '/logo/CRNS.png' },
  { name: 'DRAXLMAIER', logo: '/logo/DRAXLMAIER.png' },
  { name: 'Infosquare', logo: '/logo/infosquare.png' },
  { name: 'KPIT', logo: '/logo/KPIT.png' },
  { name: 'Sancella', logo: '/logo/Sancella.png' },
  { name: 'Sofrecom', logo: '/logo/sofrecom.png' },
  { name: 'TDS', logo: '/logo/TDS.png' },
  { name: 'Telnet', logo: '/logo/telnet.png' },
  { name: 'Tunisie Telecom', logo: '/logo/Tunisie Telecom.png' },
  { name: 'University of Sfax', logo: '/logo/University of Sfax.png' },
  { name: 'Yuma', logo: '/logo/yuma.png' },
];

const CompaniesCarousel = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    if (!api) return;

    const autoScroll = setInterval(() => {
      api.scrollNext();
    }, 2000);

    return () => clearInterval(autoScroll);
  }, [api]);

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden w-full">
      <div className="w-full px-0">
        {/* Section Title */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="font-mono text-xs text-primary/60 tracking-widest block mb-2">
            SECTION 03
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl bracket-title inline-block">
            OUR PARTNERS
          </h2>
        </div>

        {/* Carousel */}
        <div className={`w-full px-8 md:px-16 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Carousel
            setApi={setApi}
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-6 md:-ml-10">
              {partners.map((partner, index) => (
                <CarouselItem
                  key={partner.name}
                  className="pl-6 md:pl-10 basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <div className="blueprint-card p-10 h-72 flex flex-col items-center justify-center glow-hover group relative">
                    {/* Blueprint stamp border */}
                    <div className="absolute inset-5 border-2 border-dashed border-primary/30 group-hover:border-primary/50 transition-colors" />
                    
                    {/* Partner Logo */}
                    <div className="w-44 h-36 flex items-center justify-center mb-6 relative">
                      <img 
                        src={partner.logo} 
                        alt={partner.name} 
                        className="max-w-full max-h-full object-contain opacity-95 group-hover:opacity-100 transition-all group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Partner name */}
                    <span className="font-heading text-lg text-foreground group-hover:text-accent transition-colors text-center leading-tight tracking-wide">
                      {partner.name}
                    </span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="border-2 border-primary/50 text-primary hover:bg-primary/20 hover:text-foreground -left-6 w-14 h-14" />
            <CarouselNext className="border-2 border-primary/50 text-primary hover:bg-primary/20 hover:text-foreground -right-6 w-14 h-14" />
          </Carousel>
        </div>

        {/* CTA for companies */}
        <div className="text-center mt-20">
          <div className="inline-block blueprint-card p-12 relative">
            {/* Corner decorations */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-accent" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-accent" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-accent" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-accent" />
            
            <p className="font-heading text-2xl text-foreground mb-4">
              Want to showcase your company at <span className="text-accent font-bold">FEEE 11</span>?
            </p>
            <p className="font-mono text-lg text-primary mb-8">
              Connect with 1000+ engineering students and future tech leaders
            </p>
            <a 
              href="mailto:contact@enetcom.tn?subject=Partnership Inquiry - FEEE 11"
              className="inline-block font-heading text-xl px-10 py-5 bg-accent text-accent-foreground hover:bg-accent/80 transition-all duration-300 shadow-lg shadow-accent/30"
            >
              BECOME A PARTNER
            </a>
          </div>
        </div>

        {/* Technical annotation */}
        <div className="text-center mt-14 font-mono text-sm text-primary/50 tracking-widest">
          PARTNERS: {partners.length} | SECTION-03
        </div>
      </div>
    </section>
  );
};

export default CompaniesCarousel;
