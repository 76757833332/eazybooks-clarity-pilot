
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
    
    console.log(`Initiating checkout for product: ${productId}, variant: ${variantId}, plan: ${planName}`);
    
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
      console.error('Error invoking lemon-squeezy edge function:', error);
      toast.error('Failed to create checkout. Please try again.');
      return { success: false, error: `Edge function error: ${error.message}` };
    }

    console.log('Edge function response:', data);

    // Check if response has the success field set to false
    if (data && data.success === false) {
      console.error('Edge function reported error:', data.error, data?.details);
      toast.error(`Checkout error: ${data.error || 'Unknown error'}`);
      return { success: false, error: data.error || 'Unknown error from API' };
    }

    // Extract the checkout URL from the response
    const checkoutUrl = data?.data?.attributes?.url;
    
    if (!checkoutUrl) {
      console.error('Invalid checkout response - missing URL:', data);
      toast.error('Invalid checkout response. Please try again.');
      return { success: false, error: 'Invalid checkout response - missing URL' };
    }

    return { success: true, url: checkoutUrl };
  } catch (error) {
    console.error('Exception in createCheckout:', error);
    toast.error('An unexpected error occurred. Please try again.');
    return { success: false, error: `Exception: ${error.message}` };
  }
};
