import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownLeft, Wallet, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const transactions = [
  {
    id: "TXN001",
    customer: "Rajesh Kumar",
    amount: 1250,
    type: "sale",
    method: "UPI",
    time: "2 mins ago",
  },
  {
    id: "TXN002",
    customer: "Priya Sharma",
    amount: 3450,
    type: "sale",
    method: "Cash",
    time: "15 mins ago",
  },
  {
    id: "TXN003",
    customer: "Amit Patel",
    amount: 780,
    type: "sale",
    method: "UPI",
    time: "32 mins ago",
  },
  {
    id: "TXN004",
    customer: "Stock Purchase",
    amount: 15000,
    type: "expense",
    method: "Bank",
    time: "1 hour ago",
  },
  {
    id: "TXN005",
    customer: "Sunita Devi",
    amount: 2100,
    type: "sale",
    method: "Cash",
    time: "2 hours ago",
  },
];

export const RecentTransactions = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    txn.type === "sale"
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {txn.type === "sale" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownLeft className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{txn.customer}</p>
                  <p className="text-xs text-muted-foreground">{txn.time}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-3">
                <div>
                  <p
                    className={cn(
                      "font-semibold text-sm",
                      txn.type === "sale" ? "text-success" : "text-destructive"
                    )}
                  >
                    {txn.type === "sale" ? "+" : "-"}₹{txn.amount.toLocaleString()}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {txn.method === "UPI" ? (
                    <Wallet className="h-3 w-3 mr-1" />
                  ) : (
                    <CreditCard className="h-3 w-3 mr-1" />
                  )}
                  {txn.method}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
