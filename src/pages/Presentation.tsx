import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, GraduationCap, Building2, Shield, Users, Briefcase, Send, CheckCircle, Eye, FolderOpen } from 'lucide-react';

const Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'intro',
      title: 'FEEE - Forum ENET\'COM Entreprise Étudiant',
      content: (
        <div className="flex flex-col items-center justify-center h-full">
          <img 
            src="/logo-free.png" 
            alt="FEEE Logo" 
            className="w-80 h-80 object-contain mb-8"
          />
          <h1 className="font-heading text-4xl md:text-5xl text-primary mb-6 text-center">
            FORUM ENET'COM ENTREPRISE ÉTUDIANT
          </h1>
          <div className="max-w-3xl text-center space-y-4">
            <h2 className="font-heading text-2xl text-accent mb-4">WHY THE BLUEPRINT THEME?</h2>
            <ul className="text-lg text-foreground/90 space-y-3 text-left">
              <li className="flex items-start gap-3">
                <span className="text-primary">▸</span>
                <span><strong className="text-accent">Building Futures</strong> - A blueprint represents planning and construction, symbolizing how students build their careers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">▸</span>
                <span><strong className="text-accent">Engineering Identity</strong> - Perfect for ENET'COM as an engineering school, connecting technical aesthetics with professionalism</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">▸</span>
                <span><strong className="text-accent">Professional & Modern</strong> - Clean, technical design that appeals to both students and corporate partners</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">▸</span>
                <span><strong className="text-accent">Connecting the Dots</strong> - The grid pattern represents the network between students, companies, and opportunities</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">▸</span>
                <span><strong className="text-accent">Editions Gallery</strong> - A wayback machine showcasing photos from all past editions, honoring our roots and history</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'admin',
      title: 'Admin Dashboard',
      content: (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex items-center gap-4 mb-8">
            <Shield className="w-16 h-16 text-red-500" />
            <h2 className="font-heading text-4xl text-red-500">ADMIN DASHBOARD</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <div className="blueprint-card p-6">
              <h3 className="font-heading text-xl text-primary mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• Create student & company accounts</li>
                <li>• Auto-send welcome emails with credentials</li>
                <li>• View and delete users</li>
                <li>• Manage all user data</li>
              </ul>
            </div>
            <div className="blueprint-card p-6">
              <h3 className="font-heading text-xl text-accent mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Offer Moderation
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• Review pending job offers</li>
                <li>• Approve or reject with feedback</li>
                <li>• Filter by status (pending/approved/rejected)</li>
                <li>• View all offer details</li>
              </ul>
            </div>
            <div className="blueprint-card p-6">
              <h3 className="font-heading text-xl text-green-500 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Analytics Dashboard
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• Real-time statistics from database</li>
                <li>• Acceptance rates & engagement metrics</li>
                <li>• Top companies & popular offers</li>
                <li>• Recent activity tracking</li>
              </ul>
            </div>
            <div className="blueprint-card p-6">
              <h3 className="font-heading text-xl text-purple-500 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Company Overview
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• View all registered companies</li>
                <li>• Track company activity</li>
                <li>• Monitor partner engagement</li>
                <li>• Export data reports</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'company',
      title: 'Company Dashboard',
      content: (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex items-center gap-4 mb-8">
            <Building2 className="w-16 h-16 text-accent" />
            <h2 className="font-heading text-4xl text-accent">COMPANY DASHBOARD</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <div className="blueprint-card p-6">
              <h3 className="font-heading text-xl text-primary mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Post Job Offers
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• Create Stage, PFE, or Job offers</li>
                <li>• Set requirements & duration</li>
                <li>• Specify location & details</li>
                <li>• Submit for admin approval</li>
              </ul>
            </div>
            <div className="blueprint-card p-6">
              <h3 className="font-heading text-xl text-green-500 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Track Offers
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• View all submitted offers</li>
                <li>• Check approval status</li>
                <li>• See rejection reasons</li>
                <li>• Monitor application count</li>
              </ul>
            </div>
            <div className="blueprint-card p-6">
              <h3 className="font-heading text-xl text-purple-500 mb-4 flex items-center gap-2">
                <Send className="w-5 h-5" />
                Manage Applications
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• Review student applications</li>
                <li>• Download CVs (PDF)</li>
                <li>• Accept or reject candidates</li>
                <li>• <strong className="text-yellow-500">Rejections require feedback</strong></li>
              </ul>
              <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-500">
                📝 Constructive feedback helps students improve for future opportunities
              </div>
            </div>
            <div className="blueprint-card p-6">
              <h3 className="font-heading text-xl text-accent mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                View Student Profiles
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• Access applicant profiles</li>
                <li>• View career goals & about</li>
                <li>• Browse portfolio projects</li>
                <li>• See project thumbnails & links</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'student',
      title: 'Student Dashboard',
      content: (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex items-center gap-4 mb-8">
            <GraduationCap className="w-16 h-16 text-primary" />
            <h2 className="font-heading text-4xl text-primary">STUDENT DASHBOARD</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <div className="blueprint-card p-6">
              <h3 className="font-heading text-xl text-accent mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Browse Opportunities
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• View all approved offers</li>
                <li>• Filter by type (Stage/PFE/Job)</li>
                <li>• See company details</li>
                <li>• Check requirements & location</li>
              </ul>
            </div>
            <div className="blueprint-card p-6">
              <h3 className="font-heading text-xl text-green-500 mb-4 flex items-center gap-2">
                <Send className="w-5 h-5" />
                Apply with CV
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• One-click application</li>
                <li>• Upload CV as PDF</li>
                <li>• Add cover letter message</li>
                <li>• Track application status</li>
              </ul>
            </div>
            <div className="blueprint-card p-6">
              <h3 className="font-heading text-xl text-purple-500 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Track Applications
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• View all sent applications</li>
                <li>• Filter by status</li>
                <li>• See company feedback</li>
                <li>• Monitor acceptance/rejection</li>
              </ul>
            </div>
            <div className="blueprint-card p-6 border-2 border-accent/50">
              <h3 className="font-heading text-xl text-primary mb-4 flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Build Your Profile
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• Set career goals & bio</li>
                <li>• <strong className="text-accent">Add portfolio projects</strong></li>
                <li>• Upload project thumbnails</li>
                <li>• Include GitHub/demo links</li>
              </ul>
              <div className="mt-3 p-2 bg-accent/10 border border-accent/30 text-xs text-accent">
                ⭐ Projects showcase your skills to companies and increase your chances of getting hired!
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tech',
      title: 'Technology Stack',
      content: (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="font-heading text-4xl text-primary mb-8">TECHNOLOGY STACK</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
            <div className="blueprint-card p-6 text-center">
              <div className="text-4xl mb-4">⚛️</div>
              <h3 className="font-heading text-xl text-primary mb-2">Frontend</h3>
              <ul className="space-y-1 text-foreground/80 text-sm">
                <li>React 18 + TypeScript</li>
                <li>Vite (Fast Build Tool)</li>
                <li>Tailwind CSS</li>
                <li>Shadcn/UI Components</li>
              </ul>
            </div>
            <div className="blueprint-card p-6 text-center">
              <div className="text-4xl mb-4">🗄️</div>
              <h3 className="font-heading text-xl text-green-500 mb-2">Backend</h3>
              <ul className="space-y-1 text-foreground/80 text-sm">
                <li>Supabase (PostgreSQL)</li>
                <li>Real-time Database</li>
                <li>Row Level Security</li>
                <li>RESTful API</li>
              </ul>
            </div>
            <div className="blueprint-card p-6 text-center">
              <div className="text-4xl mb-4">✉️</div>
              <h3 className="font-heading text-xl text-accent mb-2">Services</h3>
              <ul className="space-y-1 text-foreground/80 text-sm">
                <li>EmailJS Integration</li>
                <li>Auto Welcome Emails</li>
                <li>PDF CV Handling</li>
                <li>Base64 Image Storage</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 blueprint-card p-6 max-w-3xl">
            <h3 className="font-heading text-xl text-purple-500 mb-4 text-center">Key Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
              <div className="p-2 border border-primary/30">
                <div className="font-heading text-primary">3 Roles</div>
                <div className="text-foreground/60">Admin, Company, Student</div>
              </div>
              <div className="p-2 border border-primary/30">
                <div className="font-heading text-accent">Real Analytics</div>
                <div className="text-foreground/60">Live Dashboard Stats</div>
              </div>
              <div className="p-2 border border-primary/30">
                <div className="font-heading text-green-500">Full Workflow</div>
                <div className="text-foreground/60">Post → Approve → Apply</div>
              </div>
              <div className="p-2 border border-primary/30">
                <div className="font-heading text-purple-500">Responsive</div>
                <div className="text-foreground/60">Mobile Friendly</div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background relative">
      {/* Blueprint Background - matching website grid */}
      <div className="absolute inset-0 blueprint-grid opacity-60" />

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-primary/20 hover:bg-primary/40 border border-primary/40 transition-all"
      >
        <ChevronLeft className="w-8 h-8 text-primary" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-primary/20 hover:bg-primary/40 border border-primary/40 transition-all"
      >
        <ChevronRight className="w-8 h-8 text-primary" />
      </button>

      {/* Slide Content */}
      <div className="h-full w-full flex items-center justify-center p-8 md:p-16 relative z-10">
        <div className="w-full h-full">
          {slides[currentSlide].content}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-primary scale-125' 
                : 'bg-primary/30 hover:bg-primary/50'
            }`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-6 right-6 font-mono text-sm text-muted-foreground z-20">
        {currentSlide + 1} / {slides.length}
      </div>

      {/* Keyboard hint */}
      <div className="absolute bottom-6 left-6 font-mono text-xs text-muted-foreground z-20">
        Use ← → arrows or click to navigate
      </div>
    </div>
  );
};

export default Presentation;
