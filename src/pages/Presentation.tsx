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
            <h2 className="font-heading text-2xl text-accent mb-4">POURQUOI LE THÈME BLUEPRINT ?</h2>
            <ul className="text-lg text-foreground/90 space-y-3 text-left">
              <li className="flex items-start gap-3">
                <span className="text-primary">▸</span>
                <span><strong className="text-accent">Construire l'Avenir</strong> - Un blueprint représente la planification et la construction, symbolisant comment les étudiants bâtissent leur carrière</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">▸</span>
                <span><strong className="text-accent">Identité Ingénieur</strong> - Parfait pour ENET'COM en tant qu'école d'ingénieurs, alliant esthétique technique et professionnalisme</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">▸</span>
                <span><strong className="text-accent">Professionnel & Moderne</strong> - Design épuré et technique qui séduit étudiants et partenaires entreprises</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">▸</span>
                <span><strong className="text-accent">Connecter les Points</strong> - Le motif en grille représente le réseau entre étudiants, entreprises et opportunités</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary">▸</span>
                <span><strong className="text-accent">Galerie des Éditions</strong> - Une machine à remonter le temps présentant les photos de toutes les éditions passées, honorant nos racines et notre histoire</span>
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
            <h2 className="font-heading text-4xl text-red-500">TABLEAU DE BORD ADMIN</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <div className="blueprint-card p-6">
              <h3 className="font-heading text-xl text-primary mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gestion des Utilisateurs
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• Créer des comptes étudiants & entreprises</li>
                <li>• Envoi automatique d'emails de bienvenue</li>
                <li>• Voir et supprimer les utilisateurs</li>
                <li>• Gérer toutes les données utilisateurs</li>
              </ul>
            </div>
            <div className="blueprint-card p-6">
              <h3 className="font-heading text-xl text-accent mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Modération des Offres
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• Examiner les offres en attente</li>
                <li>• Approuver ou rejeter avec feedback</li>
                <li>• Filtrer par statut (en attente/approuvé/rejeté)</li>
                <li>• Voir tous les détails des offres</li>
              </ul>
            </div>
            <div className="blueprint-card p-6">
              <h3 className="font-heading text-xl text-green-500 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Tableau de Bord Analytique
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• Statistiques en temps réel</li>
                <li>• Taux d'acceptation & métriques d'engagement</li>
                <li>• Top entreprises & offres populaires</li>
                <li>• Suivi des activités récentes</li>
              </ul>
            </div>
            <div className="blueprint-card p-6">
              <h3 className="font-heading text-xl text-purple-500 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Aperçu des Entreprises
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• Voir toutes les entreprises inscrites</li>
                <li>• Suivre l'activité des entreprises</li>
                <li>• Surveiller l'engagement des partenaires</li>
                <li>• Exporter des rapports de données</li>
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
            <h2 className="font-heading text-4xl text-accent">TABLEAU DE BORD ENTREPRISE</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <div className="blueprint-card p-6">
              <h3 className="font-heading text-xl text-primary mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Publier des Offres
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• Créer des offres Stage, PFE ou Emploi</li>
                <li>• Définir les exigences & la durée</li>
                <li>• Préciser le lieu & les détails</li>
                <li>• Soumettre pour approbation admin</li>
              </ul>
            </div>
            <div className="blueprint-card p-6">
              <h3 className="font-heading text-xl text-green-500 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Suivre les Offres
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• Voir toutes les offres soumises</li>
                <li>• Vérifier le statut d'approbation</li>
                <li>• Voir les raisons de rejet</li>
                <li>• Surveiller le nombre de candidatures</li>
              </ul>
            </div>
            <div className="blueprint-card p-6">
              <h3 className="font-heading text-xl text-purple-500 mb-4 flex items-center gap-2">
                <Send className="w-5 h-5" />
                Gérer les Candidatures
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• Examiner les candidatures étudiantes</li>
                <li>• Télécharger les CV (PDF)</li>
                <li>• Accepter ou refuser les candidats</li>
                <li>• <strong className="text-yellow-500">Les refus nécessitent un feedback</strong></li>
              </ul>
              <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/30 text-xs text-yellow-500">
                📝 Un feedback constructif aide les étudiants à s'améliorer pour les opportunités futures
              </div>
            </div>
            <div className="blueprint-card p-6">
              <h3 className="font-heading text-xl text-accent mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Voir les Profils Étudiants
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• Accéder aux profils des candidats</li>
                <li>• Voir les objectifs de carrière & bio</li>
                <li>• Parcourir les projets portfolio</li>
                <li>• Voir les miniatures & liens des projets</li>
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
            <h2 className="font-heading text-4xl text-primary">TABLEAU DE BORD ÉTUDIANT</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <div className="blueprint-card p-6">
              <h3 className="font-heading text-xl text-accent mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Parcourir les Opportunités
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• Voir toutes les offres approuvées</li>
                <li>• Filtrer par type (Stage/PFE/Emploi)</li>
                <li>• Voir les détails entreprise</li>
                <li>• Vérifier les exigences & le lieu</li>
              </ul>
            </div>
            <div className="blueprint-card p-6">
              <h3 className="font-heading text-xl text-green-500 mb-4 flex items-center gap-2">
                <Send className="w-5 h-5" />
                Postuler avec CV
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• Candidature en un clic</li>
                <li>• Téléverser son CV en PDF</li>
                <li>• Ajouter une lettre de motivation</li>
                <li>• Suivre le statut de candidature</li>
              </ul>
            </div>
            <div className="blueprint-card p-6">
              <h3 className="font-heading text-xl text-purple-500 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Suivre les Candidatures
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• Voir toutes les candidatures envoyées</li>
                <li>• Filtrer par statut</li>
                <li>• Voir le feedback entreprise</li>
                <li>• Surveiller acceptation/refus</li>
              </ul>
            </div>
            <div className="blueprint-card p-6 border-2 border-accent/50">
              <h3 className="font-heading text-xl text-primary mb-4 flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Construire son Profil
              </h3>
              <ul className="space-y-2 text-foreground/80">
                <li>• Définir ses objectifs de carrière & bio</li>
                <li>• <strong className="text-accent">Ajouter des projets portfolio</strong></li>
                <li>• Téléverser des miniatures de projets</li>
                <li>• Inclure liens GitHub/démo</li>
              </ul>
              <div className="mt-3 p-2 bg-accent/10 border border-accent/30 text-xs text-accent">
                ⭐ Les projets démontrent vos compétences aux entreprises et augmentent vos chances d'être recruté !
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
          <h2 className="font-heading text-4xl text-primary mb-6">STACK TECHNOLOGIQUE</h2>
          <p className="text-center text-accent mb-6 max-w-2xl text-sm">
            💡 Pourquoi ce stack ? <strong>Simple, moderne et suffisant</strong> — pas de surcharge, juste ce qu'il faut.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
            <div className="blueprint-card p-6 text-center">
              <div className="text-4xl mb-4">⚛️</div>
              <h3 className="font-heading text-xl text-primary mb-2">Frontend</h3>
              <ul className="space-y-1 text-foreground/80 text-sm">
                <li>React 18 + TypeScript</li>
                <li>Vite (Outil de Build Rapide)</li>
                <li>Tailwind CSS</li>
                <li>Composants Shadcn/UI</li>
              </ul>
              <div className="mt-3 p-2 bg-primary/10 border border-primary/30 text-xs text-primary">
                ✓ React = standard industrie<br/>
                ✓ Vite = 10x plus rapide que Webpack<br/>
                ✓ Tailwind = pas besoin de CSS custom
              </div>
            </div>
            <div className="blueprint-card p-6 text-center">
              <div className="text-4xl mb-4">🗄️</div>
              <h3 className="font-heading text-xl text-green-500 mb-2">Backend</h3>
              <ul className="space-y-1 text-foreground/80 text-sm">
                <li>Supabase (PostgreSQL)</li>
                <li>Base de Données Temps Réel</li>
                <li>Sécurité au Niveau des Lignes</li>
                <li>API RESTful</li>
              </ul>
              <div className="mt-3 p-2 bg-green-500/10 border border-green-500/30 text-xs text-green-500">
                ✓ Pas besoin de serveur Node.js<br/>
                ✓ Auth + DB + Storage intégrés<br/>
                ✓ Gratuit pour petits projets
              </div>
            </div>
            <div className="blueprint-card p-6 text-center">
              <div className="text-4xl mb-4">✉️</div>
              <h3 className="font-heading text-xl text-accent mb-2">Services</h3>
              <ul className="space-y-1 text-foreground/80 text-sm">
                <li>Intégration EmailJS</li>
                <li>Emails de Bienvenue Auto</li>
                <li>Gestion des CV PDF</li>
                <li>Stockage Images Base64</li>
              </ul>
              <div className="mt-3 p-2 bg-accent/10 border border-accent/30 text-xs text-accent">
                ✓ Emails sans backend SMTP<br/>
                ✓ 200 emails/mois gratuits<br/>
                ✓ Intégration en 5 minutes
              </div>
            </div>
          </div>
          <div className="mt-6 blueprint-card p-4 max-w-4xl border-2 border-yellow-500/50">
            <h3 className="font-heading text-lg text-yellow-500 mb-3 text-center">🎯 Pourquoi pas plus ?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span><strong>Pas de Node.js/Express</strong> — Supabase fournit déjà l'API</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span><strong>Pas de Docker</strong> — Déploiement statique simple</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-500">✗</span>
                <span><strong>Pas de microservices</strong> — Overengineering inutile</span>
              </div>
            </div>
          </div>
          <div className="mt-4 blueprint-card p-4 max-w-3xl">
            <h3 className="font-heading text-lg text-purple-500 mb-3 text-center">Fonctionnalités Clés</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
              <div className="p-2 border border-primary/30">
                <div className="font-heading text-primary">3 Rôles</div>
                <div className="text-foreground/60">Admin, Entreprise, Étudiant</div>
              </div>
              <div className="p-2 border border-primary/30">
                <div className="font-heading text-accent">Analytiques</div>
                <div className="text-foreground/60">Stats en Temps Réel</div>
              </div>
              <div className="p-2 border border-primary/30">
                <div className="font-heading text-green-500">Flux Complet</div>
                <div className="text-foreground/60">Publier → Approuver → Postuler</div>
              </div>
              <div className="p-2 border border-primary/30">
                <div className="font-heading text-purple-500">Responsive</div>
                <div className="text-foreground/60">Compatible Mobile</div>
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
        Utilisez ← → ou cliquez pour naviguer
      </div>
    </div>
  );
};

export default Presentation;
