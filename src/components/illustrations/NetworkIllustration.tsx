interface Props {
  className?: string;
}

const NetworkIllustration = ({ className }: Props) => {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g stroke="currentColor" strokeWidth="1" className="text-primary">
        {/* Central node - Companies */}
        <circle cx="200" cy="200" r="50" strokeDasharray="4 2" />
        <text x="200" y="195" textAnchor="middle" className="fill-primary text-[10px] font-mono">
          COMPANIES
        </text>
        <text x="200" y="210" textAnchor="middle" className="fill-accent text-[8px] font-mono">
          ◆ HUB ◆
        </text>

        {/* Student nodes */}
        <circle cx="100" cy="100" r="30" />
        <text x="100" y="103" textAnchor="middle" className="fill-foreground text-[9px] font-mono">
          STUDENTS
        </text>

        <circle cx="300" cy="100" r="30" />
        <text x="300" y="103" textAnchor="middle" className="fill-foreground text-[9px] font-mono">
          INTERNS
        </text>

        <circle cx="100" cy="300" r="30" />
        <text x="100" y="303" textAnchor="middle" className="fill-foreground text-[9px] font-mono">
          CAREERS
        </text>

        <circle cx="300" cy="300" r="30" />
        <text x="300" y="303" textAnchor="middle" className="fill-foreground text-[9px] font-mono">
          MENTORS
        </text>

        {/* Connection lines */}
        <line x1="130" y1="115" x2="165" y2="165" strokeDasharray="4 4" />
        <line x1="270" y1="115" x2="235" y2="165" strokeDasharray="4 4" />
        <line x1="130" y1="285" x2="165" y2="235" strokeDasharray="4 4" />
        <line x1="270" y1="285" x2="235" y2="235" strokeDasharray="4 4" />

        {/* Arrows on connections */}
        <polygon points="165,165 158,158 152,168" fill="currentColor" />
        <polygon points="235,165 242,158 248,168" fill="currentColor" />
        <polygon points="165,235 158,242 152,232" fill="currentColor" />
        <polygon points="235,235 242,242 248,232" fill="currentColor" />

        {/* Outer connection ring */}
        <circle cx="200" cy="200" r="150" strokeDasharray="8 4" opacity="0.3" />

        {/* Horizontal and vertical axis lines */}
        <line x1="50" y1="200" x2="150" y2="200" strokeDasharray="2 6" opacity="0.3" />
        <line x1="250" y1="200" x2="350" y2="200" strokeDasharray="2 6" opacity="0.3" />
        <line x1="200" y1="50" x2="200" y2="150" strokeDasharray="2 6" opacity="0.3" />
        <line x1="200" y1="250" x2="200" y2="350" strokeDasharray="2 6" opacity="0.3" />

        {/* Corner brackets */}
        <path d="M30 30 L30 50 M30 30 L50 30" opacity="0.4" />
        <path d="M370 30 L370 50 M370 30 L350 30" opacity="0.4" />
        <path d="M30 370 L30 350 M30 370 L50 370" opacity="0.4" />
        <path d="M370 370 L370 350 M370 370 L350 370" opacity="0.4" />

        {/* Small connection dots */}
        <circle cx="165" cy="165" r="3" fill="currentColor" className="text-accent" />
        <circle cx="235" cy="165" r="3" fill="currentColor" className="text-accent" />
        <circle cx="165" cy="235" r="3" fill="currentColor" className="text-accent" />
        <circle cx="235" cy="235" r="3" fill="currentColor" className="text-accent" />
      </g>
    </svg>
  );
};

export default NetworkIllustration;
