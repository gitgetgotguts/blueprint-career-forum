import { useEffect, useRef } from 'react';

interface EditionImage {
  year: string;
  edition: number;
  label: string;
}

const editions: EditionImage[] = [
  { year: '2014', edition: 1, label: 'How it started' },
  { year: '2015', edition: 2, label: 'Edition 2' },
  { year: '2016', edition: 3, label: 'Edition 3' },
  { year: '2018', edition: 4, label: 'Edition 4' },
  { year: '2019', edition: 5, label: 'Edition 5' },
  { year: '2020', edition: 6, label: 'Edition 6' },
  { year: '2021', edition: 7, label: 'Edition 7' },
  { year: '2022', edition: 8, label: 'Edition 8' },
  { year: '2023', edition: 9, label: 'Edition 9' },
  { year: '2024', edition: 10, label: 'Edition 10' },
  { year: '2025', edition: 11, label: 'How it is today' },
];

const EditionsGallery = () => {
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
    <section id="gallery" ref={sectionRef} className="relative py-24">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16 scroll-reveal">
          <span className="font-mono text-xs text-primary/60 tracking-widest block mb-2">
            SECTION 05
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl bracket-title inline-block">
            OUR JOURNEY
          </h2>
          <p className="font-mono text-sm text-muted-foreground mt-4">
            From humble beginnings to a flagship event
          </p>
        </div>

        {/* How it started vs How it is today - Featured comparison */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* How it started */}
          <div className="scroll-reveal">
            <div className="blueprint-card p-4 glow-hover group">
              <div className="aspect-video bg-primary/5 border border-dashed border-primary/30 flex items-center justify-center mb-4 relative overflow-hidden">
                {/* Placeholder for 2014 image */}
                <div className="text-center">
                  <span className="font-mono text-xs text-primary/40 block mb-2">
                    IMG PLACEHOLDER
                  </span>
                  <span className="font-heading text-2xl text-muted-foreground">2014</span>
                </div>
                {/* Corner marks */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary/40" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary/40" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary/40" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary/40" />
              </div>
              <div className="text-center">
                <span className="font-heading text-xl text-accent">How it started</span>
                <p className="font-mono text-xs text-muted-foreground mt-1">
                  EDITION 01 • FEEE INAUGURAL
                </p>
              </div>
            </div>
          </div>

          {/* How it is today */}
          <div className="scroll-reveal">
            <div className="blueprint-card p-4 glow-hover group border-accent/40">
              <div className="aspect-video bg-accent/5 border border-dashed border-accent/30 flex items-center justify-center mb-4 relative overflow-hidden">
                {/* Placeholder for 2025 image */}
                <div className="text-center">
                  <span className="font-mono text-xs text-accent/40 block mb-2">
                    IMG PLACEHOLDER
                  </span>
                  <span className="font-heading text-2xl text-foreground">2025</span>
                </div>
                {/* Corner marks */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-accent/40" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-accent/40" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-accent/40" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-accent/40" />
              </div>
              <div className="text-center">
                <span className="font-heading text-xl text-accent">How it is today</span>
                <p className="font-mono text-xs text-muted-foreground mt-1">
                  EDITION 11 • ONE ROOM. INFINITE POSSIBILITIES.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* All editions grid */}
        <div className="scroll-reveal">
          <h3 className="font-mono text-xs text-primary/60 tracking-widest text-center mb-8">
            ALL EDITIONS ARCHIVE
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {editions.slice(0, -1).map((edition) => (
              <div
                key={edition.year}
                className="blueprint-card p-3 glow-hover group"
              >
                <div className="aspect-square bg-primary/5 border border-dashed border-primary/20 flex items-center justify-center mb-2 relative">
                  <span className="font-heading text-lg text-muted-foreground group-hover:text-foreground transition-colors">
                    {edition.year}
                  </span>
                  {/* Small corner marks */}
                  <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-primary/30" />
                  <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-primary/30" />
                </div>
                <p className="font-mono text-[10px] text-center text-muted-foreground">
                  ED. {edition.edition.toString().padStart(2, '0')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical annotation */}
        <div className="text-center mt-12 font-mono text-[10px] text-primary/40 tracking-widest">
          REF: FEEE-ARCHIVE | FRAMES: {editions.length}
        </div>
      </div>
    </section>
  );
};

export default EditionsGallery;
