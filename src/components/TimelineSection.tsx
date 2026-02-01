import { useEffect, useRef } from 'react';

interface Edition {
  year: string;
  edition: number;
  theme: string;
  highlight?: string;
}

const editions: Edition[] = [
  { year: '2014', edition: 1, theme: 'Engineers in Challenge', highlight: 'Inaugural Edition' },
  { year: '2015', edition: 2, theme: 'Bridge to ICT Startup' },
  { year: '2017', edition: 3, theme: 'Restart with Smart' },
  { year: '2018', edition: 4, theme: 'Global Digital Transformation & Innovation' },
  { year: '2019', edition: 5, theme: 'AI Revolution' },
  { year: '2020', edition: 6, theme: 'ENET\'COM Speaks Innovation' },
  { year: '2022', edition: 7, theme: 'Excellence Our Vision' },
  { year: '2023', edition: 8, theme: 'ENET\'COM Still Innovates' },
  { year: '2024', edition: 9, theme: 'ENET\'COM Shaping Future Technologies' },
  { year: '2025', edition: 10, theme: 'AI and Quality Shaping the Future' },
  { year: '2026', edition: 11, theme: 'Coming Soon...', highlight: 'Upcoming Edition' },
];

const TimelineSection = () => {
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="timeline" ref={sectionRef} className="relative py-24">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16 scroll-reveal">
          <span className="font-mono text-xs text-primary/60 tracking-widest block mb-2">
            SECTION 02
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl bracket-title inline-block">
            PAST EDITIONS
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Central line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-primary/30 transform md:-translate-x-1/2" />

          {editions.map((edition, index) => (
            <div
              key={edition.year}
              className={`relative flex items-center gap-8 mb-8 scroll-reveal ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-background border-2 border-primary transform -translate-x-1/2 z-10">
                {edition.highlight && (
                  <div className="absolute inset-0 border-2 border-accent animate-ping" />
                )}
              </div>

              {/* Content */}
              <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                <div className={`blueprint-card p-6 glow-hover ${edition.edition === 10 ? 'border-accent/60' : ''}`}>
                  {/* Edition badge */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-xs text-primary/60 tracking-widest">
                      ED. {edition.edition.toString().padStart(2, '0')}
                    </span>
                    {edition.highlight && (
                      <span className="font-mono text-xs text-accent px-2 py-0.5 border border-accent/40">
                        {edition.highlight}
                      </span>
                    )}
                  </div>

                  {/* Year */}
                  <div className="font-heading text-4xl text-foreground mb-3">
                    {edition.year}
                  </div>

                  {/* Theme - Made bigger */}
                  <p className="font-heading text-xl text-accent leading-tight">
                    "{edition.theme}"
                  </p>

                  {/* Technical annotation */}
                  <div className="mt-3 pt-3 border-t border-primary/20">
                    <span className="font-mono text-[10px] text-primary/40 tracking-widest">
                      REF: FEEE-{edition.edition.toString().padStart(2, '0')} | SFAX
                    </span>
                  </div>
                </div>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block md:w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
