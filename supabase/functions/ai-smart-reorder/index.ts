import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LowStockItem {
  name: string;
  stock: number;
  min_stock: number;
  category: string;
  unit: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lowStockItems, distributorName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!lowStockItems || lowStockItems.length === 0) {
      return new Response(JSON.stringify({ 
        message: "No low stock items to reorder.",
        whatsappMessage: ""
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Generating reorder message for", lowStockItems.length, "items");

    const itemsList = lowStockItems.map((item: LowStockItem) => 
      `- ${item.name}: Current stock ${item.stock} ${item.unit}, need minimum ${item.min_stock} ${item.unit}`
    ).join("\n");

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
            content: `You are a helpful assistant for Indian retail shopkeepers. Generate professional WhatsApp order messages for distributors.

The message should be:
- Polite and professional in Hinglish (mix of Hindi and English, written in Roman script)
- Include all items with suggested order quantities (roughly double the shortage)
- Ask for delivery by tomorrow or day after
- Include a greeting and closing
- Keep it concise but complete

Format the output as JSON:
{
  "whatsappMessage": "The complete WhatsApp message ready to send",
  "summary": "Brief summary of the order in English"
}`
          },
          {
            role: "user",
            content: `Generate a WhatsApp order message for distributor "${distributorName || 'Supplier Ji'}".

Low stock items that need reordering:
${itemsList}

Create a professional order message in Hinglish.`
          }
        ],
        max_tokens: 1000,
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
        whatsappMessage: content,
        summary: "Order message generated"
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in ai-smart-reorder:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
