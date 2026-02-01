import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export type UserRole = 'admin' | 'student' | 'company';

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  createdAt: string;
}

export interface StudentProfile {
  careerGoal: string;
  projects: Project[];
  isProfileComplete: boolean;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  email: string;
  createdAt: string;
  studentProfile?: StudentProfile;
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  users: User[];
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; role?: UserRole }>;
  logout: () => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  deleteUser: (id: string) => Promise<void>;
  getUsers: () => User[];
  getUserById: (id: string) => User | undefined;
  refreshUsers: () => Promise<void>;
  updateStudentProfile: (userId: string, profile: StudentProfile) => Promise<void>;
  addProject: (userId: string, project: Omit<Project, 'id' | 'createdAt'>) => Promise<void>;
  removeProject: (userId: string, projectId: string) => Promise<void>;
  updateProject: (userId: string, projectId: string, project: Partial<Omit<Project, 'id' | 'createdAt'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('feee-current-user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  const isAuthenticated = currentUser !== null;

  // Fetch all users with their projects
  const fetchUsers = async () => {
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Fetch all projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*');

      if (projectsError) throw projectsError;

      // Map to User format
      const mappedUsers: User[] = (profiles || []).map(profile => {
        const userProjects = (projects || [])
          .filter(p => p.user_id === profile.id)
          .map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            imageUrl: p.image_url || '',
            link: p.link || '',
            createdAt: p.created_at,
          }));

        const studentProfile: StudentProfile | undefined = profile.role === 'student' ? {
          careerGoal: profile.career_goal || '',
          projects: userProjects,
          isProfileComplete: !!(profile.career_goal || userProjects.length > 0),
        } : undefined;

        return {
          id: profile.id,
          username: profile.username,
          password: profile.password,
          role: profile.role as UserRole,
          name: profile.name,
          email: profile.email,
          createdAt: profile.created_at,
          studentProfile,
        };
      });

      setUsers(mappedUsers);

      // Update current user if logged in
      if (currentUser) {
        const updatedCurrentUser = mappedUsers.find(u => u.id === currentUser.id);
        if (updatedCurrentUser) {
          setCurrentUser(updatedCurrentUser);
          localStorage.setItem('feee-current-user', JSON.stringify(updatedCurrentUser));
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const refreshUsers = async () => {
    await fetchUsers();
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; role?: UserRole }> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !data) {
        return { success: false };
      }

      // Fetch user's projects if student
      let studentProfile: StudentProfile | undefined;
      if (data.role === 'student') {
        const { data: projects } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', data.id);

        const userProjects = (projects || []).map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          imageUrl: p.image_url || '',
          link: p.link || '',
          createdAt: p.created_at,
        }));

        studentProfile = {
          careerGoal: data.career_goal || '',
          projects: userProjects,
          isProfileComplete: !!(data.career_goal || userProjects.length > 0),
        };
      }

      const user: User = {
        id: data.id,
        username: data.username,
        password: data.password,
        role: data.role as UserRole,
        name: data.name,
        email: data.email,
        createdAt: data.created_at,
        studentProfile,
      };

      setCurrentUser(user);
      localStorage.setItem('feee-current-user', JSON.stringify(user));
      await fetchUsers();
      return { success: true, role: user.role };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('feee-current-user');
  };

  const addUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          username: userData.username,
          password: userData.password,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          career_goal: null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding user:', error);
        return false;
      }

      await fetchUsers();
      return true;
    } catch (error) {
      console.error('Error adding user:', error);
      return false;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const getUsers = () => users;

  const getUserById = (id: string) => users.find(u => u.id === id);

  const updateStudentProfile = async (userId: string, profile: StudentProfile) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ career_goal: profile.careerGoal })
        .eq('id', userId);

      if (error) throw error;
      await fetchUsers();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const addProject = async (userId: string, project: Omit<Project, 'id' | 'createdAt'>) => {
    try {
      const { error } = await supabase
        .from('projects')
        .insert({
          user_id: userId,
          title: project.title,
          description: project.description,
          image_url: project.imageUrl || null,
          link: project.link || null,
        });

      if (error) throw error;
      await fetchUsers();
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const removeProject = async (userId: string, projectId: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      await fetchUsers();
    } catch (error) {
      console.error('Error removing project:', error);
    }
  };

  const updateProject = async (userId: string, projectId: string, projectData: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
    try {
      const updateData: Record<string, unknown> = {};
      if (projectData.title) updateData.title = projectData.title;
      if (projectData.description) updateData.description = projectData.description;
      if (projectData.imageUrl !== undefined) updateData.image_url = projectData.imageUrl;
      if (projectData.link !== undefined) updateData.link = projectData.link;

      const { error } = await supabase
        .from('projects')
        .update(updateData)
        .eq('id', projectId);

      if (error) throw error;
      await fetchUsers();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      currentUser, 
      users,
      loading,
      login, 
      logout, 
      addUser, 
      deleteUser,
      getUsers,
      getUserById,
      refreshUsers,
      updateStudentProfile,
      addProject,
      removeProject,
      updateProject
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
