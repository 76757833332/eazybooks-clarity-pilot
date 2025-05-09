
import React, { ReactNode, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Profile, Business, UserRole, EmployeeRole } from '@/types/auth';
import { AuthContext } from './AuthContext';
import * as authService from '@/services/authService';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    const profileData = await authService.fetchUserProfile(userId);
    
    if (profileData) {
      setProfile(profileData as Profile);

      // If user has a business, fetch it
      if (profileData.belongs_to_business_id) {
        fetchUserBusiness(profileData.belongs_to_business_id);
      }

      // Check if onboarding is not completed
      if (!profileData.onboarding_completed) {
        // Redirect to onboarding flow
        navigate('/onboarding');
      }
    }
  };

  // Fetch user business
  const fetchUserBusiness = async (businessId: string) => {
    const businessData = await authService.fetchUserBusiness(businessId);
    if (businessData) {
      setBusiness(businessData as Business);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN' && currentSession?.user) {
          fetchUserProfile(currentSession.user.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          setBusiness(null);
          navigate('/login');
        } else if (event === 'USER_UPDATED') {
          setUser(currentSession?.user ?? null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signUp = async (email: string, password: string, firstName: string, lastName: string, role: UserRole) => {
    return authService.signUp(email, password, firstName, lastName, role);
  };

  const signIn = async (email: string, password: string) => {
    return authService.signIn(email, password);
  };

  const signInWithGoogle = async () => {
    return authService.signInWithGoogle();
  };

  const signOut = async () => {
    return authService.signOut();
  };

  const updateProfile = async (updatedProfile: Partial<Profile>) => {
    if (!user) return;
    
    await authService.updateProfile(user.id, updatedProfile);
    // Update local state
    setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
  };

  const updateOnboardingStep = async (step: number) => {
    if (!user) return;
    
    await authService.updateOnboardingStep(user.id, step);
    // Update local state
    setProfile(prev => prev ? { ...prev, onboarding_step: step } : null);
  };

  const completeOnboarding = async () => {
    if (!user) return;
    
    await authService.completeOnboarding(user.id);
    // Update local state
    setProfile(prev => prev ? { ...prev, onboarding_completed: true } : null);
  };

  const createBusiness = async (businessData: Partial<Business>) => {
    if (!user) return;
    
    const newBusiness = await authService.createBusiness(user.id, businessData);
    if (newBusiness) {
      // Update local state
      setBusiness(newBusiness as Business);
      
      // After business creation, update user profile
      await fetchUserProfile(user.id);
    }
  };

  const inviteUser = async (email: string, role: UserRole, employeeRole?: EmployeeRole) => {
    if (!user || !business) {
      toast.error('You need to create a business first');
      return;
    }
    
    await authService.inviteUser(user.id, business.id, email, role, employeeRole);
  };

  const value = {
    user,
    session,
    profile,
    business,
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    updateProfile,
    updateOnboardingStep,
    completeOnboarding,
    createBusiness,
    inviteUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
