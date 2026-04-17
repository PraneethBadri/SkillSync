import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal() {
  const { isAuthModalOpen, closeModal, login, initialModalMode } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('seeker'); // 'seeker' or 'recruiter'
  const [errorMsg, setErrorMsg] = useState('');
  
  // Controlled inputs to prevent persistence
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Reset modal state every time it opens
  React.useEffect(() => {
    if (isAuthModalOpen) {
      setIsLogin(initialModalMode);
      setErrorMsg('');
      setEmail('');
      setPassword('');
      setFullName('');
      setRole('seeker');
    }
  }, [isAuthModalOpen, initialModalMode]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const result = await login(email, password, role, !isLogin, fullName);
    if (result && !result.success) {
      setErrorMsg(result.error);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrorMsg(''); // Clear error when switching modes
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-8 relative shadow-2xl animate-fade-in border-none">
        <button onClick={closeModal} className="absolute top-4 right-4 p-2 text-outline hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black font-headline tracking-tight">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-on-surface-variant text-sm mt-1">{isLogin ? 'Login to access your dashboard' : 'Join SkillSync to find your perfect match'}</p>
        </div>

        {/* Role Toggle for Signup - Removed recruiter option as requested */}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Full Name</label>
              <input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/40 text-sm" placeholder="Alex Rivera" />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Email</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/40 text-sm" placeholder="alex@example.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Password</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/40 text-sm" placeholder="••••••••" />
          </div>
          
          {errorMsg && (
            <div className="bg-error/10 text-error text-sm font-bold p-3 rounded-lg flex items-center gap-2">
               <span className="material-symbols-outlined text-sm">warning</span>
               {errorMsg}
            </div>
          )}

          <button type="submit" className="w-full py-4 text-white font-bold rounded-xl mt-4 transition-all hover:opacity-90 bg-primary shadow-lg shadow-primary/20">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-on-surface-variant">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={toggleMode} className="font-bold text-primary hover:underline">
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}
