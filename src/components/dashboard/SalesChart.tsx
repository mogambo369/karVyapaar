import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

const salesData = [
  { month: "Jan", sales: 42000 },
  { month: "Feb", sales: 38000 },
  { month: "Mar", sales: 51000 },
  { month: "Apr", sales: 48000 },
  { month: "May", sales: 55000 },
  { month: "Jun", sales: 62000 },
  { month: "Jul", sales: 68000 },
  { month: "Aug", sales: 85000 },
  { month: "Sep", sales: 72000 },
  { month: "Oct", sales: 95000 },
  { month: "Nov", sales: 78000 },
  { month: "Dec", sales: 82000 },
];

interface SalesChartProps {
  className?: string;
}

export const SalesChart = ({ className }: SalesChartProps) => {
  return (
    <Card className={cn(
      "group overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1",
      className
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold transition-colors group-hover:text-primary">
          Sales Trends
        </CardTitle>
        <p className="text-sm text-muted-foreground">Monthly sales performance</p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] transition-transform duration-500 group-hover:scale-[1.02] origin-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, "Sales"]}
              />
              <Bar
                dataKey="sales"
                fill="hsl(var(--chart-2))"
                radius={[4, 4, 0, 0]}
                animationBegin={0}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
