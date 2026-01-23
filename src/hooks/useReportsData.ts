import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSalesReportData = (period: string) => {
  return useQuery({
    queryKey: ["reports", "sales", period],
    queryFn: async () => {
      const now = new Date();
      let startDate = new Date();

      switch (period) {
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          startDate.setMonth(now.getMonth() - 3);
          break;
        case "year":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setDate(now.getDate() - 7);
      }

      const { data: sales, error: salesError } = await supabase
        .from("sales")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .order("created_at");

      if (salesError) throw salesError;

      const { data: saleItems, error: itemsError } = await supabase
        .from("sale_items")
        .select("*");

      if (itemsError) throw itemsError;

      // Calculate daily sales
      const dailySales: Record<string, { sales: number; orders: number }> = {};
      (sales || []).forEach((sale) => {
        const day = new Date(sale.created_at).toLocaleDateString("en-US", {
          weekday: "short",
        });
        if (!dailySales[day]) {
          dailySales[day] = { sales: 0, orders: 0 };
        }
        dailySales[day].sales += Number(sale.total);
        dailySales[day].orders += 1;
      });

      // Calculate top products
      const productTotals: Record<string, { name: string; quantity: number; revenue: number }> = {};
      (saleItems || []).forEach((item) => {
        if (!productTotals[item.product_name]) {
          productTotals[item.product_name] = {
            name: item.product_name,
            quantity: 0,
            revenue: 0,
          };
        }
        productTotals[item.product_name].quantity += item.quantity;
        productTotals[item.product_name].revenue += Number(item.total_price);
      });

      const topProducts = Object.values(productTotals)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      const totalSales = (sales || []).reduce((sum, s) => sum + Number(s.total), 0);
      const totalOrders = (sales || []).length;
      const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

      return {
        dailySales: Object.entries(dailySales).map(([day, data]) => ({
          day,
          ...data,
        })),
        topProducts,
        summary: {
          totalSales,
          totalOrders,
          avgOrderValue,
        },
      };
    },
  });
};

export const useProfitAnalysisData = (period: string) => {
  return useQuery({
    queryKey: ["reports", "profit", period],
    queryFn: async () => {
      const now = new Date();
      let monthsBack = 6;

      switch (period) {
        case "3months":
          monthsBack = 3;
          break;
        case "6months":
          monthsBack = 6;
          break;
        case "year":
          monthsBack = 12;
          break;
        default:
          monthsBack = 6;
      }

      const startDate = new Date();
      startDate.setMonth(now.getMonth() - monthsBack);

      const { data: sales, error: salesError } = await supabase
        .from("sales")
        .select("*")
        .gte("created_at", startDate.toISOString());

      if (salesError) throw salesError;

      const { data: saleItems, error: itemsError } = await supabase
        .from("sale_items")
        .select("*, products:product_id(cost_price)");

      if (itemsError) throw itemsError;

      // Group by month
      const monthlyData: Record<
        string,
        { revenue: number; expenses: number; profit: number }
      > = {};

      (sales || []).forEach((sale) => {
        const month = new Date(sale.created_at).toLocaleDateString("en-US", {
          month: "short",
        });
        if (!monthlyData[month]) {
          monthlyData[month] = { revenue: 0, expenses: 0, profit: 0 };
        }
        monthlyData[month].revenue += Number(sale.total);
      });

      // Estimate costs based on sale items
      (saleItems || []).forEach((item: any) => {
        const saleDate = item.created_at;
        const month = new Date(saleDate).toLocaleDateString("en-US", {
          month: "short",
        });
        if (monthlyData[month]) {
          const costPrice = item.products?.cost_price || item.unit_price * 0.7;
          monthlyData[month].expenses += Number(costPrice) * item.quantity;
        }
      });

      // Calculate profit
      Object.keys(monthlyData).forEach((month) => {
        monthlyData[month].profit =
          monthlyData[month].revenue - monthlyData[month].expenses;
      });

      const totalRevenue = Object.values(monthlyData).reduce(
        (sum, m) => sum + m.revenue,
        0
      );
      const totalExpenses = Object.values(monthlyData).reduce(
        (sum, m) => sum + m.expenses,
        0
      );
      const netProfit = totalRevenue - totalExpenses;
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

      return {
        monthlyData: Object.entries(monthlyData).map(([month, data]) => ({
          month,
          ...data,
        })),
        summary: {
          totalRevenue,
          totalExpenses,
          netProfit,
          profitMargin,
        },
      };
    },
  });
};

export const useGSTSummaryData = () => {
  return useQuery({
    queryKey: ["reports", "gst"],
    queryFn: async () => {
      const { data: sales, error: salesError } = await supabase
        .from("sales")
        .select("*")
        .order("created_at", { ascending: false });

      if (salesError) throw salesError;

      const { data: saleItems, error: itemsError } = await supabase
        .from("sale_items")
        .select("*, products:product_id(gst_rate)");

      if (itemsError) throw itemsError;

      // Group sales by month
      const monthlyGST: Record<
        string,
        { salesGst: number; netPayable: number; status: string }
      > = {};

      (sales || []).forEach((sale) => {
        const monthKey = new Date(sale.created_at).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        if (!monthlyGST[monthKey]) {
          monthlyGST[monthKey] = { salesGst: 0, netPayable: 0, status: "pending" };
        }
        monthlyGST[monthKey].salesGst += Number(sale.gst_amount);
        monthlyGST[monthKey].netPayable += Number(sale.gst_amount);
      });

      // Group by GST rate
      const gstByRate: Record<string, { taxableValue: number; gstAmount: number }> = {
        "5%": { taxableValue: 0, gstAmount: 0 },
        "12%": { taxableValue: 0, gstAmount: 0 },
        "18%": { taxableValue: 0, gstAmount: 0 },
        "28%": { taxableValue: 0, gstAmount: 0 },
      };

      (saleItems || []).forEach((item: any) => {
        const gstRate = item.products?.gst_rate || 18;
        const rateKey = `${gstRate}%`;
        if (gstByRate[rateKey]) {
          const taxableValue = Number(item.total_price) / (1 + gstRate / 100);
          gstByRate[rateKey].taxableValue += taxableValue;
          gstByRate[rateKey].gstAmount += Number(item.total_price) - taxableValue;
        }
      });

      const totalGST = Object.values(gstByRate).reduce(
        (sum, r) => sum + r.gstAmount,
        0
      );
      const totalTaxable = Object.values(gstByRate).reduce(
        (sum, r) => sum + r.taxableValue,
        0
      );

      return {
        monthlyGST: Object.entries(monthlyGST)
          .slice(0, 6)
          .map(([month, data]) => ({
            month,
            ...data,
          })),
        gstByRate: Object.entries(gstByRate).map(([rate, data]) => ({
          rate,
          ...data,
        })),
        summary: {
          totalGST,
          totalTaxable,
        },
      };
    },
  });
};
