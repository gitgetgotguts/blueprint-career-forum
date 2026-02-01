import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(username, password);
    setIsLoading(false);
    
    if (result.success) {
      onClose();
      setUsername('');
      setPassword('');
      // Navigate based on role
      switch (result.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'student':
          navigate('/student');
          break;
        case 'company':
          navigate('/company');
          break;
        default:
          navigate('/');
      }
    } else {
      setError('Invalid credentials');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative blueprint-card p-8 w-full max-w-md mx-4 animate-fade-in-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <span className="font-mono text-xs text-primary/60 tracking-widest block mb-2">
            ADMIN ACCESS
          </span>
          <h2 className="font-heading text-3xl text-foreground">LOGIN</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-mono text-xs text-muted-foreground tracking-widest block mb-2">
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border-2 border-primary/30 px-4 py-3 font-mono text-foreground focus:border-primary focus:outline-none transition-colors"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <div className="text-red-500 font-mono text-sm text-center border border-red-500/30 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full font-heading text-lg px-6 py-4 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300"
          >
            ACCESS DASHBOARD
          </button>
        </form>

        {/* Technical annotation */}
        <div className="mt-6 text-center font-mono text-xs text-primary/40 tracking-widest">
          SECURE CONNECTION • FEEE-11
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
