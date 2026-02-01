import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface EditionImage {
  image: string;
  edition: number;
  label: string;
}

// 10 past editions (2016 and 2021 excluded) - Edition 11 is upcoming in December 2026
const editions: EditionImage[] = [
  { image: '/2014.png', edition: 1, label: 'Engineers in Challenge' },
  { image: '/2015.jpg', edition: 2, label: 'Bridge to ICT Startup' },
  { image: '/2017.jpg', edition: 3, label: 'Restart with Smart' },
  { image: '/2018.jpg', edition: 4, label: 'Global Digital Transformation & Innovation' },
  { image: '/2019.jpg', edition: 5, label: 'AI Revolution' },
  { image: '/2020.jpg', edition: 6, label: 'ENET\'COM Speaks Innovation' },
  { image: '/2022.jpg', edition: 7, label: 'Excellence Our Vision' },
  { image: '/2023.jpg', edition: 8, label: 'ENET\'COM Still Innovates' },
  { image: '/2024.jpg', edition: 9, label: 'ENET\'COM Shaping Future Technologies' },
  { image: '/20255.jpg', edition: 10, label: 'AI and Quality Shaping the Future' },
];

const EditionsGallery = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<EditionImage | null>(null);

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

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close button */}
          <button 
            className="absolute top-6 right-6 w-12 h-12 border-2 border-primary/50 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image container */}
          <div 
            className="relative max-w-5xl max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={selectedImage.image} 
              alt={`FEEE Edition ${selectedImage.edition}`}
              className="max-w-full max-h-[85vh] object-contain border-2 border-primary/40"
            />
            {/* Blue tint overlay */}
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay pointer-events-none" />
            
            {/* Corner marks */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-primary" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-primary" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-primary" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-primary" />

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm p-4 text-center border-t border-primary/30">
              <span className="font-heading text-2xl text-accent">Edition {selectedImage.edition.toString().padStart(2, '0')}</span>
              <p className="font-mono text-sm text-primary mt-1">{selectedImage.label}</p>
            </div>
          </div>

          {/* Navigation hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs text-primary/50">
            CLICK ANYWHERE OR PRESS ESC TO CLOSE
          </div>
        </div>
      )}

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
            <div 
              className="blueprint-card p-4 glow-hover group cursor-pointer"
              onClick={() => setSelectedImage(editions[0])}
            >
              <div className="aspect-video relative overflow-hidden mb-4">
                <img 
                  src="/2014.png" 
                  alt="FEEE Edition 1 - 2014" 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                {/* Blue tint overlay */}
                <div className="absolute inset-0 bg-primary/30 mix-blend-overlay group-hover:bg-primary/20 transition-all duration-500" />
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
            <div 
              className="blueprint-card p-4 glow-hover group border-accent/40 cursor-pointer"
              onClick={() => setSelectedImage(editions[9])}
            >
              <div className="aspect-video relative overflow-hidden mb-4">
                <img 
                  src="/2024.jpg" 
                  alt="FEEE Edition 10 - 2024" 
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                {/* Blue tint overlay */}
                <div className="absolute inset-0 bg-primary/30 mix-blend-overlay group-hover:bg-primary/20 transition-all duration-500" />
                {/* Corner marks */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-accent/60" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-accent/60" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-accent/60" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-accent/60" />
              </div>
              <div className="text-center">
                <span className="font-heading text-xl text-accent">How it is today</span>
                <p className="font-mono text-xs text-muted-foreground mt-1">
                  EDITION 10 • A NEW ERA
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
                className="blueprint-card p-3 glow-hover group cursor-pointer"
                onClick={() => setSelectedImage(edition)}
              >
                <div className="aspect-square relative overflow-hidden mb-2">
                  <img 
                    src={edition.image} 
                    alt={`FEEE Edition ${edition.edition}`}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                  />
                  {/* Blue tint overlay */}
                  <div className="absolute inset-0 bg-primary/30 mix-blend-overlay group-hover:bg-primary/10 transition-all duration-500" />
                  {/* Small corner marks */}
                  <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-primary/50" />
                  <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-primary/50" />
                  {/* Edition badge */}
                  <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1">
                    <span className="font-mono text-xs text-primary">ED. {edition.edition.toString().padStart(2, '0')}</span>
                  </div>
                  {/* Zoom indicator */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 border-2 border-white/80 rounded-full flex items-center justify-center bg-background/50 backdrop-blur-sm">
                      <span className="text-white text-lg">+</span>
                    </div>
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
          REF: FEEE-ARCHIVE | 10 EDITIONS
        </div>
      </div>
    </section>
    </>
  );
};

export default EditionsGallery;
