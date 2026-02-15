import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { state, district, market, landType, landSize, userId } = await req.json();
    
    console.log("Received crop prediction request:", { state, district, market, landType, landSize, userId });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // TODO: Replace this URL with your deployed FastAPI endpoint
    const FASTAPI_ENDPOINT = Deno.env.get("FASTAPI_ENDPOINT") || "http://localhost:8000";
    
    // For now, return mock data until FastAPI is connected
    // When ready, uncomment the code below and set FASTAPI_ENDPOINT secret
    
    /*
    const response = await fetch(`${FASTAPI_ENDPOINT}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        state,
        district,
        market,
        land_type: landType,
        land_size: parseFloat(landSize),
      }),
    });

    if (!response.ok) {
      throw new Error(`FastAPI error: ${response.statusText}`);
    }

    const data = await response.json();
    */

    // Mock response - replace with actual FastAPI data
    const data = {
      profitableCrops: [
        { 
          name: "Soyabean", 
          price: "₹5,000", 
          pricePerUnit: "per quintal" 
        },
        { 
          name: "Cotton", 
          price: "₹4,800", 
          pricePerUnit: "per quintal" 
        },
        { 
          name: "Wheat", 
          price: "₹4,500", 
          pricePerUnit: "per quintal" 
        },
      ],
      suitableCrop: {
        name: "Soyabean",
        waterRequirement: "400–700 mm during growing season",
        fertilizer: "N:P:K ratio of 4:2:1, apply 200-250 kg/ha",
        idealTemperature: "25–30°C",
        pesticide: "1 L per acre every 15 days during pest season",
        harvestTime: "90-120 days from sowing",
      },
    };

    // Save recommendation to database if user is logged in
    if (userId) {
      const { error: dbError } = await supabase
        .from('crop_recommendations')
        .insert({
          user_id: userId,
          state,
          district,
          market: market || null,
          land_type: landType,
          land_size: parseFloat(landSize),
          profitable_crops: data.profitableCrops,
          suitable_crop: data.suitableCrop,
        });

      if (dbError) {
        console.error('Error saving recommendation:', dbError);
      } else {
        console.log('Recommendation saved successfully');
      }
    }

    console.log("Returning crop predictions:", data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in crop-prediction function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
