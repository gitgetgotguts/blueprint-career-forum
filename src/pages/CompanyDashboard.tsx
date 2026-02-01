import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, User } from '@/contexts/AuthContext';
import { useOffers, OfferType } from '@/contexts/OffersContext';
import { LogOut, MessageSquare, Users, FileText, Settings, Send, Building2, Briefcase, Plus, Clock, CheckCircle, XCircle, Eye, FolderOpen, ExternalLink, ChevronDown, ChevronUp, Target, X, User as UserIcon } from 'lucide-react';
import BlueprintBackground from '@/components/BlueprintBackground';

interface ForumPost {
  id: string;
  author: string;
  authorRole: string;
  content: string;
  timestamp: string;
  replies: { author: string; content: string; timestamp: string }[];
}

const initialPosts: ForumPost[] = [
  {
    id: '1',
    author: 'FEEE Team',
    authorRole: 'admin',
    content: 'Welcome to FEEE 11! This is the official forum for students and companies to connect.',
    timestamp: '2026-01-15 10:00',
    replies: [],
  },
];

const CompanyDashboard = () => {
  const { isAuthenticated, currentUser, logout, getUserById } = useAuth();
  const { createOffer, getOffersByCompany, getApplicationsByOffer } = useOffers();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('offers');
  
  // Forum state
  const [posts, setPosts] = useState<ForumPost[]>(() => {
    const stored = localStorage.getItem('feee-forum-posts');
    return stored ? JSON.parse(stored) : initialPosts;
  });
  const [newPost, setNewPost] = useState('');
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});

  // Offer form state
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [newOffer, setNewOffer] = useState({
    title: '',
    type: 'stage' as OfferType,
    description: '',
    requirements: '',
    location: '',
    duration: '',
  });
  const [offerSuccess, setOfferSuccess] = useState('');
  const [expandedApplications, setExpandedApplications] = useState<Set<string>>(new Set());
  const [viewingStudentProfile, setViewingStudentProfile] = useState<User | null>(null);

  // Get company offers
  const companyOffers = currentUser ? getOffersByCompany(currentUser.id) : [];
  const pendingOffers = companyOffers.filter(o => o.status === 'pending');
  const approvedOffers = companyOffers.filter(o => o.status === 'approved');
  const rejectedOffers = companyOffers.filter(o => o.status === 'rejected');

  // Count total applications for this company's offers
  const totalApplications = approvedOffers.reduce((acc, offer) => {
    return acc + getApplicationsByOffer(offer.id).length;
  }, 0);

  const toggleApplicationExpanded = (appId: string) => {
    setExpandedApplications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(appId)) {
        newSet.delete(appId);
      } else {
        newSet.add(appId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== 'company') {
      navigate('/');
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    createOffer({
      companyId: currentUser.id,
      companyName: currentUser.name,
      title: newOffer.title,
      type: newOffer.type,
      description: newOffer.description,
      requirements: newOffer.requirements,
      location: newOffer.location,
      duration: newOffer.duration,
    });

    setOfferSuccess('Offer submitted for approval!');
    setNewOffer({ title: '', type: 'stage', description: '', requirements: '', location: '', duration: '' });
    setShowOfferForm(false);
    setTimeout(() => setOfferSuccess(''), 3000);
  };

  const handleNewPost = () => {
    if (!newPost.trim()) return;
    const post: ForumPost = {
      id: Date.now().toString(),
      author: currentUser?.name || 'Anonymous',
      authorRole: 'company',
      content: newPost,
      timestamp: new Date().toLocaleString(),
      replies: [],
    };
    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('feee-forum-posts', JSON.stringify(updatedPosts));
    setNewPost('');
  };

  const handleReply = (postId: string) => {
    if (!replyContent[postId]?.trim()) return;
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [...post.replies, {
            author: currentUser?.name || 'Anonymous',
            content: replyContent[postId],
            timestamp: new Date().toLocaleString(),
          }],
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem('feee-forum-posts', JSON.stringify(updatedPosts));
    setReplyContent({ ...replyContent, [postId]: '' });
  };

  if (!isAuthenticated || currentUser?.role !== 'company') {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <BlueprintBackground />

      {/* Student Profile Modal */}
      {viewingStudentProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="blueprint-card p-8 max-w-2xl w-full mx-4 border-accent/40 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl text-accent flex items-center gap-2">
                <UserIcon className="w-6 h-6" />
                STUDENT PROFILE
              </h2>
              <button
                onClick={() => setViewingStudentProfile(null)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Basic Info */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs text-muted-foreground tracking-widest">FULL NAME</label>
                  <div className="font-heading text-lg text-foreground">{viewingStudentProfile.name}</div>
                </div>
                <div>
                  <label className="font-mono text-xs text-muted-foreground tracking-widest">EMAIL</label>
                  <div className="font-heading text-lg text-foreground">{viewingStudentProfile.email}</div>
                </div>
              </div>
            </div>

            {/* Career Goal */}
            {viewingStudentProfile.studentProfile?.careerGoal && (
              <div className="mb-6 p-4 border border-accent/20 bg-accent/5">
                <label className="font-mono text-xs text-accent tracking-widest flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4" />
                  CAREER GOAL
                </label>
                <p className="font-mono text-sm text-foreground whitespace-pre-wrap">
                  {viewingStudentProfile.studentProfile.careerGoal}
                </p>
              </div>
            )}

            {/* All Projects */}
            {viewingStudentProfile.studentProfile?.projects && viewingStudentProfile.studentProfile.projects.length > 0 && (
              <div>
                <label className="font-mono text-xs text-muted-foreground tracking-widest flex items-center gap-2 mb-4">
                  <FolderOpen className="w-4 h-4 text-primary" />
                  PORTFOLIO ({viewingStudentProfile.studentProfile.projects.length} PROJECTS)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {viewingStudentProfile.studentProfile.projects.map((project) => (
                    <div key={project.id} className="border border-primary/20 bg-background overflow-hidden group">
                      {project.imageUrl && (
                        <div className="aspect-video bg-primary/5 overflow-hidden">
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            onError={(e) => (e.currentTarget.parentElement!.style.display = 'none')}
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h4 className="font-heading text-foreground mb-2">{project.title}</h4>
                        <p className="font-mono text-xs text-muted-foreground line-clamp-3 mb-3">
                          {project.description}
                        </p>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            VIEW PROJECT
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Profile Info */}
            {!viewingStudentProfile.studentProfile?.careerGoal && 
             (!viewingStudentProfile.studentProfile?.projects || viewingStudentProfile.studentProfile.projects.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <UserIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-mono text-sm">This student hasn't completed their profile yet.</p>
              </div>
            )}

            <button
              onClick={() => setViewingStudentProfile(null)}
              className="w-full mt-6 font-heading text-lg px-6 py-4 border border-primary/30 text-muted-foreground hover:text-foreground transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-primary/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/logo-free.png" alt="FEEE Logo" className="h-12 w-auto" />
              <div className="hidden sm:block">
                <span className="font-heading text-lg text-accent">COMPANY PORTAL</span>
                <span className="font-mono text-xs text-muted-foreground block">FEEE 11TH EDITION</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm text-muted-foreground hidden sm:block">{currentUser?.name}</span>
              <button onClick={handleLogout} className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors">
                VIEW SITE
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 font-heading px-4 py-2 border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors">
                <LogOut className="w-4 h-4" />
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Welcome Header */}
          <div className="mb-8">
            <span className="font-mono text-xs text-accent/60 tracking-widest block mb-2">
              WELCOME, {currentUser?.name.toUpperCase()}
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl text-foreground">COMPANY DASHBOARD</h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <div className="blueprint-card p-6 border-accent/40">
              <Briefcase className="w-8 h-8 text-accent mb-2" />
              <div className="font-heading text-3xl text-foreground">{companyOffers.length}</div>
              <div className="font-mono text-xs text-muted-foreground">TOTAL OFFERS</div>
            </div>
            <div className="blueprint-card p-6 border-yellow-500/40">
              <Clock className="w-8 h-8 text-yellow-500 mb-2" />
              <div className="font-heading text-3xl text-foreground">{pendingOffers.length}</div>
              <div className="font-mono text-xs text-muted-foreground">PENDING</div>
            </div>
            <div className="blueprint-card p-6 border-green-500/40">
              <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
              <div className="font-heading text-3xl text-foreground">{approvedOffers.length}</div>
              <div className="font-mono text-xs text-muted-foreground">APPROVED</div>
            </div>
            <div className="blueprint-card p-6 border-primary/40">
              <Users className="w-8 h-8 text-primary mb-2" />
              <div className="font-heading text-3xl text-foreground">{totalApplications}</div>
              <div className="font-mono text-xs text-muted-foreground">APPLICATIONS</div>
            </div>
          </div>

          {offerSuccess && (
            <div className="mb-6 p-4 border border-green-500/40 bg-green-500/10 text-green-500 font-mono text-sm text-center">
              {offerSuccess}
            </div>
          )}

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-8 border-b border-primary/20 pb-4">
            {[
              { id: 'offers', label: 'Job Offers', icon: Briefcase },
              { id: 'applications', label: 'Applications', icon: FileText },
              { id: 'forum', label: 'Forum', icon: MessageSquare },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 font-mono text-sm px-4 py-2 transition-colors ${
                  activeTab === tab.id ? 'text-accent border-b-2 border-accent -mb-[18px]' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Offers Tab */}
          {activeTab === 'offers' && (
            <div className="space-y-6">
              {/* Create Offer Button */}
              {!showOfferForm && (
                <button
                  onClick={() => setShowOfferForm(true)}
                  className="w-full blueprint-card p-6 border-dashed border-accent/40 hover:border-accent transition-colors flex items-center justify-center gap-3"
                >
                  <Plus className="w-6 h-6 text-accent" />
                  <span className="font-heading text-lg text-accent">CREATE NEW OFFER</span>
                </button>
              )}

              {/* Offer Form */}
              {showOfferForm && (
                <div className="blueprint-card p-6 border-accent/40">
                  <h2 className="font-heading text-xl text-accent mb-6 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    CREATE JOB / PFE / STAGE OFFER
                  </h2>
                  <form onSubmit={handleCreateOffer} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-mono text-xs text-muted-foreground tracking-widest block mb-2">OFFER TYPE</label>
                        <select
                          value={newOffer.type}
                          onChange={(e) => setNewOffer({ ...newOffer, type: e.target.value as OfferType })}
                          className="w-full bg-background border-2 border-primary/30 px-4 py-3 font-mono text-foreground focus:border-accent focus:outline-none"
                        >
                          <option value="stage">Stage (Internship)</option>
                          <option value="pfe">PFE (End of Studies Project)</option>
                          <option value="job">Job Offer</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-mono text-xs text-muted-foreground tracking-widest block mb-2">TITLE</label>
                        <input
                          type="text"
                          value={newOffer.title}
                          onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                          className="w-full bg-background border-2 border-primary/30 px-4 py-3 font-mono text-foreground focus:border-accent focus:outline-none"
                          placeholder="e.g. Software Developer Intern"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-mono text-xs text-muted-foreground tracking-widest block mb-2">DESCRIPTION</label>
                      <textarea
                        value={newOffer.description}
                        onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                        className="w-full bg-background border-2 border-primary/30 px-4 py-3 font-mono text-foreground focus:border-accent focus:outline-none resize-none h-24"
                        placeholder="Describe the position and responsibilities..."
                        required
                      />
                    </div>
                    <div>
                      <label className="font-mono text-xs text-muted-foreground tracking-widest block mb-2">REQUIREMENTS</label>
                      <textarea
                        value={newOffer.requirements}
                        onChange={(e) => setNewOffer({ ...newOffer, requirements: e.target.value })}
                        className="w-full bg-background border-2 border-primary/30 px-4 py-3 font-mono text-foreground focus:border-accent focus:outline-none resize-none h-24"
                        placeholder="Required skills, education level, etc..."
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-mono text-xs text-muted-foreground tracking-widest block mb-2">LOCATION</label>
                        <input
                          type="text"
                          value={newOffer.location}
                          onChange={(e) => setNewOffer({ ...newOffer, location: e.target.value })}
                          className="w-full bg-background border-2 border-primary/30 px-4 py-3 font-mono text-foreground focus:border-accent focus:outline-none"
                          placeholder="e.g. Sfax, Tunisia"
                          required
                        />
                      </div>
                      <div>
                        <label className="font-mono text-xs text-muted-foreground tracking-widest block mb-2">DURATION (optional)</label>
                        <input
                          type="text"
                          value={newOffer.duration}
                          onChange={(e) => setNewOffer({ ...newOffer, duration: e.target.value })}
                          className="w-full bg-background border-2 border-primary/30 px-4 py-3 font-mono text-foreground focus:border-accent focus:outline-none"
                          placeholder="e.g. 6 months"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="flex-1 font-heading text-lg px-6 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-all"
                      >
                        SUBMIT FOR APPROVAL
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowOfferForm(false)}
                        className="px-6 py-4 border border-primary/30 font-heading text-lg text-muted-foreground hover:text-foreground transition-colors"
                      >
                        CANCEL
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Offers List */}
              <div className="space-y-4">
                <h3 className="font-heading text-lg text-primary">YOUR OFFERS</h3>
                {companyOffers.length === 0 ? (
                  <div className="blueprint-card p-8 text-center text-muted-foreground">
                    No offers yet. Create your first offer above!
                  </div>
                ) : (
                  companyOffers.map((offer) => (
                    <div key={offer.id} className={`blueprint-card p-6 ${
                      offer.status === 'approved' ? 'border-green-500/40' : 
                      offer.status === 'rejected' ? 'border-red-500/40' : 'border-yellow-500/40'
                    }`}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-heading text-xl text-foreground">{offer.title}</span>
                            <span className={`font-mono text-xs px-2 py-1 ${
                              offer.type === 'job' ? 'bg-accent/20 text-accent' :
                              offer.type === 'pfe' ? 'bg-primary/20 text-primary' : 'bg-purple-500/20 text-purple-400'
                            }`}>
                              {offer.type.toUpperCase()}
                            </span>
                          </div>
                          <div className="font-mono text-xs text-muted-foreground">
                            {offer.location} {offer.duration && `• ${offer.duration}`} • Posted {offer.createdAt}
                          </div>
                        </div>
                        <div className={`flex items-center gap-2 font-mono text-xs px-3 py-1 ${
                          offer.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                          offer.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {offer.status === 'approved' && <CheckCircle className="w-4 h-4" />}
                          {offer.status === 'rejected' && <XCircle className="w-4 h-4" />}
                          {offer.status === 'pending' && <Clock className="w-4 h-4" />}
                          {offer.status.toUpperCase()}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-2">{offer.description}</p>
                      {offer.status === 'rejected' && offer.rejectionReason && (
                        <div className="mt-4 p-3 border border-red-500/30 bg-red-500/10">
                          <span className="font-mono text-xs text-red-500">REJECTION REASON: </span>
                          <span className="text-red-400">{offer.rejectionReason}</span>
                        </div>
                      )}
                      {offer.status === 'approved' && (
                        <div className="mt-4 flex items-center gap-2 text-green-500 font-mono text-sm">
                          <Eye className="w-4 h-4" />
                          {getApplicationsByOffer(offer.id).length} applications received
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <h3 className="font-heading text-lg text-primary">APPLICATIONS RECEIVED</h3>
              {approvedOffers.map((offer) => {
                const apps = getApplicationsByOffer(offer.id);
                if (apps.length === 0) return null;
                return (
                  <div key={offer.id} className="blueprint-card p-6">
                    <h4 className="font-heading text-lg text-accent mb-4">{offer.title}</h4>
                    <div className="space-y-4">
                      {apps.map((app) => {
                        const isExpanded = expandedApplications.has(app.id);
                        return (
                          <div key={app.id} className="border border-primary/20 hover:border-accent/40 transition-colors">
                            <div 
                              className="flex items-center justify-between p-4 cursor-pointer"
                              onClick={() => toggleApplicationExpanded(app.id)}
                            >
                              <div>
                                <div className="font-heading text-foreground">{app.studentName}</div>
                                <div className="font-mono text-xs text-muted-foreground">{app.studentEmail}</div>
                                <div className="font-mono text-xs text-muted-foreground mt-1">
                                  Applied: {new Date(app.appliedAt).toLocaleDateString()}
                                  {app.projects && app.projects.length > 0 && (
                                    <span className="ml-2 text-primary">• {app.projects.length} project(s) attached</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const student = getUserById(app.studentId);
                                    if (student) setViewingStudentProfile(student);
                                  }}
                                  className="font-mono text-sm px-4 py-2 bg-accent/20 text-accent hover:bg-accent/30 transition-colors flex items-center gap-1"
                                >
                                  <UserIcon className="w-4 h-4" />
                                  VIEW PROFILE
                                </button>
                                {app.cvFileName && (
                                  <a
                                    href={app.cvData}
                                    download={app.cvFileName}
                                    onClick={(e) => e.stopPropagation()}
                                    className="font-mono text-sm px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                                  >
                                    DOWNLOAD CV
                                  </a>
                                )}
                                {isExpanded ? (
                                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                            
                            {/* Expanded Content */}
                            {isExpanded && (
                              <div className="border-t border-primary/20 p-4 bg-background/50 space-y-4">
                                {/* Cover Letter */}
                                {app.coverLetter && (
                                  <div>
                                    <label className="font-mono text-xs text-muted-foreground tracking-widest block mb-2">
                                      COVER LETTER
                                    </label>
                                    <p className="font-mono text-sm text-foreground whitespace-pre-wrap bg-background p-3 border border-primary/10">
                                      {app.coverLetter}
                                    </p>
                                  </div>
                                )}
                                
                                {/* Projects */}
                                {app.projects && app.projects.length > 0 && (
                                  <div>
                                    <label className="font-mono text-xs text-muted-foreground tracking-widest block mb-2 flex items-center gap-2">
                                      <FolderOpen className="w-4 h-4 text-accent" />
                                      PORTFOLIO PROJECTS ({app.projects.length})
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      {app.projects.map((project) => (
                                        <div key={project.id} className="border border-primary/20 bg-background overflow-hidden">
                                          {project.imageUrl && (
                                            <div className="aspect-video bg-primary/5 overflow-hidden">
                                              <img
                                                src={project.imageUrl}
                                                alt={project.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => (e.currentTarget.parentElement!.style.display = 'none')}
                                              />
                                            </div>
                                          )}
                                          <div className="p-3">
                                            <h5 className="font-heading text-sm text-foreground">{project.title}</h5>
                                            <p className="font-mono text-xs text-muted-foreground line-clamp-2 mt-1">
                                              {project.description}
                                            </p>
                                            {project.link && (
                                              <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-mono text-xs text-primary hover:text-primary/80 flex items-center gap-1 mt-2"
                                              >
                                                <ExternalLink className="w-3 h-3" />
                                                VIEW PROJECT
                                              </a>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                {!app.coverLetter && (!app.projects || app.projects.length === 0) && (
                                  <p className="font-mono text-sm text-muted-foreground text-center py-4">
                                    No additional information provided.
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              {totalApplications === 0 && (
                <div className="blueprint-card p-8 text-center text-muted-foreground">
                  No applications yet. Applications will appear here once students apply to your approved offers.
                </div>
              )}
            </div>
          )}

          {/* Forum Tab */}
          {activeTab === 'forum' && (
            <div className="space-y-6">
              <div className="blueprint-card p-6 border-accent/40">
                <h2 className="font-heading text-xl text-accent mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  POST AN ANNOUNCEMENT
                </h2>
                <div className="flex gap-4">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share announcements with students..."
                    className="flex-1 bg-background border-2 border-accent/30 px-4 py-3 font-mono text-foreground focus:border-accent focus:outline-none resize-none h-24"
                  />
                  <button onClick={handleNewPost} className="self-end font-heading px-6 py-3 bg-accent text-accent-foreground hover:bg-accent/90 transition-all flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    POST
                  </button>
                </div>
              </div>
              {posts.map((post) => (
                <div key={post.id} className="blueprint-card p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-10 h-10 flex items-center justify-center ${
                      post.authorRole === 'admin' ? 'bg-red-500/20 text-red-500' :
                      post.authorRole === 'company' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'
                    }`}>
                      {post.authorRole === 'admin' ? 'A' : post.authorRole === 'company' ? 'C' : 'S'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-heading text-foreground">{post.author}</span>
                        <span className={`font-mono text-xs px-2 py-0.5 ${
                          post.authorRole === 'admin' ? 'bg-red-500/20 text-red-500' :
                          post.authorRole === 'company' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'
                        }`}>
                          {post.authorRole.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-2">{post.content}</p>
                      <span className="font-mono text-xs text-muted-foreground/60">{post.timestamp}</span>
                    </div>
                  </div>
                  {post.replies.length > 0 && (
                    <div className="ml-14 space-y-3 mb-4 border-l-2 border-accent/20 pl-4">
                      {post.replies.map((reply, index) => (
                        <div key={index}>
                          <span className="font-heading text-sm text-accent">{reply.author}</span>
                          <p className="text-sm text-muted-foreground">{reply.content}</p>
                          <span className="font-mono text-xs text-muted-foreground/60">{reply.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="ml-14 flex gap-2">
                    <input
                      type="text"
                      value={replyContent[post.id] || ''}
                      onChange={(e) => setReplyContent({ ...replyContent, [post.id]: e.target.value })}
                      placeholder="Write a reply..."
                      className="flex-1 bg-background border border-primary/30 px-3 py-2 font-mono text-sm text-foreground focus:border-accent focus:outline-none"
                    />
                    <button onClick={() => handleReply(post.id)} className="font-mono text-sm px-4 py-2 bg-accent/20 text-accent hover:bg-accent/30 transition-colors">
                      REPLY
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="blueprint-card p-6">
              <h2 className="font-heading text-xl text-accent mb-6">COMPANY PROFILE</h2>
              <div className="space-y-4">
                <div>
                  <label className="font-mono text-xs text-muted-foreground">COMPANY NAME</label>
                  <div className="font-heading text-lg text-foreground">{currentUser?.name}</div>
                </div>
                <div>
                  <label className="font-mono text-xs text-muted-foreground">EMAIL</label>
                  <div className="font-heading text-lg text-foreground">{currentUser?.email}</div>
                </div>
                <div>
                  <label className="font-mono text-xs text-muted-foreground">USERNAME</label>
                  <div className="font-heading text-lg text-foreground">@{currentUser?.username}</div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 text-center font-mono text-xs text-accent/40 tracking-widest">
            COMPANY PORTAL V2.0 • FEEE-11 • PARTNER ACCESS
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;
