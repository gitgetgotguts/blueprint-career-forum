import { useEffect, useState, useRef } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface Company {
  name: string;
  // When you have logos, add: logoUrl: string;
}

const companies: Company[] = [
  { name: 'Sagemcom' },
  { name: 'Orange' },
  { name: 'Sofrecom' },
  { name: 'Cynapsys' },
  { name: 'Cloud Temple Tunisia' },
  { name: 'Telnet' },
  { name: 'Vermeg' },
  { name: 'Talan' },
  { name: 'Actia' },
  { name: 'Ericsson' },
  { name: 'Huawei' },
  { name: 'Ooredoo' },
];

const CompaniesCarousel = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section ref={sectionRef} className="relative py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="font-mono text-xs text-primary/60 tracking-widest block mb-2">
            TRUSTED BY
          </span>
          <h3 className="font-heading text-2xl sm:text-3xl text-foreground">
            Companies That <span className="text-accent">Shaped Our Forum</span>
          </h3>
        </div>

        {/* Carousel */}
        <div className={`max-w-5xl mx-auto px-12 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {companies.map((company, index) => (
                <CarouselItem
                  key={company.name}
                  className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                >
                  <div className="blueprint-card p-4 h-28 flex flex-col items-center justify-center glow-hover group relative">
                    {/* Blueprint stamp border */}
                    <div className="absolute inset-2 border border-dashed border-primary/20 group-hover:border-primary/40 transition-colors" />
                    
                    {/* Logo placeholder - replace with actual logos */}
                    <div className="w-16 h-16 border border-primary/30 flex items-center justify-center mb-2 relative">
                      <span className="font-mono text-[8px] text-primary/40">LOGO</span>
                      {/* Corner dots */}
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary/30 rounded-full" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary/30 rounded-full" />
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary/30 rounded-full" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary/30 rounded-full" />
                    </div>
                    
                    {/* Company name */}
                    <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors text-center leading-tight">
                      {company.name}
                    </span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="border-primary/40 text-primary hover:bg-primary/10 hover:text-foreground -left-4" />
            <CarouselNext className="border-primary/40 text-primary hover:bg-primary/10 hover:text-foreground -right-4" />
          </Carousel>
        </div>

        {/* Technical annotation */}
        <div className="text-center mt-8 font-mono text-[10px] text-primary/40 tracking-widest">
          PARTNERS COUNT: {companies.length} | CAROUSEL-01
        </div>
      </div>
    </section>
  );
};

export default CompaniesCarousel;
