import { useEffect, useRef } from 'react';
import { Mic, Users, Presentation, Briefcase, GraduationCap, Lightbulb } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  annotation: string;
  details: string[];
}

const features: Feature[] = [
  {
    icon: <Presentation className="w-8 h-8" />,
    title: 'WORKSHOPS',
    description: 'Hands-on technical workshops led by industry experts covering the latest technologies and methodologies.',
    annotation: 'WS-01',
    details: ['AI & Machine Learning', 'Cloud Computing', 'Cybersecurity', 'DevOps Practices'],
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'NETWORKING',
    description: 'Connect with recruiters, engineers, and fellow students. Build relationships that launch careers.',
    annotation: 'NT-02',
    details: ['1-on-1 Sessions', 'Speed Networking', 'Alumni Meetups', 'Industry Mixers'],
  },
  {
    icon: <Mic className="w-8 h-8" />,
    title: 'SPEECHES',
    description: 'Inspiring talks from tech leaders sharing insights on innovation, entrepreneurship, and career growth.',
    annotation: 'SP-03',
    details: ['Keynote Speakers', 'Panel Discussions', 'Fireside Chats', 'Q&A Sessions'],
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: 'JOB FAIR',
    description: 'Meet top employers actively hiring. Submit your CV and interview on the spot for internships and jobs.',
    annotation: 'JF-04',
    details: ['50+ Companies', 'On-site Interviews', 'Internship Offers', 'Full-time Positions'],
  },
  {
    icon: <GraduationCap className="w-8 h-8" />,
    title: 'CV CLINIC',
    description: 'Get your resume reviewed by HR professionals. Learn how to stand out and land interviews.',
    annotation: 'CV-05',
    details: ['Expert Reviews', 'Template Guides', 'LinkedIn Tips', 'Personal Branding'],
  },
  {
    icon: <Lightbulb className="w-8 h-8" />,
    title: 'STARTUP ZONE',
    description: 'Discover innovative startups, explore entrepreneurship opportunities, and meet founders.',
    annotation: 'SZ-06',
    details: ['Startup Booths', 'Founder Talks', 'Investment Tips', 'Co-founder Matching'],
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
            SECTION 04
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl bracket-title inline-block">
            WHAT TO EXPECT
          </h2>
          <p className="font-sans text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Two days packed with opportunities to learn, connect, and kickstart your career
          </p>
        </div>

        {/* Features Grid */}
        <div className="relative">
          {/* Connection lines (decorative) */}
          <div className="absolute top-1/4 left-0 right-0 h-px bg-primary/10 hidden lg:block" />
          <div className="absolute top-3/4 left-0 right-0 h-px bg-primary/10 hidden lg:block" />
          <div className="absolute top-0 bottom-0 left-1/4 w-px bg-primary/10 hidden lg:block" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-primary/10 hidden lg:block" />
          <div className="absolute top-0 bottom-0 left-3/4 w-px bg-primary/10 hidden lg:block" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="scroll-reveal"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="blueprint-card p-6 h-full glow-hover group relative min-h-[320px]">
                  {/* Corner annotation */}
                  <div className="absolute top-2 right-2 font-mono text-[10px] text-primary/40 tracking-widest">
                    {feature.annotation}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 border border-primary/40 flex items-center justify-center mb-4 text-primary group-hover:border-accent group-hover:text-accent transition-colors">
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-lg text-foreground mb-2">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Details list */}
                  <ul className="space-y-1 mb-8">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs">
                        <span className="w-1 h-1 bg-accent rounded-full" />
                        <span className="font-mono text-primary/70">{detail}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Bottom dimension line */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                    <span className="flex-1 h-px bg-primary/20" />
                    <span className="font-mono text-[8px] text-primary/30">MODULE {index + 1}</span>
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
            — 6 MODULES • 1 DAY • UNLIMITED OPPORTUNITIES —
          </span>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
