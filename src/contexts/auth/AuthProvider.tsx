
import React, { ReactNode, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, EmployeeRole } from '@/contexts/auth/types';
import { AuthContext } from './AuthContext';
import * as authService from '@/services/authService';
import { useProfileData } from './hooks/useProfileData';
import { inviteUser as inviteUserUtil, getCurrentTenantId } from './utils/authUtils';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Use our custom hooks
  const { 
    profile, 
    business, 
    setProfile,
    fetchUserProfile, 
    updateProfile: updateProfileData, 
    updateBusiness: updateBusinessData, 
    createBusiness: createBusinessData,
    switchTenant: switchTenantData
  } = useProfileData();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (event === 'SIGNED_IN' && currentSession?.user) {
          // Use setTimeout to prevent potential recursion issues with auth state changes
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
          navigate('/login');
        } else if (event === 'USER_UPDATED') {
          setUser(currentSession?.user ?? null);
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

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
    await authService.signOut();
  };

  // Wrapper functions that use the userId from the current user
  const updateProfile = async (updatedProfile: Partial<typeof profile>) => {
    if (!user) return;
    return updateProfileData(user.id, updatedProfile);
  };

  const updateBusiness = async (updatedBusiness: Partial<typeof business>) => {
    if (!user || !business) return;
    return updateBusinessData(business.id, updatedBusiness);
  };

  const createBusiness = async (businessData: Partial<typeof business>) => {
    if (!user) return;
    return createBusinessData(user.id, businessData);
  };

  const inviteUser = async (email: string, role: UserRole, employeeRole?: EmployeeRole) => {
    if (!user || !business) {
      toast.error('You need to create a business first');
      return;
    }
    return inviteUserUtil(user.id, business.id, email, role, employeeRole);
  };

  const switchTenant = async (tenantId: string) => {
    if (!user) return;
    return switchTenantData(user.id, tenantId);
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
    updateBusiness,
    createBusiness,
    inviteUser,
    getCurrentTenantId: () => getCurrentTenantId(business?.id, profile?.belongs_to_business_id),
    switchTenant
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
