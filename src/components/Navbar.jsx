import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, openModal, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleProtectedNavigation = (path, e) => {
    e.preventDefault();
    if (!user) {
      openModal(true);
    } else {
      navigate(path);
    }
  };
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl shadow-slate-900/5 dark:shadow-none">
    <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
    <Link to="/" className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter font-headline block">SkillSync</Link>
    <div className="hidden md:flex items-center space-x-8">
      <a href="/#search-jobs" className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 dark:hover:text-blue-300 transition-colors font-label uppercase tracking-wider text-xs">Find Jobs</a>
      <a href="/#how-it-works" className="text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 dark:hover:text-blue-300 transition-colors font-label uppercase tracking-wider text-xs">How it Works</a>
      <button 
        onClick={(e) => handleProtectedNavigation('/dashboard', e)} 
        className={`font-bold border-b-2 transition-colors font-label uppercase tracking-wider text-xs ${location.pathname === '/dashboard' ? 'text-blue-700 dark:text-blue-400 border-blue-700' : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-blue-600 dark:hover:text-blue-300 hover:border-blue-700'}`}>
        Dashboard
      </button>
      {user?.role === 'recruiter' ? null : (
        <button 
          onClick={(e) => {
            if (!user) {
              e.preventDefault();
              openModal(false); // Open straight to signup mode
            } else {
              navigate('/resume-upload');
            }
          }} 
          className={`flex items-center gap-1 font-bold transition-colors font-label uppercase tracking-wider text-xs ${location.pathname === '/resume-upload' ? 'text-blue-700 dark:text-blue-400 border-b-2 border-blue-700' : 'text-slate-600 dark:text-slate-400 border-b-2 border-transparent hover:text-blue-600 dark:hover:text-blue-300 hover:border-blue-700'}`}
        >
           <span className="material-symbols-outlined text-[16px]">upload_file</span>
           Upload Resume
        </button>
      )}
    </div>
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary font-bold text-xs">{user.name.charAt(0)}</div>
            <span className="text-sm font-bold">{user.name}</span>
          </div>
          <div className="relative">
            <button onClick={() => setShowLogoutConfirm(!showLogoutConfirm)} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-surface-container transition-all text-xs font-bold tracking-wider relative z-20">LOG OUT</button>
            {showLogoutConfirm && (
              <div className="absolute right-0 top-12 w-64 bg-surface-container-lowest rounded-xl shadow-2xl p-4 border border-outline-variant/30 z-[100] animate-fade-in">
                <div className="flex items-center gap-2 mb-3 text-error">
                   <span className="material-symbols-outlined text-sm">logout</span>
                   <p className="font-bold text-sm">Confirm Logout</p>
                </div>
                <p className="text-xs text-on-surface-variant font-medium mb-4">Are you sure you want to end your session?</p>
                <div className="flex gap-2">
                   <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-xs font-bold">Cancel</button>
                   <button onClick={() => { setShowLogoutConfirm(false); logout(); }} className="flex-1 py-2 rounded-lg bg-error text-white shadow-md shadow-error/20 hover:scale-[0.98] transition-transform text-xs font-bold">Yes, Log Out</button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <button onClick={() => openModal(true)} className="px-6 py-2 rounded-xl font-medium text-slate-600 hover:text-blue-700 transition-all active:scale-95 text-xs font-label uppercase tracking-wider">Login</button>
          <button onClick={() => openModal(false)} className="px-6 py-2 rounded-xl bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all text-xs font-label uppercase tracking-wider inline-block">Sign Up</button>
        </>
      )}
    </div>
    </div>
    </nav>
  );
}
