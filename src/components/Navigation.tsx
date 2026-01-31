import { useState, useEffect } from 'react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/90 backdrop-blur-md border-b border-primary/20' : ''
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 border border-primary/60 flex items-center justify-center">
              <span className="font-heading text-lg text-primary">FE</span>
            </div>
            <span className="font-mono text-xs text-muted-foreground hidden sm:block">FEEE-11</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {['About', 'Timeline', 'Features', 'Partners'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors tracking-wider uppercase"
              >
                {item}
              </button>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => scrollToSection('register')}
            className="font-heading text-sm px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300"
          >
            REGISTER
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
