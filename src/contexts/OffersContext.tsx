import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Project } from './AuthContext';

export type OfferType = 'job' | 'pfe' | 'stage';
export type OfferStatus = 'pending' | 'approved' | 'rejected';

export interface Offer {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  type: OfferType;
  description: string;
  requirements: string;
  location: string;
  duration?: string;
  createdAt: string;
  status: OfferStatus;
  rejectionReason?: string;
}

export interface Application {
  id: string;
  offerId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  cvFileName: string;
  cvData: string;
  coverLetter: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  projects?: Project[];
}

interface OffersContextType {
  offers: Offer[];
  applications: Application[];
  loading: boolean;
  createOffer: (offer: Omit<Offer, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  approveOffer: (offerId: string) => Promise<void>;
  rejectOffer: (offerId: string, reason: string) => Promise<void>;
  applyToOffer: (application: Omit<Application, 'id' | 'appliedAt' | 'status'>) => Promise<boolean>;
  getOffersByCompany: (companyId: string) => Offer[];
  getApprovedOffers: () => Offer[];
  getPendingOffers: () => Offer[];
  getApplicationsByOffer: (offerId: string) => Application[];
  getApplicationsByStudent: (studentId: string) => Application[];
  updateApplicationStatus: (applicationId: string, status: Application['status']) => Promise<void>;
  refreshOffers: () => Promise<void>;
}

const OffersContext = createContext<OffersContextType | null>(null);

export const OffersProvider = ({ children }: { children: ReactNode }) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOffers = async () => {
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedOffers: Offer[] = (data || []).map(o => ({
        id: o.id,
        companyId: o.company_id,
        companyName: o.company_name,
        title: o.title,
        type: o.type as OfferType,
        description: o.description,
        requirements: o.requirements || '',
        location: o.location || '',
        duration: o.duration,
        createdAt: o.created_at,
        status: o.status as OfferStatus,
        rejectionReason: o.rejection_reason,
      }));

      setOffers(mappedOffers);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('applied_at', { ascending: false });

      if (error) throw error;

      // Fetch projects for each application that has project_ids
      const mappedApplications: Application[] = await Promise.all(
        (data || []).map(async (app) => {
          let projects: Project[] = [];
          
          if (app.project_ids && app.project_ids.length > 0) {
            const { data: projectData } = await supabase
              .from('projects')
              .select('*')
              .in('id', app.project_ids);

            projects = (projectData || []).map(p => ({
              id: p.id,
              title: p.title,
              description: p.description,
              imageUrl: p.image_url || '',
              link: p.link || '',
              createdAt: p.created_at,
            }));
          }

          return {
            id: app.id,
            offerId: app.offer_id,
            studentId: app.student_id,
            studentName: app.student_name,
            studentEmail: app.student_email,
            cvFileName: app.cv_filename || '',
            cvData: app.cv_url || '',
            coverLetter: app.cover_letter || '',
            appliedAt: app.applied_at,
            status: app.status as Application['status'],
            projects,
          };
        })
      );

      setApplications(mappedApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchApplications();
  }, []);

  const refreshOffers = async () => {
    await fetchOffers();
    await fetchApplications();
  };

  const createOffer = async (offerData: Omit<Offer, 'id' | 'createdAt' | 'status'>) => {
    try {
      const { error } = await supabase
        .from('offers')
        .insert({
          company_id: offerData.companyId,
          company_name: offerData.companyName,
          title: offerData.title,
          type: offerData.type,
          description: offerData.description,
          requirements: offerData.requirements,
          location: offerData.location,
          duration: offerData.duration,
          status: 'pending',
        });

      if (error) throw error;
      await fetchOffers();
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const approveOffer = async (offerId: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status: 'approved' })
        .eq('id', offerId);

      if (error) throw error;
      await fetchOffers();
    } catch (error) {
      console.error('Error approving offer:', error);
    }
  };

  const rejectOffer = async (offerId: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status: 'rejected', rejection_reason: reason })
        .eq('id', offerId);

      if (error) throw error;
      await fetchOffers();
    } catch (error) {
      console.error('Error rejecting offer:', error);
    }
  };

  const applyToOffer = async (applicationData: Omit<Application, 'id' | 'appliedAt' | 'status'>): Promise<boolean> => {
    try {
      // Check if already applied
      const { data: existing } = await supabase
        .from('applications')
        .select('id')
        .eq('offer_id', applicationData.offerId)
        .eq('student_id', applicationData.studentId)
        .single();

      if (existing) return false;

      const projectIds = applicationData.projects?.map(p => p.id) || [];

      const { error } = await supabase
        .from('applications')
        .insert({
          offer_id: applicationData.offerId,
          student_id: applicationData.studentId,
          student_name: applicationData.studentName,
          student_email: applicationData.studentEmail,
          cv_url: applicationData.cvData,
          cv_filename: applicationData.cvFileName,
          cover_letter: applicationData.coverLetter,
          status: 'pending',
          project_ids: projectIds,
        });

      if (error) throw error;
      await fetchApplications();
      return true;
    } catch (error) {
      console.error('Error applying to offer:', error);
      return false;
    }
  };

  const getOffersByCompany = (companyId: string) => {
    return offers.filter(offer => offer.companyId === companyId);
  };

  const getApprovedOffers = () => {
    return offers.filter(offer => offer.status === 'approved');
  };

  const getPendingOffers = () => {
    return offers.filter(offer => offer.status === 'pending');
  };

  const getApplicationsByOffer = (offerId: string) => {
    return applications.filter(app => app.offerId === offerId);
  };

  const getApplicationsByStudent = (studentId: string) => {
    return applications.filter(app => app.studentId === studentId);
  };

  const updateApplicationStatus = async (applicationId: string, status: Application['status']) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) throw error;
      await fetchApplications();
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  return (
    <OffersContext.Provider value={{
      offers,
      applications,
      loading,
      createOffer,
      approveOffer,
      rejectOffer,
      applyToOffer,
      getOffersByCompany,
      getApprovedOffers,
      getPendingOffers,
      getApplicationsByOffer,
      getApplicationsByStudent,
      updateApplicationStatus,
      refreshOffers,
    }}>
      {children}
    </OffersContext.Provider>
  );
};

export const useOffers = () => {
  const context = useContext(OffersContext);
  if (!context) {
    throw new Error('useOffers must be used within an OffersProvider');
  }
  return context;
};
