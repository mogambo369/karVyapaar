import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Product {
  id: string;
  barcode: string;
  name: string;
  category: string;
  price: number;
  cost_price: number;
  stock: number;
  min_stock: number;
  unit: string;
  gst_rate: number;
  expiry_date: string | null;
  batch_number: string | null;
  is_banned: boolean;
  ban_reason: string | null;
  ban_source: string | null;
  created_at: string;
  updated_at: string;
}

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useProductsByCategory = (category?: string) => {
  return useQuery({
    queryKey: ["products", category],
    queryFn: async () => {
      let query = supabase.from("products").select("*").order("name");

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useExpiringProducts = (daysThreshold: number = 90) => {
  return useQuery({
    queryKey: ["products", "expiring", daysThreshold],
    queryFn: async () => {
      const thresholdDate = new Date();
      thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .not("expiry_date", "is", null)
        .lte("expiry_date", thresholdDate.toISOString().split("T")[0])
        .order("expiry_date");

      if (error) throw error;
      return data as Product[];
    },
  });
};

export const useLowStockProducts = () => {
  return useQuery({
    queryKey: ["products", "low-stock"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("stock");

      if (error) throw error;
      // Filter in JS since we can't compare columns in supabase-js easily
      return (data as Product[]).filter((p) => p.stock <= p.min_stock);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Product> & { id: string }) => {
      const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update product: " + error.message);
    },
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Omit<Product, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("products")
        .insert(product)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add product: " + error.message);
    },
  });
};
