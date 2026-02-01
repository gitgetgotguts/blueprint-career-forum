const PitchIllustration = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Blueprint grid background */}
      <defs>
        <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.3" />
        </pattern>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <rect width="50" height="50" fill="url(#smallGrid)" />
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
        </pattern>
      </defs>
      
      <rect width="400" height="300" fill="url(#grid)" className="text-primary" />

      {/* Student/Pitcher - Left side */}
      <g className="text-primary">
        {/* Head */}
        <circle cx="120" cy="80" r="25" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
        <circle cx="112" cy="75" r="3" fill="currentColor" opacity="0.6" />
        <circle cx="128" cy="75" r="3" fill="currentColor" opacity="0.6" />
        <path d="M 115 88 Q 120 93 125 88" fill="none" stroke="currentColor" strokeWidth="1.5" />
        
        {/* Body */}
        <line x1="120" y1="105" x2="120" y2="170" stroke="currentColor" strokeWidth="2" />
        
        {/* Arms - one raised gesturing */}
        <line x1="120" y1="120" x2="85" y2="140" stroke="currentColor" strokeWidth="2" />
        <line x1="120" y1="120" x2="160" y2="100" stroke="currentColor" strokeWidth="2" />
        <circle cx="160" cy="100" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        
        {/* Legs */}
        <line x1="120" y1="170" x2="100" y2="220" stroke="currentColor" strokeWidth="2" />
        <line x1="120" y1="170" x2="140" y2="220" stroke="currentColor" strokeWidth="2" />
        
        {/* Dimension annotation */}
        <text x="120" y="245" textAnchor="middle" className="fill-current" fontSize="8" opacity="0.6" fontFamily="monospace">
          STUDENT
        </text>
      </g>

      {/* Speech/Pitch bubbles */}
      <g className="text-accent">
        <path 
          d="M 165 60 L 230 60 L 230 95 L 180 95 L 170 110 L 175 95 L 165 95 Z" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        <line x1="175" y1="72" x2="220" y2="72" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <line x1="175" y1="80" x2="210" y2="80" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <line x1="175" y1="88" x2="200" y2="88" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      </g>

      {/* Company Ambassador - Right side */}
      <g className="text-primary">
        {/* Head */}
        <circle cx="280" cy="80" r="25" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="272" cy="75" r="3" fill="currentColor" opacity="0.6" />
        <circle cx="288" cy="75" r="3" fill="currentColor" opacity="0.6" />
        <path d="M 275 88 Q 280 92 285 88" fill="none" stroke="currentColor" strokeWidth="1.5" />
        
        {/* Body - more formal stance */}
        <line x1="280" y1="105" x2="280" y2="170" stroke="currentColor" strokeWidth="2" />
        
        {/* Tie/Badge indicator */}
        <path d="M 280 110 L 275 125 L 280 130 L 285 125 Z" fill="none" stroke="currentColor" strokeWidth="1" />
        
        {/* Arms - crossed or holding clipboard */}
        <line x1="280" y1="125" x2="250" y2="150" stroke="currentColor" strokeWidth="2" />
        <line x1="280" y1="125" x2="310" y2="150" stroke="currentColor" strokeWidth="2" />
        
        {/* Clipboard */}
        <rect x="300" y="140" width="25" height="35" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <line x1="305" y1="150" x2="320" y2="150" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <line x1="305" y1="157" x2="320" y2="157" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <line x1="305" y1="164" x2="315" y2="164" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        
        {/* Legs */}
        <line x1="280" y1="170" x2="265" y2="220" stroke="currentColor" strokeWidth="2" />
        <line x1="280" y1="170" x2="295" y2="220" stroke="currentColor" strokeWidth="2" />
        
        {/* Dimension annotation */}
        <text x="280" y="245" textAnchor="middle" className="fill-current" fontSize="8" opacity="0.6" fontFamily="monospace">
          RECRUITER
        </text>
      </g>

      {/* Connection/Interaction indicators */}
      <g className="text-accent">
        {/* Dotted line between them */}
        <line x1="145" y1="130" x2="255" y2="130" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" opacity="0.5" />
        
        {/* Center connection node */}
        <circle cx="200" cy="130" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="200" cy="130" r="3" fill="currentColor" opacity="0.6" />
      </g>

      {/* Company booth/stand indicator */}
      <g className="text-primary">
        <rect x="240" y="200" width="80" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
        <text x="280" y="225" textAnchor="middle" className="fill-current" fontSize="10" opacity="0.8" fontFamily="monospace">
          COMPANY
        </text>
      </g>

      {/* Blueprint dimension lines */}
      <g className="text-primary" opacity="0.4">
        {/* Horizontal dimension */}
        <line x1="80" y1="270" x2="320" y2="270" stroke="currentColor" strokeWidth="0.5" />
        <line x1="80" y1="265" x2="80" y2="275" stroke="currentColor" strokeWidth="0.5" />
        <line x1="320" y1="265" x2="320" y2="275" stroke="currentColor" strokeWidth="0.5" />
        <text x="200" y="280" textAnchor="middle" className="fill-current" fontSize="7" fontFamily="monospace">
          NETWORKING ZONE
        </text>
        
        {/* Corner marks */}
        <path d="M 10 10 L 10 30 M 10 10 L 30 10" stroke="currentColor" strokeWidth="1" />
        <path d="M 390 10 L 390 30 M 390 10 L 370 10" stroke="currentColor" strokeWidth="1" />
        <path d="M 10 290 L 10 270 M 10 290 L 30 290" stroke="currentColor" strokeWidth="1" />
        <path d="M 390 290 L 390 270 M 390 290 L 370 290" stroke="currentColor" strokeWidth="1" />
      </g>

      {/* Title annotation */}
      <text x="200" y="25" textAnchor="middle" className="fill-primary" fontSize="10" opacity="0.6" fontFamily="monospace">
        DWG: PITCH-01 | SCALE 1:1
      </text>
    </svg>
  );
};

export default PitchIllustration;
