const BlueprintBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Main grid pattern */}
      <div className="absolute inset-0 blueprint-grid" />
      
      {/* Corner annotations - larger and more visible */}
      <div className="absolute top-6 left-6 font-mono text-sm text-primary/60 tracking-widest">
        DWG NO: FEEE-11
      </div>
      <div className="absolute top-6 right-6 font-mono text-sm text-primary/60 tracking-widest">
        SCALE 1:1
      </div>
      <div className="absolute bottom-6 left-6 font-mono text-sm text-primary/60 tracking-widest">
        REV: 01
      </div>
      <div className="absolute bottom-6 right-6 font-mono text-sm text-primary/60 tracking-widest">
        DATE: 2026
      </div>

      {/* Large corner brackets */}
      <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-primary/40" />
      <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-primary/40" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-primary/40" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-primary/40" />

      {/* Decorative dimension lines - left side */}
      <div className="absolute top-32 left-8 hidden lg:flex items-center gap-3 text-primary/50">
        <span className="w-12 h-0.5 bg-primary/50" />
        <span className="font-mono text-xs tracking-widest">§ 42mm</span>
      </div>
      
      {/* Decorative dimension lines - right side */}
      <div className="absolute bottom-48 right-8 hidden lg:flex items-center gap-3 text-primary/50">
        <span className="font-mono text-xs tracking-widest">REF: FEEE-11</span>
        <span className="w-12 h-0.5 bg-primary/50" />
      </div>

      {/* Vertical dimension line on left */}
      <div className="absolute left-16 top-1/4 h-48 hidden xl:flex flex-col items-center">
        <div className="w-0.5 h-full bg-primary/30" />
        <div className="absolute top-0 w-3 h-0.5 bg-primary/40" />
        <div className="absolute bottom-0 w-3 h-0.5 bg-primary/40" />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-4 -rotate-90 font-mono text-xs text-primary/50 tracking-widest whitespace-nowrap">
          SECTION A-A
        </div>
      </div>

      {/* Vertical dimension line on right */}
      <div className="absolute right-16 top-1/2 h-48 hidden xl:flex flex-col items-center">
        <div className="w-0.5 h-full bg-primary/30" />
        <div className="absolute top-0 w-3 h-0.5 bg-primary/40" />
        <div className="absolute bottom-0 w-3 h-0.5 bg-primary/40" />
        <div className="absolute top-1/2 -translate-y-1/2 translate-x-4 rotate-90 font-mono text-xs text-primary/50 tracking-widest whitespace-nowrap">
          SECTION B-B
        </div>
      </div>

      {/* Center crosshair marker */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block opacity-20">
        <div className="relative w-24 h-24">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-primary/60" />
          <div className="absolute left-1/2 top-0 w-0.5 h-full bg-primary/60" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-primary/60 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary/60 rounded-full" />
        </div>
      </div>

      {/* Accent horizontal lines */}
      <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent hidden lg:block" />
      <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent hidden lg:block" />
    </div>
  );
};

export default BlueprintBackground;
