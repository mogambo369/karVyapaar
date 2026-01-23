import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  total_orders: number;
  total_spent: number;
  loyalty_tier: string;
  created_at: string;
  updated_at: string;
}

export const useCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("total_spent", { ascending: false });

      if (error) throw error;
      return data as Customer[];
    },
  });
};

export const useCustomerStats = () => {
  return useQuery({
    queryKey: ["customers", "stats"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*");

      if (error) throw error;

      const customers = data as Customer[];
      const totalCustomers = customers.length;
      const totalRevenue = customers.reduce((sum, c) => sum + Number(c.total_spent), 0);
      const avgOrderValue =
        customers.length > 0
          ? customers.reduce((sum, c) => sum + Number(c.total_spent) / Math.max(1, c.total_orders), 0) /
            customers.length
          : 0;

      const loyaltyDistribution = {
        Bronze: customers.filter((c) => c.loyalty_tier === "Bronze").length,
        Silver: customers.filter((c) => c.loyalty_tier === "Silver").length,
        Gold: customers.filter((c) => c.loyalty_tier === "Gold").length,
        Platinum: customers.filter((c) => c.loyalty_tier === "Platinum").length,
      };

      return {
        totalCustomers,
        totalRevenue,
        avgOrderValue,
        loyaltyDistribution,
      };
    },
  });
};

export const useCustomerPurchases = (customerId: string) => {
  return useQuery({
    queryKey: ["customers", customerId, "purchases"],
    queryFn: async () => {
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .select("*")
        .eq("id", customerId)
        .maybeSingle();

      if (customerError) throw customerError;
      if (!customer) return null;

      // Get sales for this customer by phone
      const { data: sales, error: salesError } = await supabase
        .from("sales")
        .select("*")
        .eq("customer_phone", customer.phone)
        .order("created_at", { ascending: false });

      if (salesError) throw salesError;

      // Get items for these sales
      const saleIds = (sales || []).map((s) => s.id);
      
      if (saleIds.length === 0) {
        return { customer: customer as Customer, purchases: [] };
      }

      const { data: items, error: itemsError } = await supabase
        .from("sale_items")
        .select("*")
        .in("sale_id", saleIds);

      if (itemsError) throw itemsError;

      const purchases = (sales || []).map((sale) => ({
        ...sale,
        items: (items || []).filter((item) => item.sale_id === sale.id),
      }));

      return { customer: customer as Customer, purchases };
    },
    enabled: !!customerId,
  });
};
