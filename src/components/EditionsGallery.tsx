import { useEffect, useRef } from 'react';

interface EditionImage {
  image: string;
  edition: number;
  label: string;
}

// 10 editions (2016 excluded due to COVID)
const editions: EditionImage[] = [
  { image: '/2014.png', edition: 1, label: 'The Beginning' },
  { image: '/2015.jpg', edition: 2, label: 'Growing Strong' },
  { image: '/2017.jpg', edition: 3, label: 'New Heights' },
  { image: '/2018.jpg', edition: 4, label: 'Breaking Records' },
  { image: '/2019.jpg', edition: 5, label: 'Innovation Era' },
  { image: '/2020.jpg', edition: 6, label: 'Resilience' },
  { image: '/2021.jpg', edition: 7, label: 'Comeback' },
  { image: '/2022.jpg', edition: 8, label: 'Tech Forward' },
  { image: '/2023.jpg', edition: 9, label: 'Expansion' },
  { image: '/2024.jpg', edition: 10, label: 'A Decade' },
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
              <div className="aspect-video relative overflow-hidden mb-4">
                <img 
                  src="/2014.png" 
                  alt="FEEE Edition 1 - 2014" 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                {/* Corner marks */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary/60" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary/60" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary/60" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary/60" />
              </div>
              <div className="text-center">
                <span className="font-heading text-xl text-accent">How it started</span>
                <p className="font-mono text-xs text-muted-foreground mt-1">
                  EDITION 01 • THE BEGINNING
                </p>
              </div>
            </div>
          </div>

          {/* How it is today */}
          <div className="scroll-reveal">
            <div className="blueprint-card p-4 glow-hover group border-accent/40">
              <div className="aspect-video relative overflow-hidden mb-4">
                <img 
                  src="/2024.jpg" 
                  alt="FEEE Edition 10 - 2024" 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                {/* Corner marks */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-accent/60" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-accent/60" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-accent/60" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-accent/60" />
              </div>
              <div className="text-center">
                <span className="font-heading text-xl text-accent">How it is today</span>
                <p className="font-mono text-xs text-muted-foreground mt-1">
                  EDITION 10 • A DECADE OF EXCELLENCE
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {editions.map((edition) => (
              <div
                key={edition.edition}
                className="blueprint-card p-3 glow-hover group"
              >
                <div className="aspect-square relative overflow-hidden mb-2">
                  <img 
                    src={edition.image} 
                    alt={`FEEE Edition ${edition.edition}`}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                  />
                  {/* Small corner marks */}
                  <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-primary/50" />
                  <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-primary/50" />
                  {/* Edition badge */}
                  <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1">
                    <span className="font-mono text-xs text-primary">ED. {edition.edition.toString().padStart(2, '0')}</span>
                  </div>
                </div>
                <p className="font-mono text-xs text-center text-muted-foreground group-hover:text-foreground transition-colors">
                  {edition.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical annotation */}
        <div className="text-center mt-12 font-mono text-xs text-primary/50 tracking-widest">
          REF: FEEE-ARCHIVE | 10 EDITIONS | 2016 EXCLUDED
        </div>
      </div>
    </section>
  );
};

export default EditionsGallery;
