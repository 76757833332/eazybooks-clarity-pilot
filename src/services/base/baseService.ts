
import { supabase } from "@/integrations/supabase/client";

/**
 * Base service with common functionality
 */
export const baseService = {
  /**
   * Get the current authenticated user ID
   */
  getCurrentUserId: async (): Promise<string> => {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error("Error getting current user:", error);
      throw new Error("Authentication error: " + error.message);
    }
    
    if (!user) {
      throw new Error("No authenticated user found");
    }
    
    return user.id;
  },

  /**
   * Get the current authenticated user
   */
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error("Error getting current user:", error);
      throw new Error("Authentication error: " + error.message);
    }
    
    return user;
  }
};
