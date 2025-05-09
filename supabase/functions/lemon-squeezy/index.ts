
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
      console.error("LemonSqueezy API key is not configured");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "LemonSqueezy API key is not configured" 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract the action from the URL path
    const path = url.pathname.split('/').pop();

    if (req.method === 'POST' && path === 'create-checkout') {
      const { productId, variantId, customerEmail, planName, storeId } = await req.json();
      
      if (!productId || !variantId) {
        console.error("Missing required parameters:", { productId, variantId });
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Product ID and variant ID are required" 
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Creating checkout for store: ${storeId}, product: ${productId}, variant: ${variantId}, email: ${customerEmail || 'not provided'}`);
      
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

      const responseText = await checkoutResponse.text();
      let checkoutData;
      
      try {
        checkoutData = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse LemonSqueezy response:", responseText);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Invalid response from LemonSqueezy API", 
            details: responseText.substring(0, 500) // Limit the length in case it's huge
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (!checkoutResponse.ok) {
        console.error("LemonSqueezy API error:", JSON.stringify(checkoutData));
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Error creating checkout", 
            details: checkoutData,
            status: checkoutResponse.status,
            statusText: checkoutResponse.statusText
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Check if the response has the expected structure
      if (!checkoutData?.data?.attributes?.url) {
        console.error("LemonSqueezy response missing checkout URL:", JSON.stringify(checkoutData));
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "LemonSqueezy response missing checkout URL", 
            data: checkoutData 
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      console.log("Checkout created successfully", { 
        url: checkoutData?.data?.attributes?.url,
        status: checkoutResponse.status
      });

      return new Response(
        JSON.stringify({ 
          success: true, 
          data: checkoutData?.data 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
        JSON.stringify({ success: true, data: productsData }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (req.method === 'GET' && path === 'variants') {
      const productId = url.searchParams.get('product_id');
      
      if (!productId) {
        return new Response(
          JSON.stringify({ success: false, error: "Product ID is required" }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
        JSON.stringify({ success: true, data: variantsData }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: "Not found" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in lemon-squeezy edge function:", error.message, error.stack);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message, stack: error.stack }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
