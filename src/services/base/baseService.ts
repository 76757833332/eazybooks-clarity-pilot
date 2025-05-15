
import { supabase } from "@/integrations/supabase/client";

/**
 * Base service for common operations
 */
export const baseService = {
  /**
   * Get current user session
   */
  getCurrentSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session error:", error);
        throw error;
      }
      if (!data.session) {
        console.error("No active session found");
        throw new Error("No active session found");
      }
      return data.session;
    } catch (error) {
      console.error("Failed to get current session:", error);
      throw error;
    }
  },
  
  /**
   * Get current user ID safely without requiring direct users table access
   */
  getCurrentUserId: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session error:", error);
        throw error;
      }
      if (!data.session?.user) {
        console.error("No active user found");
        throw new Error("No active user found");
      }
      return data.session.user.id;
    } catch (error) {
      console.error("Failed to get current user ID:", error);
      throw error;
    }
  },

  /**
   * Get current tenant ID (business ID for business owners/employees)
   */
  getCurrentTenantId: async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error("No authenticated user found");
      }
      
      // Check user metadata for belongs_to_business_id
      const businessId = userData.user.user_metadata?.belongs_to_business_id;
      if (businessId) {
        return businessId;
      }
      
      // If not found in metadata and user is a business owner, we'll need to implement
      // a different approach since the businesses table doesn't exist in the schema
      
      // For now, return undefined if no tenant ID is found
      console.warn("No tenant ID found for user");
      return undefined;
    } catch (error) {
      console.error("Failed to get current tenant ID:", error);
      throw error;
    }
  },

  /**
   * Get current user safely (compatibility method)
   * @deprecated Use getCurrentUserId instead
   */
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session error:", error);
        throw error;
      }
      if (!data.session?.user) {
        console.error("No active user found");
        throw new Error("No active user found");
      }
      return { id: data.session.user.id };
    } catch (error) {
      console.error("Failed to get current user:", error);
      throw error;
    }
  }
};
