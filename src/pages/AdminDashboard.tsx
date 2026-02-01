import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useOffers } from '@/contexts/OffersContext';
import { supabase } from '@/lib/supabase';
import { LogOut, Users, Building2, Calendar, TrendingUp, Settings, FileText, UserPlus, Trash2, GraduationCap, Briefcase, CheckCircle, XCircle, Clock, Eye, Mail, FolderOpen, ExternalLink, FileCheck, Send, Activity, Target, BarChart3, Award, Percent, Star } from 'lucide-react';
import BlueprintBackground from '@/components/BlueprintBackground';
import emailjs from '@emailjs/browser';

interface TopCompany {
  name: string;
  offerCount: number;
  applicationCount: number;
}

interface TopOffer {
  title: string;
  companyName: string;
  applicationCount: number;
  type: string;
}

interface AnalyticsData {
  totalStudents: number;
  totalCompanies: number;
  totalOffers: number;
  totalApplications: number;
  totalProjects: number;
  pendingOffers: number;
  approvedOffers: number;
  rejectedOffers: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  recentUsers: { name: string; role: string; created_at: string }[];
  offersByType: { job: number; pfe: number; stage: number };
  applicationsThisWeek: number;
  applicationsLastWeek: number;
  // New metrics
  studentsWithProfiles: number;
  profileCompletionRate: number;
  avgApplicationsPerOffer: number;
  avgApplicationsPerStudent: number;
  acceptanceRate: number;
  topCompanies: TopCompany[];
  topOffers: TopOffer[];
  recentApplications: { studentName: string; offerTitle: string; appliedAt: string; status: string }[];
  companiesWithOffers: number;
  studentsWithApplications: number;
  offersThisMonth: number;
  offersLastMonth: number;
}

const AdminDashboard = () => {
  const { isAuthenticated, currentUser, logout, users, addUser, deleteUser } = useAuth();
  const { offers, getPendingOffers, approveOffer, rejectOffer, getApplicationsByOffer, applications } = useOffers();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

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
  const pendingOffersList = getPendingOffers();
  const approvedOffersList = offers.filter(o => o.status === 'approved');
  const rejectedOffersList = offers.filter(o => o.status === 'rejected');

  // Fetch analytics from Supabase
  const fetchAnalytics = async () => {
    try {
      setLoadingAnalytics(true);

      // Fetch all data in parallel
      const [
        { data: profiles },
        { data: offersData },
        { data: applicationsData },
        { data: projectsData }
      ] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('offers').select('*'),
        supabase.from('applications').select('*'),
        supabase.from('projects').select('*')
      ]);

      const students = (profiles || []).filter(p => p.role === 'student');
      const companies = (profiles || []).filter(p => p.role === 'company');
      
      const pending = (offersData || []).filter(o => o.status === 'pending');
      const approved = (offersData || []).filter(o => o.status === 'approved');
      const rejected = (offersData || []).filter(o => o.status === 'rejected');

      const pendingApps = (applicationsData || []).filter(a => a.status === 'pending');
      const acceptedApps = (applicationsData || []).filter(a => a.status === 'accepted');
      const rejectedApps = (applicationsData || []).filter(a => a.status === 'rejected');

      // Offers by type
      const jobOffers = (offersData || []).filter(o => o.type === 'job').length;
      const pfeOffers = (offersData || []).filter(o => o.type === 'pfe').length;
      const stageOffers = (offersData || []).filter(o => o.type === 'stage').length;

      // Recent users (last 5)
      const recentUsers = (profiles || [])
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map(p => ({ name: p.name, role: p.role, created_at: p.created_at }));

      // Applications this week vs last week
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      const appsThisWeek = (applicationsData || []).filter(a => 
        new Date(a.applied_at) >= oneWeekAgo
      ).length;

      const appsLastWeek = (applicationsData || []).filter(a => 
        new Date(a.applied_at) >= twoWeeksAgo && new Date(a.applied_at) < oneWeekAgo
      ).length;

      // Students with profile data (career goals or about filled)
      const studentsWithProfiles = students.filter(s => s.career_goals || s.about).length;
      const profileCompletionRate = students.length > 0 
        ? Math.round((studentsWithProfiles / students.length) * 100) 
        : 0;

      // Average applications per offer (only approved offers)
      const avgApplicationsPerOffer = approved.length > 0
        ? Math.round(((applicationsData || []).length / approved.length) * 10) / 10
        : 0;

      // Average applications per student
      const studentsWhoApplied = [...new Set((applicationsData || []).map(a => a.student_id))];
      const avgApplicationsPerStudent = studentsWhoApplied.length > 0
        ? Math.round(((applicationsData || []).length / studentsWhoApplied.length) * 10) / 10
        : 0;

      // Acceptance rate
      const decidedApps = acceptedApps.length + rejectedApps.length;
      const acceptanceRate = decidedApps > 0 
        ? Math.round((acceptedApps.length / decidedApps) * 100) 
        : 0;

      // Top companies by offers and applications
      const companyOfferCounts: Record<string, { name: string; offerCount: number; applicationCount: number }> = {};
      
      for (const offer of (offersData || [])) {
        const company = companies.find(c => c.id === offer.company_id);
        const companyName = company?.name || 'Unknown';
        
        if (!companyOfferCounts[offer.company_id]) {
          companyOfferCounts[offer.company_id] = { name: companyName, offerCount: 0, applicationCount: 0 };
        }
        companyOfferCounts[offer.company_id].offerCount++;
        
        // Count applications for this offer
        const offerApps = (applicationsData || []).filter(a => a.offer_id === offer.id);
        companyOfferCounts[offer.company_id].applicationCount += offerApps.length;
      }

      const topCompanies: TopCompany[] = Object.values(companyOfferCounts)
        .sort((a, b) => b.applicationCount - a.applicationCount)
        .slice(0, 5);

      // Top offers by applications
      const topOffers: TopOffer[] = (offersData || [])
        .filter(o => o.status === 'approved')
        .map(o => {
          const appCount = (applicationsData || []).filter(a => a.offer_id === o.id).length;
          const company = companies.find(c => c.id === o.company_id);
          return {
            title: o.title,
            companyName: company?.name || 'Unknown',
            applicationCount: appCount,
            type: o.type
          };
        })
        .sort((a, b) => b.applicationCount - a.applicationCount)
        .slice(0, 5);

      // Recent applications (last 5)
      const recentApplications = (applicationsData || [])
        .sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime())
        .slice(0, 5)
        .map(app => {
          const student = students.find(s => s.id === app.student_id);
          const offer = (offersData || []).find(o => o.id === app.offer_id);
          return {
            studentName: student?.name || 'Unknown',
            offerTitle: offer?.title || 'Unknown',
            appliedAt: app.applied_at,
            status: app.status
          };
        });

      // Companies that have posted at least one offer
      const companiesWithOffers = [...new Set((offersData || []).map(o => o.company_id))].length;

      // Students who have applied to at least one offer
      const studentsWithApplications = studentsWhoApplied.length;

      // Offers this month vs last month
      const offersThisMonth = (offersData || []).filter(o => 
        new Date(o.created_at) >= oneMonthAgo
      ).length;

      const offersLastMonth = (offersData || []).filter(o => 
        new Date(o.created_at) >= twoMonthsAgo && new Date(o.created_at) < oneMonthAgo
      ).length;

      setAnalytics({
        totalStudents: students.length,
        totalCompanies: companies.length,
        totalOffers: (offersData || []).length,
        totalApplications: (applicationsData || []).length,
        totalProjects: (projectsData || []).length,
        pendingOffers: pending.length,
        approvedOffers: approved.length,
        rejectedOffers: rejected.length,
        pendingApplications: pendingApps.length,
        acceptedApplications: acceptedApps.length,
        rejectedApplications: rejectedApps.length,
        recentUsers,
        offersByType: { job: jobOffers, pfe: pfeOffers, stage: stageOffers },
        applicationsThisWeek: appsThisWeek,
        applicationsLastWeek: appsLastWeek,
        // New metrics
        studentsWithProfiles,
        profileCompletionRate,
        avgApplicationsPerOffer,
        avgApplicationsPerStudent,
        acceptanceRate,
        topCompanies,
        topOffers,
        recentApplications,
        companiesWithOffers,
        studentsWithApplications,
        offersThisMonth,
        offersLastMonth,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [users, offers, applications]);

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
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'offers', label: 'Job Offers', icon: Briefcase, badge: pendingOffersList.length },
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
              {/* Main Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="blueprint-card p-6 glow-hover">
                  <div className="flex items-start justify-between mb-4">
                    <GraduationCap className="w-8 h-8 text-primary" />
                  </div>
                  <div className="font-heading text-3xl text-foreground mb-1">
                    {loadingAnalytics ? '...' : analytics?.totalStudents || 0}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground tracking-widest">
                    REGISTERED STUDENTS
                  </div>
                </div>

                <div className="blueprint-card p-6 glow-hover">
                  <div className="flex items-start justify-between mb-4">
                    <Building2 className="w-8 h-8 text-accent" />
                  </div>
                  <div className="font-heading text-3xl text-foreground mb-1">
                    {loadingAnalytics ? '...' : analytics?.totalCompanies || 0}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground tracking-widest">
                    PARTNER COMPANIES
                  </div>
                </div>

                <div className="blueprint-card p-6 glow-hover">
                  <div className="flex items-start justify-between mb-4">
                    <Briefcase className="w-8 h-8 text-green-500" />
                  </div>
                  <div className="font-heading text-3xl text-foreground mb-1">
                    {loadingAnalytics ? '...' : analytics?.totalOffers || 0}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground tracking-widest">
                    TOTAL JOB OFFERS
                  </div>
                </div>

                <div className="blueprint-card p-6 glow-hover">
                  <div className="flex items-start justify-between mb-4">
                    <Send className="w-8 h-8 text-purple-500" />
                    {analytics && analytics.applicationsThisWeek > analytics.applicationsLastWeek && (
                      <span className="font-mono text-xs text-green-500">
                        +{analytics.applicationsThisWeek - analytics.applicationsLastWeek} this week
                      </span>
                    )}
                  </div>
                  <div className="font-heading text-3xl text-foreground mb-1">
                    {loadingAnalytics ? '...' : analytics?.totalApplications || 0}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground tracking-widest">
                    TOTAL APPLICATIONS
                  </div>
                </div>
              </div>

              {/* Pending Offers Alert */}
              {pendingOffersList.length > 0 && (
                <div 
                  onClick={() => setActiveTab('offers')}
                  className="blueprint-card p-6 mb-8 border-yellow-500/40 cursor-pointer hover:border-yellow-500/60 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Clock className="w-8 h-8 text-yellow-500" />
                    <div>
                      <div className="font-heading text-xl text-yellow-500">
                        {pendingOffersList.length} PENDING OFFER{pendingOffersList.length > 1 ? 'S' : ''} NEED REVIEW
                      </div>
                      <div className="font-mono text-sm text-muted-foreground">
                        Click to review and approve/reject offers
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Registrations */}
              <div className="blueprint-card p-6 mb-8">
                <h3 className="font-heading text-lg text-primary mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  RECENT REGISTRATIONS
                </h3>
                {loadingAnalytics ? (
                  <div className="text-center py-4 text-muted-foreground font-mono text-sm">Loading...</div>
                ) : analytics?.recentUsers.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground font-mono text-sm">No users yet</div>
                ) : (
                  <div className="space-y-2">
                    {analytics?.recentUsers.map((user, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 border-b border-primary/10 last:border-0">
                        <div>
                          <div className="font-heading text-sm text-foreground">{user.name}</div>
                          <div className="font-mono text-xs text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <span className={`font-mono text-xs px-2 py-1 ${
                          user.role === 'admin' ? 'bg-red-500/20 text-red-500' :
                          user.role === 'company' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'
                        }`}>
                          {user.role.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <button 
                  onClick={() => setActiveTab('analytics')}
                  className="blueprint-card p-6 glow-hover text-left hover:border-accent/60 transition-colors"
                >
                  <BarChart3 className="w-6 h-6 text-accent mb-3" />
                  <div className="font-heading text-lg text-foreground mb-1">VIEW ANALYTICS</div>
                  <div className="font-mono text-xs text-muted-foreground">Detailed metrics & insights</div>
                </button>
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

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <>
              {/* Key Performance Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="blueprint-card p-4 glow-hover">
                  <div className="flex items-center gap-3 mb-2">
                    <Percent className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="font-heading text-2xl text-foreground">
                    {loadingAnalytics ? '...' : `${analytics?.acceptanceRate || 0}%`}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground tracking-widest">
                    ACCEPTANCE RATE
                  </div>
                </div>

                <div className="blueprint-card p-4 glow-hover">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div className="font-heading text-2xl text-foreground">
                    {loadingAnalytics ? '...' : analytics?.avgApplicationsPerOffer || 0}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground tracking-widest">
                    AVG APPS / OFFER
                  </div>
                </div>

                <div className="blueprint-card p-4 glow-hover">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-6 h-6 text-accent" />
                  </div>
                  <div className="font-heading text-2xl text-foreground">
                    {loadingAnalytics ? '...' : analytics?.avgApplicationsPerStudent || 0}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground tracking-widest">
                    AVG APPS / STUDENT
                  </div>
                </div>

                <div className="blueprint-card p-4 glow-hover">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-6 h-6 text-purple-500" />
                  </div>
                  <div className="font-heading text-2xl text-foreground">
                    {loadingAnalytics ? '...' : `${analytics?.profileCompletionRate || 0}%`}
                  </div>
                  <div className="font-mono text-xs text-muted-foreground tracking-widest">
                    PROFILE COMPLETION
                  </div>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="blueprint-card p-4">
                  <div className="font-mono text-xs text-muted-foreground mb-1">COMPANIES WITH OFFERS</div>
                  <div className="font-heading text-2xl text-accent">
                    {loadingAnalytics ? '...' : analytics?.companiesWithOffers || 0}
                    <span className="text-sm text-muted-foreground ml-2">
                      / {analytics?.totalCompanies || 0}
                    </span>
                  </div>
                </div>

                <div className="blueprint-card p-4">
                  <div className="font-mono text-xs text-muted-foreground mb-1">STUDENTS WHO APPLIED</div>
                  <div className="font-heading text-2xl text-primary">
                    {loadingAnalytics ? '...' : analytics?.studentsWithApplications || 0}
                    <span className="text-sm text-muted-foreground ml-2">
                      / {analytics?.totalStudents || 0}
                    </span>
                  </div>
                </div>

                <div className="blueprint-card p-4">
                  <div className="font-mono text-xs text-muted-foreground mb-1">OFFERS THIS MONTH</div>
                  <div className="font-heading text-2xl text-foreground">
                    {loadingAnalytics ? '...' : analytics?.offersThisMonth || 0}
                    {analytics && analytics.offersThisMonth > analytics.offersLastMonth && (
                      <span className="text-green-500 text-sm ml-2">↑</span>
                    )}
                    {analytics && analytics.offersThisMonth < analytics.offersLastMonth && (
                      <span className="text-red-500 text-sm ml-2">↓</span>
                    )}
                  </div>
                </div>

                <div className="blueprint-card p-4">
                  <div className="font-mono text-xs text-muted-foreground mb-1">STUDENT PROJECTS</div>
                  <div className="font-heading text-2xl text-purple-500">
                    {loadingAnalytics ? '...' : analytics?.totalProjects || 0}
                  </div>
                </div>
              </div>

              {/* Offers & Applications Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Offers by Status */}
                <div className="blueprint-card p-6">
                  <h3 className="font-heading text-lg text-primary mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    OFFERS BY STATUS
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        <span className="font-mono text-sm text-yellow-500">PENDING</span>
                      </div>
                      <span className="font-heading text-xl text-yellow-500">
                        {loadingAnalytics ? '...' : analytics?.pendingOffers || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="font-mono text-sm text-green-500">APPROVED</span>
                      </div>
                      <span className="font-heading text-xl text-green-500">
                        {loadingAnalytics ? '...' : analytics?.approvedOffers || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <span className="font-mono text-sm text-red-500">REJECTED</span>
                      </div>
                      <span className="font-heading text-xl text-red-500">
                        {loadingAnalytics ? '...' : analytics?.rejectedOffers || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Offers by Type */}
                <div className="blueprint-card p-6">
                  <h3 className="font-heading text-lg text-accent mb-4 flex items-center gap-2">
                    <FileCheck className="w-5 h-5" />
                    OFFERS BY TYPE
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-primary/20">
                      <span className="font-mono text-sm text-foreground">STAGE (Internship)</span>
                      <span className="font-heading text-xl text-primary">
                        {loadingAnalytics ? '...' : analytics?.offersByType.stage || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-primary/20">
                      <span className="font-mono text-sm text-foreground">PFE (End of Study)</span>
                      <span className="font-heading text-xl text-primary">
                        {loadingAnalytics ? '...' : analytics?.offersByType.pfe || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-primary/20">
                      <span className="font-mono text-sm text-foreground">JOB (Full-time)</span>
                      <span className="font-heading text-xl text-primary">
                        {loadingAnalytics ? '...' : analytics?.offersByType.job || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Applications Status */}
              <div className="blueprint-card p-6 mb-8">
                <h3 className="font-heading text-lg text-purple-500 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  APPLICATION STATUS
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30">
                    <span className="font-mono text-sm text-yellow-500">PENDING REVIEW</span>
                    <span className="font-heading text-xl text-yellow-500">
                      {loadingAnalytics ? '...' : analytics?.pendingApplications || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30">
                    <span className="font-mono text-sm text-green-500">ACCEPTED</span>
                    <span className="font-heading text-xl text-green-500">
                      {loadingAnalytics ? '...' : analytics?.acceptedApplications || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30">
                    <span className="font-mono text-sm text-red-500">REJECTED</span>
                    <span className="font-heading text-xl text-red-500">
                      {loadingAnalytics ? '...' : analytics?.rejectedApplications || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Performers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Top Companies */}
                <div className="blueprint-card p-6">
                  <h3 className="font-heading text-lg text-accent mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    TOP COMPANIES BY ENGAGEMENT
                  </h3>
                  {loadingAnalytics ? (
                    <div className="text-center py-4 text-muted-foreground font-mono text-sm">Loading...</div>
                  ) : analytics?.topCompanies.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground font-mono text-sm">No data yet</div>
                  ) : (
                    <div className="space-y-2">
                      {analytics?.topCompanies.map((company, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 border-b border-primary/10 last:border-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-accent w-5">#{idx + 1}</span>
                            <span className="font-heading text-sm text-foreground">{company.name}</span>
                          </div>
                          <div className="flex items-center gap-4 font-mono text-xs">
                            <span className="text-muted-foreground">
                              <span className="text-primary">{company.offerCount}</span> offers
                            </span>
                            <span className="text-muted-foreground">
                              <span className="text-green-500">{company.applicationCount}</span> apps
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Top Offers */}
                <div className="blueprint-card p-6">
                  <h3 className="font-heading text-lg text-green-500 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    MOST POPULAR OFFERS
                  </h3>
                  {loadingAnalytics ? (
                    <div className="text-center py-4 text-muted-foreground font-mono text-sm">Loading...</div>
                  ) : analytics?.topOffers.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground font-mono text-sm">No data yet</div>
                  ) : (
                    <div className="space-y-2">
                      {analytics?.topOffers.map((offer, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 border-b border-primary/10 last:border-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-green-500 w-5">#{idx + 1}</span>
                              <span className="font-heading text-sm text-foreground truncate">{offer.title}</span>
                              <span className={`font-mono text-[10px] px-1 py-0.5 ${
                                offer.type === 'job' ? 'bg-accent/20 text-accent' :
                                offer.type === 'pfe' ? 'bg-primary/20 text-primary' : 'bg-purple-500/20 text-purple-400'
                              }`}>
                                {offer.type.toUpperCase()}
                              </span>
                            </div>
                            <div className="font-mono text-xs text-muted-foreground ml-7">{offer.companyName}</div>
                          </div>
                          <span className="font-heading text-lg text-green-500 ml-2">{offer.applicationCount}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Applications Feed */}
              <div className="blueprint-card p-6">
                <h3 className="font-heading text-lg text-purple-500 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  RECENT APPLICATIONS
                </h3>
                {loadingAnalytics ? (
                  <div className="text-center py-4 text-muted-foreground font-mono text-sm">Loading...</div>
                ) : analytics?.recentApplications.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground font-mono text-sm">No applications yet</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-primary/20">
                          <th className="font-mono text-xs text-muted-foreground text-left py-2 px-2">STUDENT</th>
                          <th className="font-mono text-xs text-muted-foreground text-left py-2 px-2">OFFER</th>
                          <th className="font-mono text-xs text-muted-foreground text-left py-2 px-2">DATE</th>
                          <th className="font-mono text-xs text-muted-foreground text-left py-2 px-2">STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics?.recentApplications.map((app, idx) => (
                          <tr key={idx} className="border-b border-primary/10 last:border-0">
                            <td className="py-2 px-2">
                              <span className="font-heading text-sm text-foreground">{app.studentName}</span>
                            </td>
                            <td className="py-2 px-2">
                              <span className="font-mono text-sm text-primary">{app.offerTitle}</span>
                            </td>
                            <td className="py-2 px-2">
                              <span className="font-mono text-xs text-muted-foreground">
                                {new Date(app.appliedAt).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="py-2 px-2">
                              <span className={`font-mono text-xs px-2 py-1 ${
                                app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                app.status === 'accepted' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                              }`}>
                                {app.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
                  <div className="font-heading text-3xl text-foreground">{pendingOffersList.length}</div>
                  <div className="font-mono text-xs text-muted-foreground">PENDING REVIEW</div>
                </div>
                <div className="blueprint-card p-6 border-green-500/40">
                  <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                  <div className="font-heading text-3xl text-foreground">{approvedOffersList.length}</div>
                  <div className="font-mono text-xs text-muted-foreground">APPROVED</div>
                </div>
                <div className="blueprint-card p-6 border-red-500/40">
                  <XCircle className="w-8 h-8 text-red-500 mb-2" />
                  <div className="font-heading text-3xl text-foreground">{rejectedOffersList.length}</div>
                  <div className="font-mono text-xs text-muted-foreground">REJECTED</div>
                </div>
              </div>

              {/* Pending Offers */}
              <div>
                <h3 className="font-heading text-xl text-yellow-500 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  PENDING OFFERS
                </h3>
                {pendingOffersList.length === 0 ? (
                  <div className="blueprint-card p-8 text-center text-muted-foreground">
                    No pending offers to review.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingOffersList.map((offer) => (
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
                {approvedOffersList.length === 0 ? (
                  <div className="blueprint-card p-8 text-center text-muted-foreground">
                    No approved offers yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {approvedOffersList.map((offer) => {
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
              {rejectedOffersList.length > 0 && (
                <div>
                  <h3 className="font-heading text-xl text-red-500 mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    REJECTED OFFERS
                  </h3>
                  <div className="space-y-4">
                    {rejectedOffersList.map((offer) => (
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
