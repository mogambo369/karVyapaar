import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface BannedMedicine {
  id: string;
  name: string;
  reason: string;
  source: string;
  banned_date: string;
  created_at: string;
}

export interface RegulatoryAlert {
  id: string;
  title: string;
  description: string;
  source: string;
  severity: string;
  is_read: boolean;
  created_at: string;
}

export const useBannedMedicines = () => {
  return useQuery({
    queryKey: ["banned-medicines"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banned_medicines")
        .select("*")
        .order("banned_date", { ascending: false });

      if (error) throw error;
      return data as BannedMedicine[];
    },
  });
};

export const useAddBannedMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (medicine: Omit<BannedMedicine, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("banned_medicines")
        .insert(medicine)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banned-medicines"] });
      toast.success("Banned medicine added");
    },
    onError: (error) => {
      toast.error("Failed to add banned medicine: " + error.message);
    },
  });
};

export const useDeleteBannedMedicine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("banned_medicines")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["banned-medicines"] });
      toast.success("Banned medicine removed");
    },
    onError: (error) => {
      toast.error("Failed to remove banned medicine: " + error.message);
    },
  });
};

export const useRegulatoryAlerts = () => {
  return useQuery({
    queryKey: ["regulatory-alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("regulatory_alerts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as RegulatoryAlert[];
    },
  });
};

export const useMarkAlertRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("regulatory_alerts")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regulatory-alerts"] });
    },
  });
};

export const useComplianceStats = () => {
  return useQuery({
    queryKey: ["compliance-stats"],
    queryFn: async () => {
      const [bannedResult, alertsResult, productsResult] = await Promise.all([
        supabase.from("banned_medicines").select("id"),
        supabase.from("regulatory_alerts").select("id, is_read"),
        supabase.from("products").select("id, expiry_date, stock, is_banned"),
      ]);

      if (bannedResult.error) throw bannedResult.error;
      if (alertsResult.error) throw alertsResult.error;
      if (productsResult.error) throw productsResult.error;

      const today = new Date();
      const products = productsResult.data || [];

      // Calculate expiring products
      const expiringProducts = products.filter((p) => {
        if (!p.expiry_date) return false;
        const expiryDate = new Date(p.expiry_date);
        const daysLeft = Math.ceil(
          (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysLeft <= 90;
      });

      const expiredCount = expiringProducts.filter((p) => {
        const expiryDate = new Date(p.expiry_date!);
        return expiryDate < today;
      }).length;

      const expiringSoonCount = expiringProducts.filter((p) => {
        const expiryDate = new Date(p.expiry_date!);
        const daysLeft = Math.ceil(
          (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysLeft > 0 && daysLeft <= 30;
      }).length;

      return {
        bannedMedicinesCount: bannedResult.data?.length || 0,
        expiredCount,
        expiringSoonCount,
        unreadAlertsCount:
          alertsResult.data?.filter((a) => !a.is_read).length || 0,
      };
    },
  });
};
