import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Sale {
  id: string;
  invoice_number: string;
  customer_name: string | null;
  customer_phone: string | null;
  subtotal: number;
  gst_amount: number;
  total: number;
  payment_method: string;
  created_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface CreateSaleInput {
  invoice_number: string;
  customer_name?: string;
  customer_phone?: string;
  subtotal: number;
  gst_amount: number;
  total: number;
  payment_method: string;
  items: {
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[];
}

export const useSales = (limit?: number) => {
  return useQuery({
    queryKey: ["sales", limit],
    queryFn: async () => {
      let query = supabase
        .from("sales")
        .select("*")
        .order("created_at", { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Sale[];
    },
  });
};

export const useSalesWithItems = () => {
  return useQuery({
    queryKey: ["sales", "with-items"],
    queryFn: async () => {
      const { data: sales, error: salesError } = await supabase
        .from("sales")
        .select("*")
        .order("created_at", { ascending: false });

      if (salesError) throw salesError;

      const { data: items, error: itemsError } = await supabase
        .from("sale_items")
        .select("*");

      if (itemsError) throw itemsError;

      return (sales as Sale[]).map((sale) => ({
        ...sale,
        items: (items as SaleItem[]).filter((item) => item.sale_id === sale.id),
      }));
    },
  });
};

export const useSalesByDateRange = (startDate: Date, endDate: Date) => {
  return useQuery({
    queryKey: ["sales", "range", startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Sale[];
    },
  });
};

export const useDailySalesStats = () => {
  return useQuery({
    queryKey: ["sales", "daily-stats"],
    queryFn: async () => {
      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);

      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .gte("created_at", last7Days.toISOString())
        .order("created_at");

      if (error) throw error;

      // Group by day
      const salesByDay: Record<string, { total: number; count: number }> = {};
      (data as Sale[]).forEach((sale) => {
        const day = new Date(sale.created_at).toLocaleDateString("en-US", {
          weekday: "short",
        });
        if (!salesByDay[day]) {
          salesByDay[day] = { total: 0, count: 0 };
        }
        salesByDay[day].total += Number(sale.total);
        salesByDay[day].count += 1;
      });

      return salesByDay;
    },
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSaleInput) => {
      // Create sale
      const { data: sale, error: saleError } = await supabase
        .from("sales")
        .insert({
          invoice_number: input.invoice_number,
          customer_name: input.customer_name || null,
          customer_phone: input.customer_phone || null,
          subtotal: input.subtotal,
          gst_amount: input.gst_amount,
          total: input.total,
          payment_method: input.payment_method,
        })
        .select()
        .single();

      if (saleError) throw saleError;

      // Create sale items
      const saleItems = input.items.map((item) => ({
        sale_id: sale.id,
        product_id: item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
      }));

      const { error: itemsError } = await supabase
        .from("sale_items")
        .insert(saleItems);

      if (itemsError) throw itemsError;

      return sale;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Sale completed successfully");
    },
    onError: (error) => {
      toast.error("Failed to complete sale: " + error.message);
    },
  });
};

export const generateInvoiceNumber = () => {
  const date = new Date();
  const prefix = "INV";
  const timestamp = date.getTime().toString(36).toUpperCase();
  return `${prefix}-${timestamp}`;
};
