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
          <div className="flex items-center">
            <img 
              src="/logo-free.png" 
              alt="FEEE Logo" 
              className="h-56 w-auto"
            />
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

          {/* Login Button */}
          <a
            href="#"
            className="font-heading text-sm px-6 py-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300"
          >
            LOGIN
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
