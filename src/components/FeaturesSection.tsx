import { useEffect, useRef } from 'react';
import { Mic, Users, Presentation, Trophy } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  annotation: string;
}

const features: Feature[] = [
  {
    icon: <Presentation className="w-8 h-8" />,
    title: 'WORKSHOPS',
    description: 'Hands-on technical workshops led by industry experts covering the latest technologies and methodologies.',
    annotation: 'WS-01',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'NETWORKING',
    description: 'Connect with recruiters, engineers, and fellow students. Build relationships that launch careers.',
    annotation: 'NT-02',
  },
  {
    icon: <Mic className="w-8 h-8" />,
    title: 'SPEECHES',
    description: 'Inspiring talks from tech leaders sharing insights on innovation, entrepreneurship, and career growth.',
    annotation: 'SP-03',
  },
  {
    icon: <Trophy className="w-8 h-8" />,
    title: 'COMPETITIONS',
    description: 'Showcase your skills in hackathons and coding challenges. Win prizes and recognition.',
    annotation: 'CP-04',
  },
];

const FeaturesSection = () => {
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
    <section id="features" ref={sectionRef} className="relative py-24">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16 scroll-reveal">
          <span className="font-mono text-xs text-primary/60 tracking-widest block mb-2">
            SECTION 03
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl bracket-title inline-block">
            WHAT TO EXPECT
          </h2>
        </div>

        {/* Features Grid */}
        <div className="relative">
          {/* Connection lines (decorative) */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/10 hidden lg:block" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-primary/10 hidden lg:block" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="scroll-reveal"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="blueprint-card p-6 h-full glow-hover group relative">
                  {/* Corner annotation */}
                  <div className="absolute top-2 right-2 font-mono text-[10px] text-primary/40 tracking-widest">
                    {feature.annotation}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 border border-primary/40 flex items-center justify-center mb-4 text-primary group-hover:border-primary group-hover:text-accent transition-colors">
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-xl text-foreground mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Bottom dimension line */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                    <span className="flex-1 h-px bg-primary/20" />
                    <span className="font-mono text-[8px] text-primary/30">SCALE 1:1</span>
                    <span className="flex-1 h-px bg-primary/20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom annotation */}
        <div className="text-center mt-12 scroll-reveal">
          <span className="font-mono text-xs text-muted-foreground/40 tracking-widest">
            — ALL ACTIVITIES INCLUDED IN REGISTRATION —
          </span>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
