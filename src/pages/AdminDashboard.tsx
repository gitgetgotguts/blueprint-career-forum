import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useOffers } from '@/contexts/OffersContext';
import { LogOut, Users, Building2, Calendar, TrendingUp, Settings, FileText, UserPlus, Trash2, GraduationCap, Briefcase, CheckCircle, XCircle, Clock, Eye, Mail, FolderOpen, ExternalLink } from 'lucide-react';
import BlueprintBackground from '@/components/BlueprintBackground';
import emailjs from '@emailjs/browser';

// Mock data for dashboard
const stats = [
  { label: 'Registered Students', value: '847', icon: Users, change: '+12%' },
  { label: 'Partner Companies', value: '52', icon: Building2, change: '+3' },
  { label: 'Days Until Event', value: '318', icon: Calendar, change: '' },
  { label: 'Website Visits', value: '3,241', icon: TrendingUp, change: '+28%' },
];

const AdminDashboard = () => {
  const { isAuthenticated, currentUser, logout, users, addUser, deleteUser } = useAuth();
  const { offers, getPendingOffers, approveOffer, rejectOffer, getApplicationsByOffer } = useOffers();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // New user form state
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    role: 'student' as UserRole,
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  // Rejection modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingOfferId, setRejectingOfferId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Applications view state
  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);

  // Get offer stats
  const pendingOffers = getPendingOffers();
  const approvedOffers = offers.filter(o => o.status === 'approved');
  const rejectedOffers = offers.filter(o => o.status === 'rejected');

  useEffect(() => {
    if (!isAuthenticated || currentUser?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sendWelcomeEmail = async (userEmail: string, userName: string, username: string, password: string, role: string) => {
    // EmailJS configuration - Replace these with your actual EmailJS credentials
    // Sign up at https://www.emailjs.com/ to get your own credentials
    const serviceId = 'service_erbwrcb'; // Replace with your EmailJS service ID
    const templateId = 'template_7x43444'; // Replace with your EmailJS template ID
    const publicKey = 'yfmAhNiwzyMMF_KbI'; // Replace with your EmailJS public key

    const templateParams = {
      password: password,
      username: username,
      time: new Date().toLocaleString(),
      email: userEmail,
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!newUser.username || !newUser.password || !newUser.name || !newUser.email) {
      setFormError('All fields are required');
      return;
    }

    const success = await addUser(newUser);
    if (success) {
      setSendingEmail(true);
      const emailSent = await sendWelcomeEmail(
        newUser.email,
        newUser.name,
        newUser.username,
        newUser.password,
        newUser.role
      );
      setSendingEmail(false);
      
      if (emailSent) {
        setFormSuccess(`User "${newUser.username}" created successfully! Login credentials sent to ${newUser.email}`);
      } else {
        setFormSuccess(`User "${newUser.username}" created successfully! (Email could not be sent - check EmailJS configuration)`);
      }
      setNewUser({ username: '', password: '', name: '', email: '', role: 'student' });
    } else {
      setFormError('Username already exists');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await deleteUser(id);
    }
  };

  const handleApproveOffer = async (offerId: string) => {
    await approveOffer(offerId);
    setFormSuccess('Offer approved successfully!');
    setTimeout(() => setFormSuccess(''), 3000);
  };

  const openRejectModal = (offerId: string) => {
    setRejectingOfferId(offerId);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleRejectOffer = async () => {
    if (!rejectingOfferId || !rejectionReason.trim()) {
      return;
    }
    await rejectOffer(rejectingOfferId, rejectionReason);
    setShowRejectModal(false);
    setRejectingOfferId(null);
    setRejectionReason('');
    setFormSuccess('Offer rejected successfully!');
    setTimeout(() => setFormSuccess(''), 3000);
  };

  if (!isAuthenticated || currentUser?.role !== 'admin') {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <BlueprintBackground />

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="blueprint-card p-8 max-w-lg w-full mx-4 border-red-500/40">
            <h2 className="font-heading text-2xl text-red-500 mb-6">REJECT OFFER</h2>
            <p className="text-muted-foreground mb-4">Please provide a reason for rejecting this offer. This will be shown to the company.</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full bg-background border-2 border-red-500/30 px-4 py-3 font-mono text-foreground focus:border-red-500 focus:outline-none resize-none h-32 mb-4"
              required
            />
            <div className="flex gap-4">
              <button
                onClick={handleRejectOffer}
                disabled={!rejectionReason.trim()}
                className="flex-1 font-heading text-lg px-6 py-4 bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                CONFIRM REJECTION
              </button>
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-6 py-4 border border-primary/30 font-heading text-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-primary/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/logo-free.png" 
                alt="FEEE Logo" 
                className="h-12 w-auto"
              />
              <div className="hidden sm:block">
                <span className="font-heading text-lg text-primary">ADMIN DASHBOARD</span>
                <span className="font-mono text-xs text-muted-foreground block">FEEE 11TH EDITION</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                VIEW SITE
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 font-heading px-4 py-2 border border-red-500/50 text-red-500 hover:bg-red-500/10 transition-colors"
              >
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
              WELCOME BACK, {currentUser?.name.toUpperCase()}
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl text-foreground">
              CONTROL CENTER
            </h1>
          </div>

          {formSuccess && (
            <div className="mb-6 p-4 border border-green-500/40 bg-green-500/10 text-green-500 font-mono text-sm text-center">
              {formSuccess}
            </div>
          )}

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-8 border-b border-primary/20 pb-4">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'offers', label: 'Job Offers', icon: Briefcase, badge: pendingOffers.length },
              { id: 'users', label: 'User Management', icon: UserPlus },
              { id: 'companies', label: 'Companies', icon: Building2 },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 font-mono text-sm px-4 py-2 transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-accent border-b-2 border-accent -mb-[18px]'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-black font-mono text-xs flex items-center justify-center rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="blueprint-card p-6 glow-hover">
                    <div className="flex items-start justify-between mb-4">
                      <stat.icon className="w-8 h-8 text-primary" />
                      {stat.change && (
                        <span className="font-mono text-xs text-green-500">{stat.change}</span>
                      )}
                    </div>
                    <div className="font-heading text-3xl text-foreground mb-1">{stat.value}</div>
                    <div className="font-mono text-xs text-muted-foreground tracking-widest">
                      {stat.label.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pending Offers Alert */}
              {pendingOffers.length > 0 && (
                <div 
                  onClick={() => setActiveTab('offers')}
                  className="blueprint-card p-6 mb-8 border-yellow-500/40 cursor-pointer hover:border-yellow-500/60 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Clock className="w-8 h-8 text-yellow-500" />
                    <div>
                      <div className="font-heading text-xl text-yellow-500">
                        {pendingOffers.length} PENDING OFFER{pendingOffers.length > 1 ? 'S' : ''}
                      </div>
                      <div className="font-mono text-sm text-muted-foreground">
                        Click to review and approve/reject offers
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button 
                  onClick={() => setActiveTab('users')}
                  className="blueprint-card p-6 glow-hover text-left hover:border-accent/60 transition-colors"
                >
                  <UserPlus className="w-6 h-6 text-accent mb-3" />
                  <div className="font-heading text-lg text-foreground mb-1">ADD USER</div>
                  <div className="font-mono text-xs text-muted-foreground">Create student or company account</div>
                </button>
                <button 
                  onClick={() => setActiveTab('offers')}
                  className="blueprint-card p-6 glow-hover text-left hover:border-accent/60 transition-colors"
                >
                  <Briefcase className="w-6 h-6 text-accent mb-3" />
                  <div className="font-heading text-lg text-foreground mb-1">MANAGE OFFERS</div>
                  <div className="font-mono text-xs text-muted-foreground">Review and approve job offers</div>
                </button>
                <button className="blueprint-card p-6 glow-hover text-left hover:border-accent/60 transition-colors">
                  <FileText className="w-6 h-6 text-accent mb-3" />
                  <div className="font-heading text-lg text-foreground mb-1">EXPORT DATA</div>
                  <div className="font-mono text-xs text-muted-foreground">Download CSV report</div>
                </button>
              </div>
            </>
          )}

          {/* Offers Tab */}
          {activeTab === 'offers' && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="blueprint-card p-6 border-yellow-500/40">
                  <Clock className="w-8 h-8 text-yellow-500 mb-2" />
                  <div className="font-heading text-3xl text-foreground">{pendingOffers.length}</div>
                  <div className="font-mono text-xs text-muted-foreground">PENDING REVIEW</div>
                </div>
                <div className="blueprint-card p-6 border-green-500/40">
                  <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                  <div className="font-heading text-3xl text-foreground">{approvedOffers.length}</div>
                  <div className="font-mono text-xs text-muted-foreground">APPROVED</div>
                </div>
                <div className="blueprint-card p-6 border-red-500/40">
                  <XCircle className="w-8 h-8 text-red-500 mb-2" />
                  <div className="font-heading text-3xl text-foreground">{rejectedOffers.length}</div>
                  <div className="font-mono text-xs text-muted-foreground">REJECTED</div>
                </div>
              </div>

              {/* Pending Offers */}
              <div>
                <h3 className="font-heading text-xl text-yellow-500 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  PENDING OFFERS
                </h3>
                {pendingOffers.length === 0 ? (
                  <div className="blueprint-card p-8 text-center text-muted-foreground">
                    No pending offers to review.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingOffers.map((offer) => (
                      <div key={offer.id} className="blueprint-card p-6 border-yellow-500/40">
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
                              By <span className="text-accent">{offer.companyName}</span> • {offer.location} {offer.duration && `• ${offer.duration}`}
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-3">{offer.description}</p>
                        <p className="text-sm text-primary/80 mb-4"><strong>Requirements:</strong> {offer.requirements}</p>
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleApproveOffer(offer.id)}
                            className="flex-1 font-heading px-6 py-3 bg-green-500 text-white hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            APPROVE
                          </button>
                          <button
                            onClick={() => openRejectModal(offer.id)}
                            className="flex-1 font-heading px-6 py-3 border border-red-500 text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-5 h-5" />
                            REJECT
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Approved Offers */}
              <div>
                <h3 className="font-heading text-xl text-green-500 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  APPROVED OFFERS
                </h3>
                {approvedOffers.length === 0 ? (
                  <div className="blueprint-card p-8 text-center text-muted-foreground">
                    No approved offers yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {approvedOffers.map((offer) => {
                      const apps = getApplicationsByOffer(offer.id);
                      const isExpanded = expandedOfferId === offer.id;
                      return (
                        <div key={offer.id} className="blueprint-card p-6 border-green-500/40">
                          <div 
                            className="flex items-start justify-between cursor-pointer"
                            onClick={() => setExpandedOfferId(isExpanded ? null : offer.id)}
                          >
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <span className="font-heading text-lg text-foreground">{offer.title}</span>
                                <span className={`font-mono text-xs px-2 py-1 ${
                                  offer.type === 'job' ? 'bg-accent/20 text-accent' :
                                  offer.type === 'pfe' ? 'bg-primary/20 text-primary' : 'bg-purple-500/20 text-purple-400'
                                }`}>
                                  {offer.type.toUpperCase()}
                                </span>
                              </div>
                              <div className="font-mono text-xs text-muted-foreground">
                                By <span className="text-accent">{offer.companyName}</span> • {offer.location}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-green-500 font-mono text-sm">
                              <Eye className="w-4 h-4" />
                              {apps.length} application{apps.length !== 1 ? 's' : ''} {isExpanded ? '▲' : '▼'}
                            </div>
                          </div>
                          
                          {/* Applications List */}
                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-green-500/20">
                              {apps.length === 0 ? (
                                <div className="text-center text-muted-foreground font-mono text-sm py-4">
                                  No applications yet for this offer.
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  <h4 className="font-heading text-sm text-green-500 mb-3">APPLICATIONS:</h4>
                                  {apps.map((app) => (
                                    <div key={app.id} className="p-4 border border-primary/20 bg-background/50 hover:border-accent/40 transition-colors">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <div className="font-heading text-foreground">{app.studentName}</div>
                                          <div className="font-mono text-xs text-muted-foreground">{app.studentEmail}</div>
                                          <div className="font-mono text-xs text-muted-foreground mt-1">
                                            Applied: {new Date(app.appliedAt).toLocaleDateString()}
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2">
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
                                          <span className={`font-mono text-xs px-3 py-1 ${
                                            app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                            app.status === 'accepted' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                                          }`}>
                                            {app.status.toUpperCase()}
                                          </span>
                                        </div>
                                      </div>
                                      
                                      {app.coverLetter && (
                                        <div className="mt-3 p-2 border border-primary/10 bg-primary/5 text-sm text-muted-foreground">
                                          <span className="font-mono text-xs text-primary block mb-1">Cover Letter:</span>
                                          {app.coverLetter}
                                        </div>
                                      )}
                                      
                                      {/* Display Projects */}
                                      {app.projects && app.projects.length > 0 && (
                                        <div className="mt-3">
                                          <div className="font-mono text-xs text-accent flex items-center gap-2 mb-2">
                                            <FolderOpen className="w-3 h-3" />
                                            PORTFOLIO PROJECTS ({app.projects.length})
                                          </div>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {app.projects.map((project) => (
                                              <div key={project.id} className="flex items-center gap-3 p-2 border border-accent/20 bg-accent/5">
                                                {project.imageUrl && (
                                                  <img
                                                    src={project.imageUrl}
                                                    alt={project.title}
                                                    className="w-12 h-12 object-cover"
                                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                                  />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                  <div className="font-heading text-xs text-foreground truncate">{project.title}</div>
                                                  {project.link && (
                                                    <a
                                                      href={project.link}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="font-mono text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                                                    >
                                                      <ExternalLink className="w-3 h-3" />
                                                      View
                                                    </a>
                                                  )}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Rejected Offers */}
              {rejectedOffers.length > 0 && (
                <div>
                  <h3 className="font-heading text-xl text-red-500 mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    REJECTED OFFERS
                  </h3>
                  <div className="space-y-4">
                    {rejectedOffers.map((offer) => (
                      <div key={offer.id} className="blueprint-card p-6 border-red-500/40">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-heading text-lg text-foreground">{offer.title}</span>
                              <span className={`font-mono text-xs px-2 py-1 ${
                                offer.type === 'job' ? 'bg-accent/20 text-accent' :
                                offer.type === 'pfe' ? 'bg-primary/20 text-primary' : 'bg-purple-500/20 text-purple-400'
                              }`}>
                                {offer.type.toUpperCase()}
                              </span>
                            </div>
                            <div className="font-mono text-xs text-muted-foreground">
                              By <span className="text-accent">{offer.companyName}</span>
                            </div>
                          </div>
                        </div>
                        {offer.rejectionReason && (
                          <div className="mt-3 p-3 border border-red-500/30 bg-red-500/10">
                            <span className="font-mono text-xs text-red-500">REJECTION REASON: </span>
                            <span className="text-red-400">{offer.rejectionReason}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Add User Form */}
              <div className="blueprint-card p-6">
                <h2 className="font-heading text-xl text-primary mb-6 flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  CREATE NEW ACCOUNT
                </h2>

                <form onSubmit={handleAddUser} className="space-y-4">
                  <div>
                    <label className="font-mono text-xs text-muted-foreground tracking-widest block mb-2">
                      ACCOUNT TYPE
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                      className="w-full bg-background border-2 border-primary/30 px-4 py-3 font-mono text-foreground focus:border-primary focus:outline-none transition-colors"
                    >
                      <option value="student">Student</option>
                      <option value="company">Company</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-mono text-xs text-muted-foreground tracking-widest block mb-2">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="w-full bg-background border-2 border-primary/30 px-4 py-3 font-mono text-foreground focus:border-primary focus:outline-none transition-colors"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-muted-foreground tracking-widest block mb-2">
                      EMAIL
                    </label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full bg-background border-2 border-primary/30 px-4 py-3 font-mono text-foreground focus:border-primary focus:outline-none transition-colors"
                      placeholder="Enter email"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-muted-foreground tracking-widest block mb-2">
                      USERNAME
                    </label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      className="w-full bg-background border-2 border-primary/30 px-4 py-3 font-mono text-foreground focus:border-primary focus:outline-none transition-colors"
                      placeholder="Enter username"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs text-muted-foreground tracking-widest block mb-2">
                      PASSWORD
                    </label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="w-full bg-background border-2 border-primary/30 px-4 py-3 font-mono text-foreground focus:border-primary focus:outline-none transition-colors"
                      placeholder="Enter password"
                    />
                  </div>

                  {formError && (
                    <div className="text-red-500 font-mono text-sm text-center border border-red-500/30 py-2">
                      {formError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={sendingEmail}
                    className="w-full font-heading text-lg px-6 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {sendingEmail ? (
                      <>
                        <Mail className="w-5 h-5 animate-pulse" />
                        SENDING EMAIL...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        CREATE ACCOUNT & SEND EMAIL
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* User List */}
              <div className="blueprint-card p-6">
                <h2 className="font-heading text-xl text-primary mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  ALL USERS ({users.length})
                </h2>

                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border border-primary/20 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 flex items-center justify-center ${
                          user.role === 'admin' 
                            ? 'bg-red-500/20 text-red-500' 
                            : user.role === 'company'
                            ? 'bg-accent/20 text-accent'
                            : 'bg-primary/20 text-primary'
                        }`}>
                          {user.role === 'admin' && <Settings className="w-5 h-5" />}
                          {user.role === 'student' && <GraduationCap className="w-5 h-5" />}
                          {user.role === 'company' && <Building2 className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="font-mono text-sm text-foreground">{user.name}</div>
                          <div className="font-mono text-xs text-muted-foreground">
                            @{user.username} • {user.role.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      
                      {user.id !== '1' && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {activeTab !== 'overview' && activeTab !== 'users' && activeTab !== 'offers' && (
            <div className="blueprint-card p-12 text-center">
              <div className="font-heading text-2xl text-muted-foreground mb-2">
                {activeTab.toUpperCase()} MANAGEMENT
              </div>
              <div className="font-mono text-sm text-muted-foreground">
                Coming soon...
              </div>
            </div>
          )}

          {/* Technical annotation */}
          <div className="mt-12 text-center font-mono text-xs text-primary/40 tracking-widest">
            ADMIN PANEL V2.0 • FEEE-11 • SECURE ACCESS
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
