import { createContext, useContext, useState, ReactNode } from 'react';

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
  login: (username: string, password: string) => { success: boolean; role?: UserRole };
  logout: () => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => boolean;
  deleteUser: (id: string) => void;
  getUsers: () => User[];
  getUserById: (id: string) => User | undefined;
  updateStudentProfile: (userId: string, profile: StudentProfile) => void;
  addProject: (userId: string, project: Omit<Project, 'id' | 'createdAt'>) => void;
  removeProject: (userId: string, projectId: string) => void;
  updateProject: (userId: string, projectId: string, project: Partial<Omit<Project, 'id' | 'createdAt'>>) => void;
}

const defaultUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin',
    role: 'admin',
    name: 'Administrator',
    email: 'admin@feee.tn',
    createdAt: '2024-01-01',
  },
];

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem('feee-users');
    return stored ? JSON.parse(stored) : defaultUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('feee-current-user');
    return stored ? JSON.parse(stored) : null;
  });

  const isAuthenticated = currentUser !== null;

  const login = (username: string, password: string): { success: boolean; role?: UserRole } => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('feee-current-user', JSON.stringify(user));
      return { success: true, role: user.role };
    }
    return { success: false };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('feee-current-user');
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>): boolean => {
    // Check if username already exists
    if (users.some(u => u.username === userData.username)) {
      return false;
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('feee-users', JSON.stringify(updatedUsers));
    return true;
  };

  const deleteUser = (id: string) => {
    // Prevent deleting the main admin
    if (id === '1') return;
    
    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('feee-users', JSON.stringify(updatedUsers));
  };

  const getUsers = () => users;

  const getUserById = (id: string) => users.find(u => u.id === id);

  const updateStudentProfile = (userId: string, profile: StudentProfile) => {
    const updatedUsers = users.map(u => {
      if (u.id === userId) {
        return { ...u, studentProfile: profile };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('feee-users', JSON.stringify(updatedUsers));
    
    // Update current user if it's the same
    if (currentUser?.id === userId) {
      const updatedUser = { ...currentUser, studentProfile: profile };
      setCurrentUser(updatedUser);
      localStorage.setItem('feee-current-user', JSON.stringify(updatedUser));
    }
  };

  const addProject = (userId: string, project: Omit<Project, 'id' | 'createdAt'>) => {
    const user = users.find(u => u.id === userId);
    if (!user || user.role !== 'student') return;

    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const currentProfile = user.studentProfile || { careerGoal: '', projects: [], isProfileComplete: false };
    const updatedProfile = {
      ...currentProfile,
      projects: [...currentProfile.projects, newProject],
    };

    updateStudentProfile(userId, updatedProfile);
  };

  const removeProject = (userId: string, projectId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user || !user.studentProfile) return;

    const updatedProfile = {
      ...user.studentProfile,
      projects: user.studentProfile.projects.filter(p => p.id !== projectId),
    };

    updateStudentProfile(userId, updatedProfile);
  };

  const updateProject = (userId: string, projectId: string, projectData: Partial<Omit<Project, 'id' | 'createdAt'>>) => {
    const user = users.find(u => u.id === userId);
    if (!user || !user.studentProfile) return;

    const updatedProfile = {
      ...user.studentProfile,
      projects: user.studentProfile.projects.map(p => 
        p.id === projectId ? { ...p, ...projectData } : p
      ),
    };

    updateStudentProfile(userId, updatedProfile);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      currentUser, 
      users,
      login, 
      logout, 
      addUser, 
      deleteUser,
      getUsers,
      getUserById,
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
