import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StockEntry {
  name: string;
  quantity: number;
  unit: string;
  price: number;
  category: string;
}

interface ScanBillResult {
  entries: StockEntry[];
  notes?: string;
  error?: string;
}

interface VoiceCommandResult {
  action: "ADD_STOCK" | "CREATE_BILL" | "CHECK_STOCK" | "CHECK_PRICE" | "UNKNOWN" | "ERROR";
  items: Array<{
    name: string;
    quantity: number;
    unit: string;
    price?: number;
  }>;
  confidence: number;
  originalText: string;
  interpretation: string;
  error?: string;
}

interface ReorderResult {
  whatsappMessage: string;
  summary: string;
  error?: string;
}

export const useAIFeatures = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [isGeneratingReorder, setIsGeneratingReorder] = useState(false);

  const scanBill = useCallback(async (imageBase64: string): Promise<ScanBillResult> => {
    setIsScanning(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-scan-bill`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ imageBase64 }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to scan bill");
      }

      const result = await response.json();
      
      if (result.entries && result.entries.length > 0) {
        toast.success(`Found ${result.entries.length} items in the bill!`);
      } else if (result.notes) {
        toast.info("Could not extract structured data. Check notes.");
      }
      
      return result;
    } catch (error) {
      console.error("Error scanning bill:", error);
      toast.error(error instanceof Error ? error.message : "Failed to scan bill");
      return { entries: [], error: error instanceof Error ? error.message : "Unknown error" };
    } finally {
      setIsScanning(false);
    }
  }, []);

  const processVoiceCommand = useCallback(async (
    transcript: string, 
    language: string = "auto"
  ): Promise<VoiceCommandResult> => {
    setIsProcessingVoice(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-voice-command`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ transcript, language }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process voice command");
      }

      const result = await response.json();
      
      if (result.action && result.action !== "UNKNOWN" && result.action !== "ERROR") {
        toast.success(`Understood: ${result.interpretation}`);
      } else {
        toast.warning("Could not understand command. Please try again.");
      }
      
      return result;
    } catch (error) {
      console.error("Error processing voice command:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process voice");
      return {
        action: "ERROR",
        items: [],
        confidence: 0,
        originalText: transcript,
        interpretation: "Error processing command",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    } finally {
      setIsProcessingVoice(false);
    }
  }, []);

  const generateReorderMessage = useCallback(async (
    lowStockItems: Array<{
      name: string;
      stock: number;
      min_stock: number;
      category: string;
      unit: string;
    }>,
    distributorName?: string
  ): Promise<ReorderResult> => {
    setIsGeneratingReorder(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-smart-reorder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ lowStockItems, distributorName }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate reorder message");
      }

      const result = await response.json();
      
      if (result.whatsappMessage) {
        toast.success("WhatsApp order message generated!");
      }
      
      return result;
    } catch (error) {
      console.error("Error generating reorder message:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate message");
      return {
        whatsappMessage: "",
        summary: "",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    } finally {
      setIsGeneratingReorder(false);
    }
  }, []);

  return {
    scanBill,
    isScanning,
    processVoiceCommand,
    isProcessingVoice,
    generateReorderMessage,
    isGeneratingReorder,
  };
};
