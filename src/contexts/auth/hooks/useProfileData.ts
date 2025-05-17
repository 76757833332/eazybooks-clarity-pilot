
import { useState } from 'react';
import { Profile, Business } from '@/contexts/auth/types';
import * as authService from '@/services/authService';
import { toast } from 'sonner';
import { baseService } from '@/services/base/baseService';

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
        }
      } else {
        console.warn('No profile found for user ID:', userId);
        // Handle missing profile - could create a new profile here if needed
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
      }
    } catch (error) {
      console.error("Error fetching business:", error);
      // Don't show toast for initial load
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
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  // Update business
  const updateBusiness = async (businessId: string, updatedBusiness: Partial<Business>) => {
    try {
      await authService.updateBusiness(businessId, updatedBusiness);
      // Update local state
      setBusiness(prev => prev ? { ...prev, ...updatedBusiness } : null);
      toast.success("Business updated successfully");
    } catch (error) {
      console.error("Error updating business:", error);
      toast.error("Failed to update business");
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
        await fetchUserProfile(userId);
        
        toast.success("Business created successfully");
      }
    } catch (error) {
      console.error("Error creating business:", error);
      toast.error("Failed to create business");
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
    } catch (error) {
      console.error('Failed to switch tenant:', error);
      toast.error('Failed to switch business');
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
