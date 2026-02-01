import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check .env.local file.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Database types
export interface DbProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  role: 'admin' | 'student' | 'company';
  career_goal: string | null;
  created_at: string;
}

export interface DbProject {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url: string | null;
  link: string | null;
  created_at: string;
}

export interface DbOffer {
  id: string;
  company_id: string;
  company_name: string;
  title: string;
  type: 'job' | 'pfe' | 'stage';
  description: string;
  requirements: string | null;
  location: string | null;
  duration: string | null;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  created_at: string;
}

export interface DbApplication {
  id: string;
  offer_id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  cv_url: string | null;
  cv_filename: string | null;
  cover_letter: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  applied_at: string;
  project_ids: string[] | null;
}
