import { useEffect, useRef } from 'react';

const CTASection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.scroll-reveal').forEach((el, i) => {
              setTimeout(() => {
                el.classList.add('visible');
              }, i * 150);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="register" ref={sectionRef} className="relative py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Stamp-like container */}
          <div className="relative blueprint-card p-12 scroll-reveal">
            {/* Corner decorations */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-accent/60" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-accent/60" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-accent/60" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-accent/60" />

            {/* Section label */}
            <span className="font-mono text-xs text-primary/60 tracking-widest block mb-4 scroll-reveal">
              REGISTRATION OPEN
            </span>

            {/* Main heading */}
            <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6 scroll-reveal">
              BE PART OF{' '}
              <span className="text-accent">FEEE 11</span>
            </h2>

            {/* Slogan */}
            <p className="text-xl text-muted-foreground mb-8 scroll-reveal">
              Don't wait for opportunities.{' '}
              <span className="text-primary">Walk into them.</span>
            </p>

            {/* CTA Button */}
            <div className="scroll-reveal">
              <a
                href="#"
                className="inline-block font-heading text-xl px-10 py-5 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 cta-pulse"
              >
                REGISTER NOW
              </a>
            </div>

            {/* Technical annotation */}
            <div className="mt-8 scroll-reveal">
              <span className="font-mono text-xs text-muted-foreground/40 tracking-widest">
                LIMITED SPOTS AVAILABLE • FREE ENTRY FOR STUDENTS
              </span>
            </div>

            {/* Stamp watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-4 border-accent/10 rounded-full flex items-center justify-center -rotate-12 pointer-events-none">
              <span className="font-heading text-2xl text-accent/10 tracking-widest">
                APPROVED
              </span>
            </div>
          </div>

          {/* Additional info */}
          <div className="mt-8 flex flex-wrap justify-center gap-8 scroll-reveal">
            <div className="text-center">
              <span className="font-heading text-2xl text-primary block">MARCH</span>
              <span className="font-mono text-xs text-muted-foreground">2025</span>
            </div>
            <div className="text-center">
              <span className="font-heading text-2xl text-primary block">ENET'COM</span>
              <span className="font-mono text-xs text-muted-foreground">SFAX, TUNISIA</span>
            </div>
            <div className="text-center">
              <span className="font-heading text-2xl text-primary block">FREE</span>
              <span className="font-mono text-xs text-muted-foreground">FOR STUDENTS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
