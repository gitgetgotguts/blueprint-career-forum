import { useEffect, useRef } from 'react';

const partners = [
  'Sagemcom',
  'Orange',
  'Sofrecom',
  'Cynapsys',
  'Cloud Temple Tunisia',
  'Telnet',
  'Vermeg',
  'Talan',
];

const PartnersSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.scroll-reveal').forEach((el, i) => {
              setTimeout(() => {
                el.classList.add('visible');
              }, i * 100);
            });
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
    <section id="partners" ref={sectionRef} className="relative py-24">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16 scroll-reveal">
          <span className="font-mono text-xs text-primary/60 tracking-widest block mb-2">
            SECTION 04
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl bracket-title inline-block">
            OUR PARTNERS
          </h2>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {partners.map((partner, index) => (
            <div
              key={partner}
              className="scroll-reveal"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="blueprint-card p-6 h-32 flex items-center justify-center glow-hover group relative">
                {/* Stamp-like border */}
                <div className="absolute inset-2 border border-dashed border-primary/20 group-hover:border-primary/40 transition-colors" />
                
                {/* Partner name */}
                <span className="font-heading text-lg text-muted-foreground group-hover:text-foreground transition-colors text-center">
                  {partner}
                </span>

                {/* Corner marks */}
                <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-primary/30" />
                <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-primary/30" />
                <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-primary/30" />
                <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-primary/30" />
              </div>
            </div>
          ))}
        </div>

        {/* Become a partner CTA */}
        <div className="text-center mt-12 scroll-reveal">
          <p className="font-mono text-sm text-muted-foreground mb-4">
            Interested in partnering with FEEE 11?
          </p>
          <a 
            href="mailto:contact@enetcom.tn"
            className="inline-block font-heading text-sm px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            BECOME A PARTNER
          </a>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
