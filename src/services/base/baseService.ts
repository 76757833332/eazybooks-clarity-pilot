
import { supabase } from "@/integrations/supabase/client";

export const baseService = {
  /**
   * Gets the current authenticated user
   * @returns The current authenticated user
   * @throws Error if user is not authenticated
   */
  getCurrentUser: async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error("User not authenticated");
    return user.user;
  }
};
