
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type CheckoutResult = {
  success: boolean;
  url?: string;
  error?: string;
};

export const createCheckout = async (
  productId: string,
  variantId: string, 
  planName: string,
  customerEmail?: string
): Promise<CheckoutResult> => {
  try {
    const storeId = "176510"; // Set the store ID provided by the user
    
    const { data, error } = await supabase.functions.invoke('lemon-squeezy', {
      body: {
        action: 'create-checkout',
        storeId,
        productId,
        variantId,
        customerEmail,
        planName
      },
      method: 'POST',
    });

    if (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to create checkout. Please try again.');
      return { success: false, error: error.message };
    }

    // Extract the checkout URL from the response
    const checkoutUrl = data?.data?.attributes?.url;
    
    if (!checkoutUrl) {
      toast.error('Invalid checkout response. Please try again.');
      return { success: false, error: 'Invalid checkout response' };
    }

    return { success: true, url: checkoutUrl };
  } catch (error) {
    console.error('Error in createCheckout:', error);
    toast.error('An unexpected error occurred. Please try again.');
    return { success: false, error: error.message };
  }
};
