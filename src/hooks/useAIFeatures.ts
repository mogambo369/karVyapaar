import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScanBillInputSchema, VoiceCommandInputSchema, ReorderInputSchema } from "@/lib/validations";
import { z } from "zod";

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

  const getAuthToken = async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  };

  const scanBill = useCallback(async (imageBase64: string): Promise<ScanBillResult> => {
    setIsScanning(true);
    try {
      // Validate input
      const validated = ScanBillInputSchema.parse({ imageBase64 });
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-scan-bill`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ imageBase64: validated.imageBase64 }),
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
      if (error instanceof z.ZodError) {
        const message = error.errors[0]?.message || "Invalid input";
        toast.error(message);
        return { entries: [], error: message };
      }
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
      // Validate input
      const validated = VoiceCommandInputSchema.parse({ transcript, language });
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-voice-command`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ transcript: validated.transcript, language: validated.language }),
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
      if (error instanceof z.ZodError) {
        const message = error.errors[0]?.message || "Invalid input";
        toast.error(message);
        return {
          action: "ERROR",
          items: [],
          confidence: 0,
          originalText: transcript,
          interpretation: message,
          error: message
        };
      }
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
      // Validate input
      const validated = ReorderInputSchema.parse({ lowStockItems, distributorName });
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-smart-reorder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            lowStockItems: validated.lowStockItems, 
            distributorName: validated.distributorName 
          }),
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
      if (error instanceof z.ZodError) {
        const message = error.errors[0]?.message || "Invalid input";
        toast.error(message);
        return { whatsappMessage: "", summary: "", error: message };
      }
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
