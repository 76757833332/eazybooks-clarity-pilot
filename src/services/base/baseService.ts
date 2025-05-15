
import { supabase } from "@/integrations/supabase/client";

/**
 * Base service for common operations
 */
export const baseService = {
  /**
   * Get current user session
   */
  getCurrentSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!data.session) throw new Error("No active session found");
    return data.session;
  },
  
  /**
   * Get current user ID safely without requiring direct users table access
   */
  getCurrentUserId: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!data.session?.user) throw new Error("No active user found");
    return data.session.user.id;
  }
};
