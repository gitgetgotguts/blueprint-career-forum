import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, Project } from '@/contexts/AuthContext';
import { useOffers } from '@/contexts/OffersContext';
import { LogOut, MessageSquare, Calendar, Building2, User, Send, Briefcase, MapPin, Clock, Upload, CheckCircle, FileText, XCircle, Plus, Trash2, Link, Image, Target, FolderOpen, ExternalLink, Edit2 } from 'lucide-react';
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

const StudentDashboard = () => {
  const { isAuthenticated, currentUser, logout, updateStudentProfile, addProject, removeProject } = useAuth();
  const { getApprovedOffers, applyToOffer, getApplicationsByStudent } = useOffers();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('offers');
  
  // Forum state
  const [posts, setPosts] = useState<ForumPost[]>(() => {
    const stored = localStorage.getItem('feee-forum-posts');
    return stored ? JSON.parse(stored) : initialPosts;
  });
  const [newPost, setNewPost] = useState('');
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});

  // Application state
  const [applyingToOfferId, setApplyingToOfferId] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState('');
  const [applicationFilter, setApplicationFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);

  // Profile completion state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [careerGoal, setCareerGoal] = useState(currentUser?.studentProfile?.careerGoal || '');
  
  // Project form state
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    imageUrl: '',
    link: '',
  });
  const [projectImageFile, setProjectImageFile] = useState<File | null>(null);
  const [projectImagePreview, setProjectImagePreview] = useState<string>('');

  // Check if profile needs completion
  const needsProfileCompletion = currentUser?.role === 'student' && !currentUser?.studentProfile?.isProfileComplete;
  const studentProjects = currentUser?.studentProfile?.projects || [];

  // Get offers and applications
  const approvedOffers = getApprovedOffers();
  const myApplications = currentUser ? getApplicationsByStudent(currentUser.id) : [];
  const appliedOfferIds = myApplications.map(app => app.offerId);

  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== 'student') {
      navigate('/');
    }
    // Show profile completion modal for first-time login
    if (needsProfileCompletion) {
      setShowProfileModal(true);
    }
  }, [isAuthenticated, currentUser, navigate, needsProfileCompletion]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    await updateStudentProfile(currentUser.id, {
      careerGoal,
      projects: currentUser.studentProfile?.projects || [],
      isProfileComplete: true,
    });
    setShowProfileModal(false);
    setApplicationSuccess('Profile saved successfully!');
    setTimeout(() => setApplicationSuccess(''), 3000);
  };

  const handleProjectImageChange = (file: File | null) => {
    if (file) {
      setProjectImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProjectImagePreview(result);
      };
      reader.readAsDataURL(file);
    } else {
      setProjectImageFile(null);
      setProjectImagePreview('');
    }
  };

  const handleAddProject = async () => {
    if (!currentUser || !newProject.title.trim()) return;
    // Use uploaded image preview (base64) or URL
    const imageUrl = projectImagePreview || newProject.imageUrl;
    await addProject(currentUser.id, {
      title: newProject.title,
      description: newProject.description,
      imageUrl,
      link: newProject.link,
    });
    setNewProject({ title: '', description: '', imageUrl: '', link: '' });
    setProjectImageFile(null);
    setProjectImagePreview('');
    setShowProjectForm(false);
    setApplicationSuccess('Project added successfully!');
    setTimeout(() => setApplicationSuccess(''), 3000);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!currentUser) return;
    if (confirm('Are you sure you want to delete this project?')) {
      await removeProject(currentUser.id, projectId);
    }
  };

  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjectIds(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleApply = async (offerId: string) => {
    if (!currentUser || !cvFile) return;

    // Get selected projects data
    const includedProjects = studentProjects.filter(p => selectedProjectIds.includes(p.id));

    // Convert file to base64 for storage
    const reader = new FileReader();
    reader.onload = async (e) => {
      const cvData = e.target?.result as string;
      await applyToOffer({
        offerId,
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentEmail: currentUser.email,
        cvFileName: cvFile.name,
        cvData,
        coverLetter,
        projects: includedProjects,
      });

      setApplyingToOfferId(null);
      setCvFile(null);
      setCoverLetter('');
      setSelectedProjectIds([]);
      setApplicationSuccess('Application submitted successfully!');
      setTimeout(() => setApplicationSuccess(''), 3000);
    };
    reader.readAsDataURL(cvFile);
  };

  const handleNewPost = () => {
    if (!newPost.trim()) return;
    const post: ForumPost = {
      id: Date.now().toString(),
      author: currentUser?.name || 'Anonymous',
      authorRole: 'student',
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

  if (!isAuthenticated || currentUser?.role !== 'student') {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <BlueprintBackground />

      {/* Profile Completion Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="blueprint-card p-8 max-w-lg w-full mx-4 border-accent/40 max-h-[90vh] overflow-y-auto">
            <h2 className="font-heading text-2xl text-accent mb-2">COMPLETE YOUR PROFILE</h2>
            <p className="text-muted-foreground mb-6 font-mono text-sm">Tell us about yourself to get started</p>
            
            <div className="space-y-6">
              <div>
                <label className="font-mono text-xs text-muted-foreground tracking-widest block mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-accent" />
                  CAREER GOAL
                </label>
                <textarea
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  placeholder="What are your career aspirations? What type of role are you looking for?"
                  className="w-full bg-background border-2 border-accent/30 px-4 py-3 font-mono text-foreground focus:border-accent focus:outline-none resize-none h-32"
                />
              </div>

              <div className="border-t border-primary/20 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <label className="font-mono text-xs text-muted-foreground tracking-widest flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-accent" />
                    YOUR PROJECTS ({studentProjects.length})
                  </label>
                  <button
                    onClick={() => {
                      setShowProjectForm(true);
                    }}
                    className="font-mono text-xs px-3 py-1.5 bg-accent/20 text-accent hover:bg-accent/30 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    ADD PROJECT
                  </button>
                </div>
                
                {studentProjects.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground font-mono text-sm border border-dashed border-primary/30">
                    No projects yet. Add your first project!
                  </div>
                ) : (
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {studentProjects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-3 border border-primary/20 bg-background/50">
                        <div>
                          <div className="font-heading text-sm text-foreground">{project.title}</div>
                          <div className="font-mono text-xs text-muted-foreground truncate max-w-[200px]">{project.description}</div>
                        </div>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleSaveProfile}
                className="w-full font-heading text-lg px-6 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-all"
              >
                SAVE & CONTINUE
              </button>
              
              {currentUser?.studentProfile?.isProfileComplete && (
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="w-full font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showProjectForm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="blueprint-card p-8 max-w-lg w-full mx-4 border-primary/40">
            <h2 className="font-heading text-2xl text-primary mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6" />
              ADD NEW PROJECT
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="font-mono text-xs text-muted-foreground tracking-widest block mb-2">
                  PROJECT TITLE *
                </label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="e.g. E-commerce Website"
                  className="w-full bg-background border-2 border-primary/30 px-4 py-3 font-mono text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono text-xs text-muted-foreground tracking-widest block mb-2">
                  DESCRIPTION *
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Describe your project, technologies used, your role..."
                  className="w-full bg-background border-2 border-primary/30 px-4 py-3 font-mono text-foreground focus:border-primary focus:outline-none resize-none h-24"
                />
              </div>

              <div>
                <label className="font-mono text-xs text-muted-foreground tracking-widest block mb-2 flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  PROJECT THUMBNAIL (optional)
                </label>
                
                {/* Upload Image Option */}
                <div className="relative mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleProjectImageChange(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className={`w-full border-2 border-dashed px-4 py-4 text-center transition-colors ${
                    projectImageFile ? 'border-green-500 bg-green-500/10' : 'border-primary/30 hover:border-primary'
                  }`}>
                    {projectImageFile ? (
                      <div className="flex items-center justify-center gap-2 text-green-500">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-mono text-sm">{projectImageFile.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-muted-foreground">
                        <Upload className="w-6 h-6" />
                        <span className="font-mono text-xs">Click to upload thumbnail</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Or use URL */}
                {!projectImageFile && (
                  <>
                    <div className="text-center font-mono text-xs text-muted-foreground my-2">— OR —</div>
                    <input
                      type="url"
                      value={newProject.imageUrl}
                      onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                      placeholder="Paste image URL"
                      className="w-full bg-background border-2 border-primary/30 px-4 py-3 font-mono text-foreground focus:border-primary focus:outline-none text-sm"
                    />
                  </>
                )}

                {/* Preview */}
                {(projectImagePreview || newProject.imageUrl) && (
                  <div className="mt-2 border border-primary/20 p-2 relative">
                    <img 
                      src={projectImagePreview || newProject.imageUrl} 
                      alt="Preview" 
                      className="max-h-32 w-full object-cover"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    {projectImageFile && (
                      <button
                        onClick={() => handleProjectImageChange(null)}
                        className="absolute top-3 right-3 p-1 bg-red-500/80 text-white hover:bg-red-500 transition-colors"
                        type="button"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="font-mono text-xs text-muted-foreground tracking-widest block mb-2 flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  PROJECT LINK (optional)
                </label>
                <input
                  type="url"
                  value={newProject.link}
                  onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                  placeholder="https://github.com/username/project"
                  className="w-full bg-background border-2 border-primary/30 px-4 py-3 font-mono text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddProject}
                  disabled={!newProject.title.trim() || !newProject.description.trim()}
                  className="flex-1 font-heading text-lg px-6 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ADD PROJECT
                </button>
                <button
                  onClick={() => {
                    setShowProjectForm(false);
                    setNewProject({ title: '', description: '', imageUrl: '', link: '' });
                    setProjectImageFile(null);
                    setProjectImagePreview('');
                  }}
                  className="px-6 py-4 border border-primary/30 font-heading text-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {applyingToOfferId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="blueprint-card p-8 max-w-lg w-full mx-4 border-accent/40">
            <h2 className="font-heading text-2xl text-accent mb-6">APPLY FOR THIS POSITION</h2>
            
            <div className="space-y-4">
              <div>
                <label className="font-mono text-xs text-muted-foreground tracking-widest block mb-2">
                  UPLOAD YOUR CV (PDF) *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className={`w-full border-2 border-dashed px-4 py-6 text-center transition-colors ${
                    cvFile ? 'border-green-500 bg-green-500/10' : 'border-primary/30 hover:border-accent'
                  }`}>
                    {cvFile ? (
                      <div className="flex items-center justify-center gap-2 text-green-500">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-mono text-sm">{cvFile.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Upload className="w-8 h-8" />
                        <span className="font-mono text-sm">Click to upload CV</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="font-mono text-xs text-muted-foreground tracking-widest block mb-2">
                  COVER LETTER (OPTIONAL)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Why are you interested in this position?"
                  className="w-full bg-background border-2 border-primary/30 px-4 py-3 font-mono text-foreground focus:border-accent focus:outline-none resize-none h-32"
                />
              </div>

              {/* Project Selection */}
              {studentProjects.length > 0 && (
                <div>
                  <label className="font-mono text-xs text-muted-foreground tracking-widest block mb-2 flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-accent" />
                    INCLUDE PROJECTS (OPTIONAL)
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto border border-primary/20 p-2">
                    {studentProjects.map((project) => (
                      <label
                        key={project.id}
                        className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border ${
                          selectedProjectIds.includes(project.id)
                            ? 'border-accent bg-accent/10'
                            : 'border-transparent hover:bg-primary/5'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedProjectIds.includes(project.id)}
                          onChange={() => toggleProjectSelection(project.id)}
                          className="w-4 h-4 accent-accent"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-heading text-sm text-foreground">{project.title}</div>
                          <div className="font-mono text-xs text-muted-foreground truncate">{project.description}</div>
                        </div>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent hover:text-accent/80"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </label>
                    ))}
                  </div>
                  <p className="font-mono text-xs text-muted-foreground mt-1">
                    Selected: {selectedProjectIds.length} project(s)
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => handleApply(applyingToOfferId)}
                  disabled={!cvFile}
                  className="flex-1 font-heading text-lg px-6 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  SUBMIT APPLICATION
                </button>
                <button
                  onClick={() => {
                    setApplyingToOfferId(null);
                    setCvFile(null);
                    setCoverLetter('');
                  }}
                  className="px-6 py-4 border border-primary/30 font-heading text-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  CANCEL
                </button>
              </div>
            </div>
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
                <span className="font-heading text-lg text-primary">STUDENT PORTAL</span>
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
            <span className="font-mono text-xs text-primary/60 tracking-widest block mb-2">
              WELCOME, {currentUser?.name.toUpperCase()}
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl text-foreground">STUDENT DASHBOARD</h1>
          </div>

          {applicationSuccess && (
            <div className="mb-6 p-4 border border-green-500/40 bg-green-500/10 text-green-500 font-mono text-sm text-center">
              {applicationSuccess}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="blueprint-card p-6 border-accent/40 cursor-pointer hover:border-accent/60 transition-colors" onClick={() => { setActiveTab('applications'); setApplicationFilter('all'); }}>
              <Briefcase className="w-8 h-8 text-accent mb-2" />
              <div className="font-heading text-3xl text-foreground">{myApplications.length}</div>
              <div className="font-mono text-xs text-muted-foreground">TOTAL APPLICATIONS</div>
            </div>
            <div className="blueprint-card p-6 border-yellow-500/40 cursor-pointer hover:border-yellow-500/60 transition-colors" onClick={() => { setActiveTab('applications'); setApplicationFilter('pending'); }}>
              <Clock className="w-8 h-8 text-yellow-500 mb-2" />
              <div className="font-heading text-3xl text-foreground">{myApplications.filter(a => a.status === 'pending').length}</div>
              <div className="font-mono text-xs text-muted-foreground">PENDING</div>
            </div>
            <div className="blueprint-card p-6 border-green-500/40 cursor-pointer hover:border-green-500/60 transition-colors" onClick={() => { setActiveTab('applications'); setApplicationFilter('accepted'); }}>
              <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
              <div className="font-heading text-3xl text-foreground">{myApplications.filter(a => a.status === 'accepted').length}</div>
              <div className="font-mono text-xs text-muted-foreground">ACCEPTED</div>
            </div>
            <div className="blueprint-card p-6 border-red-500/40 cursor-pointer hover:border-red-500/60 transition-colors" onClick={() => { setActiveTab('applications'); setApplicationFilter('rejected'); }}>
              <XCircle className="w-8 h-8 text-red-500 mb-2" />
              <div className="font-heading text-3xl text-foreground">{myApplications.filter(a => a.status === 'rejected').length}</div>
              <div className="font-mono text-xs text-muted-foreground">REJECTED</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-8 border-b border-primary/20 pb-4">
            {[
              { id: 'offers', label: 'Job Offers', icon: Briefcase },
              { id: 'applications', label: 'My Applications', icon: FileText },
              { id: 'forum', label: 'Forum', icon: MessageSquare },
              { id: 'profile', label: 'My Profile', icon: User },
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
              <h3 className="font-heading text-lg text-accent">AVAILABLE OPPORTUNITIES</h3>
              {approvedOffers.length === 0 ? (
                <div className="blueprint-card p-8 text-center text-muted-foreground">
                  No job offers available at the moment. Check back later!
                </div>
              ) : (
                <div className="grid gap-6">
                  {approvedOffers.map((offer) => {
                    const hasApplied = appliedOfferIds.includes(offer.id);
                    return (
                      <div key={offer.id} className="blueprint-card p-6 hover:border-accent/60 transition-colors">
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
                            <div className="font-heading text-accent">{offer.companyName}</div>
                          </div>
                          {hasApplied ? (
                            <div className="flex items-center gap-2 font-mono text-sm px-4 py-2 bg-green-500/20 text-green-500">
                              <CheckCircle className="w-4 h-4" />
                              APPLIED
                            </div>
                          ) : (
                            <button
                              onClick={() => setApplyingToOfferId(offer.id)}
                              className="font-heading px-6 py-2 bg-accent text-accent-foreground hover:bg-accent/90 transition-all"
                            >
                              APPLY NOW
                            </button>
                          )}
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{offer.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-primary" />
                            {offer.location}
                          </div>
                          {offer.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-primary" />
                              {offer.duration}
                            </div>
                          )}
                        </div>
                        
                        <div className="border-t border-primary/20 pt-4">
                          <span className="font-mono text-xs text-primary tracking-widest">REQUIREMENTS:</span>
                          <p className="text-sm text-muted-foreground mt-1">{offer.requirements}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* My Applications Tab */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="font-heading text-lg text-primary">MY APPLICATIONS</h3>
                
                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'all', label: 'All', color: 'primary' },
                    { id: 'pending', label: 'Pending', color: 'yellow-500' },
                    { id: 'accepted', label: 'Accepted', color: 'green-500' },
                    { id: 'rejected', label: 'Rejected', color: 'red-500' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setApplicationFilter(filter.id as typeof applicationFilter)}
                      className={`font-mono text-xs px-3 py-1.5 transition-colors ${
                        applicationFilter === filter.id
                          ? filter.id === 'all' ? 'bg-primary text-primary-foreground'
                            : filter.id === 'pending' ? 'bg-yellow-500 text-black'
                            : filter.id === 'accepted' ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                          : `border border-${filter.color}/40 text-${filter.color} hover:bg-${filter.color}/10`
                      }`}
                    >
                      {filter.label.toUpperCase()} ({filter.id === 'all' ? myApplications.length : myApplications.filter(a => a.status === filter.id).length})
                    </button>
                  ))}
                </div>
              </div>
              
              {myApplications.length === 0 ? (
                <div className="blueprint-card p-8 text-center text-muted-foreground">
                  You haven't applied to any positions yet. Check out the available offers!
                </div>
              ) : (
                <div className="space-y-4">
                  {myApplications
                    .filter(app => applicationFilter === 'all' || app.status === applicationFilter)
                    .map((app) => {
                    const offer = approvedOffers.find(o => o.id === app.offerId);
                    return (
                      <div key={app.id} className={`blueprint-card p-6 ${
                        app.status === 'pending' ? 'border-yellow-500/40' :
                        app.status === 'accepted' ? 'border-green-500/40' : 'border-red-500/40'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-heading text-lg text-foreground">{offer?.title || 'Unknown Position'}</span>
                              {offer?.type && (
                                <span className={`font-mono text-xs px-2 py-1 ${
                                  offer.type === 'job' ? 'bg-accent/20 text-accent' :
                                  offer.type === 'pfe' ? 'bg-primary/20 text-primary' : 'bg-purple-500/20 text-purple-400'
                                }`}>
                                  {offer.type.toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="font-mono text-sm text-accent">{offer?.companyName}</div>
                            {offer?.location && (
                              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                {offer.location}
                              </div>
                            )}
                            <div className="font-mono text-xs text-muted-foreground mt-2">
                              Applied: {new Date(app.appliedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className={`flex items-center gap-2 font-mono text-sm px-3 py-1.5 ${
                              app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                              app.status === 'accepted' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                            }`}>
                              {app.status === 'pending' && <Clock className="w-4 h-4" />}
                              {app.status === 'accepted' && <CheckCircle className="w-4 h-4" />}
                              {app.status === 'rejected' && <XCircle className="w-4 h-4" />}
                              {app.status.toUpperCase()}
                            </div>
                            {app.status === 'pending' && (
                              <span className="font-mono text-xs text-muted-foreground">Awaiting response</span>
                            )}
                            {app.status === 'accepted' && (
                              <span className="font-mono text-xs text-green-500">Congratulations!</span>
                            )}
                          </div>
                        </div>
                        {app.coverLetter && (
                          <div className="mt-4 p-3 border border-primary/20 bg-primary/5">
                            <span className="font-mono text-xs text-primary">COVER LETTER:</span>
                            <p className="text-sm text-muted-foreground mt-1">{app.coverLetter}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {myApplications.filter(app => applicationFilter === 'all' || app.status === applicationFilter).length === 0 && (
                    <div className="blueprint-card p-8 text-center text-muted-foreground">
                      No {applicationFilter} applications found.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Forum Tab */}
          {activeTab === 'forum' && (
            <div className="space-y-6">
              <div className="blueprint-card p-6">
                <h2 className="font-heading text-xl text-primary mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  COMMUNITY FORUM
                </h2>
                <div className="flex gap-4">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share something with the community..."
                    className="flex-1 bg-background border-2 border-primary/30 px-4 py-3 font-mono text-foreground focus:border-primary focus:outline-none resize-none h-24"
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
                    <div className="ml-14 space-y-3 mb-4 border-l-2 border-primary/20 pl-4">
                      {post.replies.map((reply, index) => (
                        <div key={index}>
                          <span className="font-heading text-sm text-primary">{reply.author}</span>
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
                      className="flex-1 bg-background border border-primary/30 px-3 py-2 font-mono text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                    <button onClick={() => handleReply(post.id)} className="font-mono text-sm px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                      REPLY
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Basic Info Card */}
              <div className="blueprint-card p-6">
                <h2 className="font-heading text-xl text-primary mb-6">MY PROFILE</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="font-mono text-xs text-muted-foreground">FULL NAME</label>
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

              {/* Career Goal Card */}
              <div className="blueprint-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-xl text-accent flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    CAREER GOAL
                  </h2>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="font-mono text-xs px-3 py-1.5 text-accent hover:bg-accent/10 transition-colors flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    EDIT
                  </button>
                </div>
                {currentUser?.studentProfile?.careerGoal ? (
                  <p className="font-mono text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {currentUser.studentProfile.careerGoal}
                  </p>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-mono text-sm">No career goal set yet.</p>
                    <button
                      onClick={() => setShowProfileModal(true)}
                      className="mt-3 font-mono text-xs px-4 py-2 bg-accent/20 text-accent hover:bg-accent/30 transition-colors"
                    >
                      ADD CAREER GOAL
                    </button>
                  </div>
                )}
              </div>

              {/* Projects Card */}
              <div className="blueprint-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-xl text-primary flex items-center gap-2">
                    <FolderOpen className="w-5 h-5" />
                    MY PROJECTS ({studentProjects.length})
                  </h2>
                  <button
                    onClick={() => setShowProjectForm(true)}
                    className="font-mono text-xs px-3 py-1.5 bg-primary/20 text-primary hover:bg-primary/30 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    ADD PROJECT
                  </button>
                </div>
                
                {studentProjects.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-mono text-sm">No projects yet.</p>
                    <p className="font-mono text-xs mt-1">Add projects to showcase in your applications!</p>
                    <button
                      onClick={() => setShowProjectForm(true)}
                      className="mt-3 font-mono text-xs px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                    >
                      ADD YOUR FIRST PROJECT
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {studentProjects.map((project) => (
                      <div key={project.id} className="border border-primary/20 bg-background/50 overflow-hidden group">
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
                          <h3 className="font-heading text-lg text-foreground mb-2">{project.title}</h3>
                          <p className="font-mono text-xs text-muted-foreground line-clamp-3 mb-3">
                            {project.description}
                          </p>
                          <div className="flex items-center justify-between">
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
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="p-1.5 text-red-500 hover:bg-red-500/10 transition-colors ml-auto"
                              title="Delete project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="font-mono text-xs text-muted-foreground mt-2">
                            Added {new Date(project.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-12 text-center font-mono text-xs text-primary/40 tracking-widest">
            STUDENT PORTAL V2.0 • FEEE-11 • PARTICIPANT ACCESS
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
