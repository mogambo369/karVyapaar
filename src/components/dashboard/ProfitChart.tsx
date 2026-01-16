import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const profitData = [
  { month: "Jan", profit: 12000 },
  { month: "Feb", profit: 11500 },
  { month: "Mar", profit: 14500 },
  { month: "Apr", profit: 13800 },
  { month: "May", profit: 17000 },
  { month: "Jun", profit: 19500 },
  { month: "Jul", profit: 21000 },
  { month: "Aug", profit: 26500 },
  { month: "Sep", profit: 24000 },
  { month: "Oct", profit: 32000 },
  { month: "Nov", profit: 28500 },
  { month: "Dec", profit: 30000 },
];

export const ProfitChart = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Profit Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">Monthly profit trends</p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={profitData}>
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
                formatter={(value: number) => [`₹${value.toLocaleString()}`, "Profit"]}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
