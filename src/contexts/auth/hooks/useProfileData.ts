
import { useState } from 'react';
import { Profile, Business } from '@/contexts/auth/types';
import * as authService from '@/services/authService';
import { toast } from 'sonner';

export const useProfileData = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [businessLoading, setBusinessLoading] = useState<boolean>(false);

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      setProfileLoading(true);
      const profileData = await authService.fetchUserProfile(userId);
      
      if (profileData) {
        setProfile(profileData);

        // If user has a business, fetch it
        if (profileData.belongs_to_business_id) {
          fetchUserBusiness(profileData.belongs_to_business_id);
        } else {
          // No business to fetch, make sure to update loading state
          setBusiness(null);
        }
      } else {
        console.warn('No profile found for user ID:', userId);
        // For new users, we might want to create a profile automatically
        const userData = await supabase.auth.getUser();
        if (userData.data.user) {
          const { email, user_metadata } = userData.data.user;
          
          // Create a basic profile for the user
          await authService.updateProfile(userId, {
            id: userId,
            email: email || '',
            first_name: user_metadata?.first_name || '',
            last_name: user_metadata?.last_name || '',
            role: user_metadata?.role || 'business_owner',
            subscription_tier: 'free'
          });
          
          // Fetch the newly created profile
          const newProfile = await authService.fetchUserProfile(userId);
          setProfile(newProfile);
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // Don't show toast for initial load as it could be a new user without profile
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch user business
  const fetchUserBusiness = async (businessId: string) => {
    try {
      setBusinessLoading(true);
      const businessData = await authService.fetchUserBusiness(businessId);
      if (businessData) {
        // Ensure the tenant_id is set to the business_id for multi-tenancy
        const businessWithTenant = {
          ...businessData,
          tenant_id: businessData.id
        } as Business;
        setBusiness(businessWithTenant);
      } else {
        console.warn('No business found for business ID:', businessId);
        setBusiness(null);
      }
    } catch (error) {
      console.error("Error fetching business:", error);
      setBusiness(null);
    } finally {
      setBusinessLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (userId: string, updatedProfile: Partial<Profile>) => {
    try {
      await authService.updateProfile(userId, updatedProfile);
      // Update local state
      setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
      toast.success("Profile updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      return false;
    }
  };

  // Update business
  const updateBusiness = async (businessId: string, updatedBusiness: Partial<Business>) => {
    try {
      await authService.updateBusiness(businessId, updatedBusiness);
      // Update local state
      setBusiness(prev => prev ? { ...prev, ...updatedBusiness } : null);
      toast.success("Business updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating business:", error);
      toast.error("Failed to update business");
      return false;
    }
  };

  // Create business
  const createBusiness = async (userId: string, businessData: Partial<Business>) => {
    try {
      const newBusiness = await authService.createBusiness(userId, businessData);
      if (newBusiness) {
        // Add tenant_id to the business
        const businessWithTenant = {
          ...newBusiness,
          tenant_id: newBusiness.id
        };
        
        // Update local state
        setBusiness(businessWithTenant as Business);
        
        // After business creation, update user profile
        await updateProfile(userId, {
          belongs_to_business_id: newBusiness.id
        });
        
        toast.success("Business created successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating business:", error);
      toast.error("Failed to create business");
      return false;
    }
  };

  // Switch tenant
  const switchTenant = async (userId: string, tenantId: string) => {
    try {
      // Update the user's belongs_to_business_id in their profile
      await authService.updateProfile(userId, {
        belongs_to_business_id: tenantId
      });
      
      // Fetch the new business
      await fetchUserBusiness(tenantId);
      
      toast.success('Switched to different business successfully');
      return true;
    } catch (error) {
      console.error('Failed to switch tenant:', error);
      toast.error('Failed to switch business');
      return false;
    }
  };

  return {
    profile,
    business,
    setProfile,
    setBusiness,
    fetchUserProfile,
    fetchUserBusiness,
    updateProfile,
    updateBusiness,
    createBusiness,
    switchTenant,
    profileLoading,
    businessLoading
  };
};

// Import for the user creation fallback
import { supabase } from '@/integrations/supabase/client';
