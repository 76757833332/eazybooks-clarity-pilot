
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
