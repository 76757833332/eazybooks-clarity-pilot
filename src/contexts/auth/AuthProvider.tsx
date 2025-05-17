
import React, { ReactNode, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Profile, Business, UserRole, EmployeeRole } from '@/contexts/auth/types';
import { AuthContext } from './AuthContext';
import * as authService from '@/services/authService';
import { baseService } from '@/services/base/baseService';

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
    try {
      const profileData = await authService.fetchUserProfile(userId);
      
      if (profileData) {
        setProfile(profileData as Profile);

        // If user has a business, fetch it
        if (profileData.belongs_to_business_id) {
          fetchUserBusiness(profileData.belongs_to_business_id);
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to load user profile");
    }
  };

  // Fetch user business
  const fetchUserBusiness = async (businessId: string) => {
    try {
      const businessData = await authService.fetchUserBusiness(businessId);
      if (businessData) {
        // Ensure the tenant_id is set to the business_id for multi-tenancy
        const businessWithTenant = {
          ...businessData,
          tenant_id: businessData.id
        };
        setBusiness(businessWithTenant as Business);
      }
    } catch (error) {
      console.error("Error fetching business:", error);
      toast.error("Failed to load business data");
    }
  };

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
          setBusiness(null);
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
    return authService.signOut();
  };

  const updateProfile = async (updatedProfile: Partial<Profile>) => {
    if (!user) return;
    
    try {
      await authService.updateProfile(user.id, updatedProfile);
      // Update local state
      setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const updateBusiness = async (updatedBusiness: Partial<Business>) => {
    if (!user || !business) return;
    
    try {
      await authService.updateBusiness(business.id, updatedBusiness);
      // Update local state
      setBusiness(prev => prev ? { ...prev, ...updatedBusiness } : null);
      toast.success("Business updated successfully");
    } catch (error) {
      console.error("Error updating business:", error);
      toast.error("Failed to update business");
    }
  };

  const createBusiness = async (businessData: Partial<Business>) => {
    if (!user) return;
    
    try {
      const newBusiness = await authService.createBusiness(user.id, businessData);
      if (newBusiness) {
        // Add tenant_id to the business
        const businessWithTenant = {
          ...newBusiness,
          tenant_id: newBusiness.id
        };
        
        // Update local state
        setBusiness(businessWithTenant as Business);
        
        // After business creation, update user profile
        await fetchUserProfile(user.id);
        
        toast.success("Business created successfully");
      }
    } catch (error) {
      console.error("Error creating business:", error);
      toast.error("Failed to create business");
    }
  };

  const inviteUser = async (email: string, role: UserRole, employeeRole?: EmployeeRole) => {
    if (!user || !business) {
      toast.error('You need to create a business first');
      return;
    }
    
    try {
      await authService.inviteUser(user.id, business.id, email, role, employeeRole);
      toast.success(`Invitation sent to ${email}`);
    } catch (error) {
      console.error("Error inviting user:", error);
      toast.error("Failed to send invitation");
    }
  };

  // Multi-tenant methods
  const getCurrentTenantId = () => {
    // For business owners and employees, the tenant ID is the business ID
    return business?.id || profile?.belongs_to_business_id;
  };

  const switchTenant = async (tenantId: string) => {
    if (!user) return;
    
    try {
      // Update the user's belongs_to_business_id in their profile
      await authService.updateProfile(user.id, {
        belongs_to_business_id: tenantId
      });
      
      // Fetch the new business
      await fetchUserBusiness(tenantId);
      
      toast.success('Switched to different business successfully');
    } catch (error) {
      console.error('Failed to switch tenant:', error);
      toast.error('Failed to switch business');
    }
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
    getCurrentTenantId,
    switchTenant
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
