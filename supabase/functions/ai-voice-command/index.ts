import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!transcript) {
      throw new Error("Voice transcript is required");
    }

    console.log("Processing voice command:", transcript, "Language:", language);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a voice command parser for an Indian retail shop POS system.
Parse voice commands in Hindi, Marathi, Gujarati, or English and extract the action.

Supported actions:
1. ADD_STOCK: Add products to inventory
2. CREATE_BILL: Add items to current bill/cart
3. CHECK_STOCK: Query stock levels
4. CHECK_PRICE: Query product prices

Output format (JSON only):
{
  "action": "ADD_STOCK" | "CREATE_BILL" | "CHECK_STOCK" | "CHECK_PRICE",
  "items": [
    {
      "name": "Product name in English",
      "quantity": 10,
      "unit": "kg" | "piece" | "litre" | "pack",
      "price": 45.00 (optional, only if mentioned)
    }
  ],
  "confidence": 0.95,
  "originalText": "The original command",
  "interpretation": "Brief English explanation of what was understood"
}

Common Hindi/Marathi/Gujarati terms:
- "jodo/dalo/add karo" = add
- "stock mein" = to inventory
- "bill mein" = to bill
- "kitna hai/stock check" = check quantity
- "rate/kimat/bhav" = price
- "kilo/kg" = kilogram
- "packet/pack" = packet
- "piece/dana" = piece
- "rupees/rupaye" = currency`
          },
          {
            role: "user",
            content: `Parse this voice command (language: ${language || 'auto-detect'}): "${transcript}"

Return valid JSON only.`
          }
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    console.log("AI response:", content);

    let parsed;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonStr = jsonMatch[1].trim();
      parsed = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      parsed = {
        action: "UNKNOWN",
        items: [],
        confidence: 0,
        originalText: transcript,
        interpretation: "Could not parse the command. Please try again.",
        error: "Failed to parse voice command"
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in ai-voice-command:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error",
      action: "ERROR",
      items: []
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
