import { Linkedin, Globe, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative py-12 border-t border-primary/20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo & Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 border border-primary/60 flex items-center justify-center">
                <span className="font-heading text-xl text-primary">FE</span>
              </div>
              <div>
                <span className="font-heading text-lg block">FORUM ENET'COM</span>
                <span className="font-mono text-xs text-muted-foreground">11TH EDITION</span>
              </div>
            </div>
            <p className="font-mono text-sm text-muted-foreground leading-relaxed">
              Connecting students with industry since 2014.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-lg mb-4 text-primary">LOCATION</h3>
            <address className="not-italic font-mono text-sm text-muted-foreground leading-relaxed">
              Technopôle de Sfax<br />
              Route de Tunis Km 10, B.P. 242<br />
              Sakiet Ezzit, SFAX 3021<br />
              TUNISIA
            </address>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-heading text-lg mb-4 text-primary">CONNECT</h3>
            <div className="flex flex-col gap-3">
              <a
                href="https://www.enetcom.tn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Globe className="w-4 h-4" />
                enetcom.tn
              </a>
              <a
                href="https://linkedin.com/company/enetcom"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
              <a
                href="mailto:contact@enetcom.tn"
                className="flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                contact@enetcom.tn
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-primary/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-mono text-xs text-muted-foreground/40 tracking-widest">
            DWG: FEEE-11 | REV: 01 | APPROVED: ENET'COM
          </span>
          <span className="font-mono text-xs text-muted-foreground/40">
            © {new Date().getFullYear()} FORUM ENET'COM. ALL RIGHTS RESERVED.
          </span>
        </div>
      </div>

      {/* Decorative corner marks */}
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-primary/20" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-primary/20" />
    </footer>
  );
};

export default Footer;
