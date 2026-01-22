import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, User, Phone, Calendar, ShoppingBag, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastVisit: string;
  avgOrderValue: number;
  loyaltyTier: string;
}

interface Purchase {
  id: string;
  date: string;
  items: string[];
  total: number;
  paymentMethod: string;
}

const customers: Customer[] = [
  { id: "C001", name: "Rajesh Kumar", phone: "+91 98765 43210", email: "rajesh@email.com", totalOrders: 45, totalSpent: 28500, lastVisit: "2024-01-20", avgOrderValue: 633, loyaltyTier: "gold" },
  { id: "C002", name: "Priya Sharma", phone: "+91 87654 32109", email: "priya@email.com", totalOrders: 32, totalSpent: 19800, lastVisit: "2024-01-19", avgOrderValue: 619, loyaltyTier: "silver" },
  { id: "C003", name: "Amit Patel", phone: "+91 76543 21098", email: "amit@email.com", totalOrders: 67, totalSpent: 45600, lastVisit: "2024-01-21", avgOrderValue: 680, loyaltyTier: "platinum" },
  { id: "C004", name: "Sunita Verma", phone: "+91 65432 10987", email: "sunita@email.com", totalOrders: 23, totalSpent: 12400, lastVisit: "2024-01-18", avgOrderValue: 539, loyaltyTier: "bronze" },
  { id: "C005", name: "Vikram Singh", phone: "+91 54321 09876", email: "vikram@email.com", totalOrders: 51, totalSpent: 34200, lastVisit: "2024-01-20", avgOrderValue: 671, loyaltyTier: "gold" },
  { id: "C006", name: "Meera Joshi", phone: "+91 43210 98765", email: "meera@email.com", totalOrders: 18, totalSpent: 8900, lastVisit: "2024-01-15", avgOrderValue: 494, loyaltyTier: "bronze" },
];

const customerPurchases: Record<string, Purchase[]> = {
  "C001": [
    { id: "INV001", date: "2024-01-20", items: ["Paracetamol 500mg", "Vitamin D3", "Cough Syrup"], total: 850, paymentMethod: "UPI" },
    { id: "INV002", date: "2024-01-15", items: ["Antacid Tablets", "Bandages"], total: 320, paymentMethod: "Cash" },
    { id: "INV003", date: "2024-01-10", items: ["Amoxicillin 250mg", "Multivitamins"], total: 1200, paymentMethod: "Card" },
  ],
  "C002": [
    { id: "INV004", date: "2024-01-19", items: ["Baby Diapers", "Baby Oil", "Cotton Pads"], total: 1450, paymentMethod: "UPI" },
    { id: "INV005", date: "2024-01-12", items: ["Fever Medicine", "Thermometer"], total: 580, paymentMethod: "Cash" },
  ],
  "C003": [
    { id: "INV006", date: "2024-01-21", items: ["Insulin", "Blood Glucose Strips", "Lancets"], total: 2800, paymentMethod: "Card" },
    { id: "INV007", date: "2024-01-14", items: ["BP Monitor Cuff", "Medicines"], total: 1650, paymentMethod: "UPI" },
  ],
};

const getLoyaltyBadge = (tier: string) => {
  switch (tier) {
    case "platinum":
      return <Badge className="bg-chart-1/10 text-chart-1 border-0">Platinum</Badge>;
    case "gold":
      return <Badge className="bg-chart-4/10 text-chart-4 border-0">Gold</Badge>;
    case "silver":
      return <Badge className="bg-muted text-muted-foreground border-0">Silver</Badge>;
    case "bronze":
      return <Badge className="bg-primary/10 text-primary border-0">Bronze</Badge>;
    default:
      return <Badge variant="secondary">{tier}</Badge>;
  }
};

const downloadCustomerReport = () => {
  const data = {
    reportType: "customer-history",
    generatedAt: new Date().toISOString(),
    summary: {
      totalCustomers: customers.length,
      totalRevenue: customers.reduce((a, b) => a + b.totalSpent, 0),
      avgLifetimeValue: Math.round(customers.reduce((a, b) => a + b.totalSpent, 0) / customers.length),
    },
    customers: customers,
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `customer-history-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const CustomerHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={downloadCustomerReport} className="gap-2">
          <Download className="h-4 w-4" />
          Export Customers
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold text-foreground">{customers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-2/10">
                <ShoppingBag className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-foreground">₹{customers.reduce((a, b) => a + b.totalSpent, 0).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-4/10">
                <TrendingUp className="h-5 w-5 text-chart-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Lifetime Value</p>
                <p className="text-2xl font-bold text-foreground">₹{Math.round(customers.reduce((a, b) => a + b.totalSpent, 0) / customers.length).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Customer List</CardTitle>
          <CardDescription>View and manage your customer relationships</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-center">Orders</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead className="text-center">Tier</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">{customer.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{customer.name}</p>
                          <p className="text-xs text-muted-foreground">{customer.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm text-foreground">{customer.phone}</p>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">{customer.totalOrders}</TableCell>
                    <TableCell className="text-right font-medium">₹{customer.totalSpent.toLocaleString()}</TableCell>
                    <TableCell className="text-center">{getLoyaltyBadge(customer.loyaltyTier)}</TableCell>
                    <TableCell className="text-muted-foreground">{customer.lastVisit}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(customer)}>
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-lg font-medium text-primary">{customer.name.charAt(0)}</span>
                              </div>
                              {customer.name}
                              {getLoyaltyBadge(customer.loyaltyTier)}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{customer.phone}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Last visit: {customer.lastVisit}</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <Card className="border-border">
                                <CardContent className="pt-4 pb-4">
                                  <p className="text-xs text-muted-foreground">Total Orders</p>
                                  <p className="text-xl font-bold">{customer.totalOrders}</p>
                                </CardContent>
                              </Card>
                              <Card className="border-border">
                                <CardContent className="pt-4 pb-4">
                                  <p className="text-xs text-muted-foreground">Total Spent</p>
                                  <p className="text-xl font-bold">₹{customer.totalSpent.toLocaleString()}</p>
                                </CardContent>
                              </Card>
                              <Card className="border-border">
                                <CardContent className="pt-4 pb-4">
                                  <p className="text-xs text-muted-foreground">Avg Order</p>
                                  <p className="text-xl font-bold">₹{customer.avgOrderValue}</p>
                                </CardContent>
                              </Card>
                            </div>
                            <div>
                              <h4 className="font-medium mb-3">Recent Purchases</h4>
                              <div className="space-y-2">
                                {(customerPurchases[customer.id] || []).map((purchase) => (
                                  <div key={purchase.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <div>
                                      <p className="text-sm font-medium">{purchase.id}</p>
                                      <p className="text-xs text-muted-foreground">{purchase.items.join(", ")}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">₹{purchase.total}</p>
                                      <p className="text-xs text-muted-foreground">{purchase.date}</p>
                                    </div>
                                  </div>
                                ))}
                                {!customerPurchases[customer.id] && (
                                  <p className="text-sm text-muted-foreground text-center py-4">No purchase history available</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
