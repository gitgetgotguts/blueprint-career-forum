interface Props {
  className?: string;
}

const BuildingIllustration = ({ className }: Props) => {
  return (
    <svg
      viewBox="0 0 800 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main Building Structure */}
      <g stroke="currentColor" strokeWidth="1" className="text-primary">
        {/* Base */}
        <line x1="100" y1="350" x2="700" y2="350" />
        <line x1="100" y1="350" x2="100" y2="100" />
        <line x1="700" y1="350" x2="700" y2="100" />
        
        {/* Roof */}
        <line x1="100" y1="100" x2="400" y2="30" />
        <line x1="700" y1="100" x2="400" y2="30" />
        
        {/* Central Tower */}
        <rect x="350" y="50" width="100" height="120" strokeDasharray="4 2" />
        <line x1="375" y1="50" x2="400" y2="25" />
        <line x1="425" y1="50" x2="400" y2="25" />
        
        {/* Windows - Row 1 */}
        <rect x="130" y="130" width="40" height="60" />
        <rect x="190" y="130" width="40" height="60" />
        <rect x="250" y="130" width="40" height="60" />
        
        <rect x="510" y="130" width="40" height="60" />
        <rect x="570" y="130" width="40" height="60" />
        <rect x="630" y="130" width="40" height="60" />
        
        {/* Windows - Row 2 */}
        <rect x="130" y="220" width="40" height="60" />
        <rect x="190" y="220" width="40" height="60" />
        <rect x="250" y="220" width="40" height="60" />
        
        <rect x="510" y="220" width="40" height="60" />
        <rect x="570" y="220" width="40" height="60" />
        <rect x="630" y="220" width="40" height="60" />
        
        {/* Main Entrance */}
        <rect x="360" y="250" width="80" height="100" />
        <line x1="400" y1="250" x2="400" y2="350" strokeDasharray="4 2" />
        
        {/* Steps */}
        <line x1="340" y1="350" x2="340" y2="360" />
        <line x1="340" y1="360" x2="460" y2="360" />
        <line x1="460" y1="360" x2="460" y2="350" />
        
        <line x1="330" y1="360" x2="330" y2="370" />
        <line x1="330" y1="370" x2="470" y2="370" />
        <line x1="470" y1="370" x2="470" y2="360" />
        
        {/* Dimension Lines */}
        <g className="text-primary/40">
          <line x1="100" y1="385" x2="700" y2="385" strokeDasharray="2 4" />
          <line x1="100" y1="380" x2="100" y2="390" />
          <line x1="700" y1="380" x2="700" y2="390" />
        </g>
        
        {/* Decorative circles */}
        <circle cx="150" cy="90" r="15" strokeDasharray="3 3" />
        <circle cx="650" cy="90" r="15" strokeDasharray="3 3" />
        
        {/* Antenna/Tower top */}
        <line x1="400" y1="25" x2="400" y2="0" />
        <circle cx="400" cy="0" r="3" fill="currentColor" />
      </g>
      
      {/* Text annotations */}
      <text x="395" y="398" className="fill-primary/40 text-[10px] font-mono">ENET'COM</text>
    </svg>
  );
};

export default BuildingIllustration;
