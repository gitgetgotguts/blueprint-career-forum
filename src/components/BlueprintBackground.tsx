const BlueprintBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Main grid pattern */}
      <div className="absolute inset-0 blueprint-grid" />
      
      {/* Corner annotations */}
      <div className="absolute top-4 left-4 tech-annotation opacity-40">
        DWG NO: FEEE-11
      </div>
      <div className="absolute top-4 right-4 tech-annotation opacity-40">
        SCALE 1:1
      </div>
      <div className="absolute bottom-4 left-4 tech-annotation opacity-40">
        REV: 01
      </div>
      <div className="absolute bottom-4 right-4 tech-annotation opacity-40">
        DATE: 2025
      </div>

      {/* Decorative dimension lines */}
      <div className="absolute top-20 left-8 hidden lg:flex items-center gap-2 text-primary/30">
        <span className="w-8 h-px bg-primary/40" />
        <span className="font-mono text-[10px] tracking-widest">§ 42mm</span>
      </div>
      
      <div className="absolute bottom-40 right-8 hidden lg:flex items-center gap-2 text-primary/30">
        <span className="font-mono text-[10px] tracking-widest">REF: FEEE-11</span>
        <span className="w-8 h-px bg-primary/40" />
      </div>

      {/* Vertical dimension line on left */}
      <div className="absolute left-12 top-1/4 h-32 hidden xl:flex flex-col items-center">
        <div className="w-px h-full bg-primary/20" />
        <div className="absolute top-1/2 -translate-y-1/2 -rotate-90 font-mono text-[10px] text-primary/30 tracking-widest whitespace-nowrap">
          SECTION A-A
        </div>
      </div>
    </div>
  );
};

export default BlueprintBackground;
