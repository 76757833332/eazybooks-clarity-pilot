
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// LemonSqueezy API endpoints
const LEMON_SQUEEZY_API = "https://api.lemonsqueezy.com/v1";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const apiKey = Deno.env.get("LEMON_SQUEEZY_API_KEY");
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "LemonSqueezy API key is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract the action from the URL path
    const path = url.pathname.split('/').pop();

    if (req.method === 'POST' && path === 'create-checkout') {
      const { productId, variantId, customerEmail, planName, storeId } = await req.json();
      
      if (!productId || !variantId) {
        return new Response(
          JSON.stringify({ error: "Product ID and variant ID are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Creating checkout for store: ${storeId}, product: ${productId}, variant: ${variantId}`);
      
      // Create a checkout in LemonSqueezy
      const checkoutResponse = await fetch(`${LEMON_SQUEEZY_API}/checkouts`, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          data: {
            type: 'checkouts',
            attributes: {
              store_id: parseInt(storeId) || 176510, // Use the store ID from request or default to the provided one
              product_id: parseInt(productId),
              variant_id: parseInt(variantId),
              customer_email: customerEmail || '',
              checkout_data: {
                email: customerEmail || '',
                custom: {
                  plan_name: planName || ''
                }
              }
            }
          }
        })
      });

      const checkoutData = await checkoutResponse.json();
      
      if (!checkoutResponse.ok) {
        console.error("LemonSqueezy API error:", JSON.stringify(checkoutData));
        return new Response(
          JSON.stringify({ error: "Error creating checkout", details: checkoutData }),
          { 
            status: checkoutResponse.status, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      return new Response(
        JSON.stringify(checkoutData),
        { 
          status: checkoutResponse.status, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } else if (req.method === 'GET' && path === 'products') {
      // Get products from LemonSqueezy
      const productsResponse = await fetch(`${LEMON_SQUEEZY_API}/products`, {
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          'Authorization': `Bearer ${apiKey}`
        }
      });

      const productsData = await productsResponse.json();
      
      return new Response(
        JSON.stringify(productsData),
        { 
          status: productsResponse.status, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } else if (req.method === 'GET' && path === 'variants') {
      const productId = url.searchParams.get('product_id');
      
      if (!productId) {
        return new Response(
          JSON.stringify({ error: "Product ID is required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Get variants for a specific product
      const variantsResponse = await fetch(`${LEMON_SQUEEZY_API}/variants?filter[product_id]=${productId}`, {
        headers: {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          'Authorization': `Bearer ${apiKey}`
        }
      });

      const variantsData = await variantsResponse.json();
      
      return new Response(
        JSON.stringify(variantsData),
        { 
          status: variantsResponse.status, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in lemon-squeezy edge function:", error.message);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
