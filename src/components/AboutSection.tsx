import { useEffect, useRef } from 'react';

const AboutSection = () => {
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
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16 scroll-reveal">
          <span className="font-mono text-xs text-primary/60 tracking-widest block mb-2">
            SECTION 01
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl bracket-title inline-block">
            ABOUT THE FORUM
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="scroll-reveal">
              <p className="text-xl text-accent font-heading leading-relaxed mb-2">
                Like any great engineering project, your career deserves a solid blueprint.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                <span className="text-primary font-semibold">FEEE</span> — Tunisia's largest student-run career forum. 1 day. 50+ companies. 1000+ engineering students. Direct access to internships and jobs.
              </p>
            </div>

            <div className="scroll-reveal">
              <p className="text-muted-foreground leading-relaxed">
                Organized by <span className="text-primary">ENET'COM</span> students since <span className="text-accent font-mono">2014</span>. Real connections. Real opportunities.
              </p>
            </div>

            <div className="blueprint-card p-6 scroll-reveal">
              <h3 className="font-heading text-2xl text-primary font-bold mb-4">WHAT YOU GET</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold text-lg">▸</span>
                  <span className="text-white font-semibold text-base">Meet recruiters from top tech companies face-to-face</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold text-lg">▸</span>
                  <span className="text-white font-semibold text-base">Land internships and job offers on the spot</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold text-lg">▸</span>
                  <span className="text-white font-semibold text-base">Learn from industry experts in hands-on workshops</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-4 scroll-reveal">
              <div className="border border-primary/30 px-4 py-2">
                <span className="font-heading text-2xl text-accent">11</span>
                <span className="font-mono text-xs text-muted-foreground block">EDITIONS</span>
              </div>
              <div className="border border-primary/30 px-4 py-2">
                <span className="font-heading text-2xl text-accent">50+</span>
                <span className="font-mono text-xs text-muted-foreground block">PARTNERS</span>
              </div>
              <div className="border border-primary/30 px-4 py-2">
                <span className="font-heading text-2xl text-accent">1000+</span>
                <span className="font-mono text-xs text-muted-foreground block">STUDENTS</span>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative scroll-reveal">
            <div className="relative rounded-lg overflow-hidden border border-primary/30">
              <img 
                src="/stand.png" 
                alt="Student pitching to company ambassador at career fair" 
                className="w-full h-auto max-w-lg mx-auto"
              />
              {/* Blueprint corner marks */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-primary/60" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-primary/60" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-primary/60" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-primary/60" />
            </div>
            
            {/* Dimension annotations */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs text-primary/40 tracking-widest">
              DWG: PITCH-01 | NETWORKING ZONE
            </div>
          </div>
        </div>

        {/* Companies mention */}
        <div className="mt-16 text-center scroll-reveal">
          <p className="font-mono text-sm text-muted-foreground">
            Partnered with industry leaders including{' '}
            <span className="text-primary">Sagemcom</span>,{' '}
            <span className="text-primary">Orange</span>,{' '}
            <span className="text-primary">Sofrecom</span>,{' '}
            <span className="text-primary">Cynapsys</span>, and more.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
