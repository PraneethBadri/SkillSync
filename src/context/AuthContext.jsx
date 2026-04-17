import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null means not logged in
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [initialModalMode, setInitialModalMode] = useState(true); // true = login
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [extractedSkills, setExtractedSkills] = useState([]);
  
  // V2 AI Enhancements
  const [userPreferences, setUserPreferences] = useState({ experience: 'Mid-Level', environment: 'Remote' });
  const [interactedSkillsBank, setInteractedSkillsBank] = useState([]); // Array of strings mapping behavioral clicks

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) fetchUserProfile(session.user);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchUserProfile(session.user);
      } else {
        setUser(null);
        setAppliedJobs([]);
        setExtractedSkills([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser) => {
    // Attempt to fetch profile from public.users table (if it exists)
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', authUser.id).single();
      if (data) {
        setUser({ ...authUser, ...data });
      } else {
        setUser({ email: authUser.email, name: authUser.email.split('@')[0], role: 'seeker' });
      }
    } catch {
      setUser({ email: authUser.email, name: authUser.email.split('@')[0], role: 'seeker' });
    }
  };

  const login = async (email, password, role, isSignUp = false, fullName = '') => {
    try {
      if (isSignUp) {
        // Sign up logic
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.user) throw new Error("Supabase keys not configured or unidentifiable error.");
        
        // Write their selected role (seeker vs recruiter) into the public database
        const { error: dbError } = await supabase.from('users').insert([{
          id: data.user.id,
          email: email,
          name: fullName || email.split('@')[0],
          role: role
        }]);
        
        if (dbError) {
          // If database write fails, we actually need to throw so user knows their profile isn't saved!
          console.error("Supabase Users Table Write Failed:", dbError);
          throw new Error("Account generated, but database write blocked: " + dbError.message);
        }
        
        // Optimistically set the user session manually since session trigger might lag
        setUser({ id: data.user.id, email, name: fullName || email.split('@')[0], role });
      } else {
        // Log in logic
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (error) {
      console.warn("Supabase Auth Error:", error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAppliedJobs([]);
    setExtractedSkills([]);
    setInteractedSkillsBank([]);
  };

  const applyToJob = (job) => {
    if (!user) {
      openModal();
      return;
    }
    setAppliedJobs(prev => [...prev, job.id]);
    if (job.skillsRequired && job.skillsRequired.length > 0) {
      setInteractedSkillsBank(prev => [...prev, ...job.skillsRequired]);
    }
  };

  const openModal = (isLoginView = true) => {
    setInitialModalMode(isLoginView);
    setIsAuthModalOpen(true);
  };
  const closeModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider value={{ 
        user, login, logout, isAuthModalOpen, initialModalMode, 
        openModal, closeModal, appliedJobs, applyToJob,
        extractedSkills, setExtractedSkills,
        userPreferences, setUserPreferences, interactedSkillsBank
      }}>
      {children}
    </AuthContext.Provider>
  );
};
