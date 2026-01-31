import { useEffect, useState } from 'react';
import BuildingIllustration from './illustrations/BuildingIllustration';

const HeroSection = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Set target date to March 15, 2025
    const targetDate = new Date('2025-03-15T09:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setDays(Math.floor(difference / (1000 * 60 * 60 * 24)));
        setHours(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        setMinutes(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)));
        setSeconds(Math.floor((difference % (1000 * 60)) / 1000));
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToRegister = () => {
    const element = document.getElementById('register');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Building Illustration */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <BuildingIllustration className="w-full max-w-4xl h-auto" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Date Badge */}
        <div className="inline-block mb-8 animate-fade-in-up">
          <div className="border border-primary/40 px-6 py-2 font-mono text-sm text-primary tracking-widest">
            <span className="text-accent">★</span> MARCH 2025 <span className="text-accent">★</span>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-wider animate-fade-in-up delay-100">
          <span className="text-primary">FORUM</span>{' '}
          <span className="text-foreground">ENET'COM</span>
        </h1>

        {/* Edition */}
        <div className="flex items-center justify-center gap-4 mb-6 animate-fade-in-up delay-200">
          <span className="w-12 h-px bg-primary/60" />
          <span className="font-heading text-2xl sm:text-3xl tracking-[0.3em] text-primary/80">
            FEEE — 11TH EDITION
          </span>
          <span className="w-12 h-px bg-primary/60" />
        </div>

        {/* Slogan */}
        <p className="font-sans text-xl sm:text-2xl text-muted-foreground mb-12 animate-fade-in-up delay-300">
          One room. <span className="text-accent">Infinite possibilities.</span>
        </p>

        {/* Countdown */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 mb-12 animate-fade-in-up delay-400">
          {[
            { value: days, label: 'DAYS' },
            { value: hours, label: 'HRS' },
            { value: minutes, label: 'MIN' },
            { value: seconds, label: 'SEC' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="w-16 sm:w-20 h-16 sm:h-20 border border-primary/40 flex items-center justify-center mb-2 blueprint-card">
                <span className="font-heading text-2xl sm:text-3xl text-foreground">
                  {item.value.toString().padStart(2, '0')}
                </span>
              </div>
              <span className="font-mono text-xs text-muted-foreground tracking-widest">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={scrollToRegister}
          className="font-heading text-lg px-8 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 cta-pulse animate-fade-in-up delay-500"
        >
          JOIN FEEE 11
        </button>

        {/* Technical annotation */}
        <div className="mt-16 font-mono text-xs text-muted-foreground/40 tracking-widest animate-fade-in-up delay-500">
          ENET'COM SFAX • TUNISIA
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border border-primary/40 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-primary/60 rounded-full animate-pulse-glow" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
