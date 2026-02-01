import { createContext, useContext, useState, ReactNode } from 'react';
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
  cvData: string; // Base64 encoded
  coverLetter: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  projects?: Project[]; // Student's portfolio projects
}

interface OffersContextType {
  offers: Offer[];
  applications: Application[];
  createOffer: (offer: Omit<Offer, 'id' | 'createdAt' | 'status'>) => void;
  approveOffer: (offerId: string) => void;
  rejectOffer: (offerId: string, reason: string) => void;
  applyToOffer: (application: Omit<Application, 'id' | 'appliedAt' | 'status'>) => boolean;
  getOffersByCompany: (companyId: string) => Offer[];
  getApprovedOffers: () => Offer[];
  getPendingOffers: () => Offer[];
  getApplicationsByOffer: (offerId: string) => Application[];
  getApplicationsByStudent: (studentId: string) => Application[];
  updateApplicationStatus: (applicationId: string, status: Application['status']) => void;
}

const OffersContext = createContext<OffersContextType | null>(null);

export const OffersProvider = ({ children }: { children: ReactNode }) => {
  const [offers, setOffers] = useState<Offer[]>(() => {
    const stored = localStorage.getItem('feee-offers');
    return stored ? JSON.parse(stored) : [];
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const stored = localStorage.getItem('feee-applications');
    return stored ? JSON.parse(stored) : [];
  });

  const saveOffers = (newOffers: Offer[]) => {
    setOffers(newOffers);
    localStorage.setItem('feee-offers', JSON.stringify(newOffers));
  };

  const saveApplications = (newApplications: Application[]) => {
    setApplications(newApplications);
    localStorage.setItem('feee-applications', JSON.stringify(newApplications));
  };

  const createOffer = (offerData: Omit<Offer, 'id' | 'createdAt' | 'status'>) => {
    const newOffer: Offer = {
      ...offerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    saveOffers([...offers, newOffer]);
  };

  const approveOffer = (offerId: string) => {
    const updatedOffers = offers.map(offer =>
      offer.id === offerId ? { ...offer, status: 'approved' as OfferStatus } : offer
    );
    saveOffers(updatedOffers);
  };

  const rejectOffer = (offerId: string, reason: string) => {
    const updatedOffers = offers.map(offer =>
      offer.id === offerId ? { ...offer, status: 'rejected' as OfferStatus, rejectionReason: reason } : offer
    );
    saveOffers(updatedOffers);
  };

  const applyToOffer = (applicationData: Omit<Application, 'id' | 'appliedAt' | 'status'>): boolean => {
    // Check if student already applied
    const alreadyApplied = applications.some(
      app => app.offerId === applicationData.offerId && app.studentId === applicationData.studentId
    );
    if (alreadyApplied) return false;

    const newApplication: Application = {
      ...applicationData,
      id: Date.now().toString(),
      appliedAt: new Date().toISOString(),
      status: 'pending',
    };
    saveApplications([...applications, newApplication]);
    return true;
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

  const updateApplicationStatus = (applicationId: string, status: Application['status']) => {
    const updatedApplications = applications.map(app =>
      app.id === applicationId ? { ...app, status } : app
    );
    saveApplications(updatedApplications);
  };

  return (
    <OffersContext.Provider value={{
      offers,
      applications,
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
