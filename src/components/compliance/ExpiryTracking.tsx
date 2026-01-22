import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, AlertTriangle, Clock, Calendar, Package, Trash2, Download } from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ExpiringProduct {
  id: string;
  name: string;
  batch: string;
  quantity: number;
  expiryDate: string;
  daysLeft: number;
  category: string;
  mrp: number;
}

const expiringProducts: ExpiringProduct[] = [
  { id: "E001", name: "Amoxicillin 500mg", batch: "AMX2024A", quantity: 45, expiryDate: "2024-02-15", daysLeft: 3, category: "Antibiotic", mrp: 120 },
  { id: "E002", name: "Cough Syrup 100ml", batch: "CS2024B", quantity: 23, expiryDate: "2024-02-18", daysLeft: 6, category: "OTC", mrp: 85 },
  { id: "E003", name: "Vitamin B Complex", batch: "VBC2024C", quantity: 156, expiryDate: "2024-02-28", daysLeft: 16, category: "Supplement", mrp: 45 },
  { id: "E004", name: "Paracetamol 650mg", batch: "PCM2024D", quantity: 89, expiryDate: "2024-03-10", daysLeft: 27, category: "Analgesic", mrp: 30 },
  { id: "E005", name: "Antacid Gel", batch: "AG2024E", quantity: 34, expiryDate: "2024-03-15", daysLeft: 32, category: "GI", mrp: 65 },
  { id: "E006", name: "Eye Drops 10ml", batch: "ED2024F", quantity: 67, expiryDate: "2024-03-20", daysLeft: 37, category: "Ophthalmic", mrp: 95 },
  { id: "E007", name: "Insulin Vial", batch: "INS2024G", quantity: 12, expiryDate: "2024-03-25", daysLeft: 42, category: "Hormone", mrp: 450 },
  { id: "E008", name: "Multivitamin Tablets", batch: "MVT2024H", quantity: 234, expiryDate: "2024-04-01", daysLeft: 49, category: "Supplement", mrp: 180 },
  { id: "E009", name: "Blood Pressure Tablets", batch: "BP2024I", quantity: 78, expiryDate: "2024-04-10", daysLeft: 58, category: "Cardiovascular", mrp: 250 },
  { id: "E010", name: "Antibacterial Cream", batch: "ABC2024J", quantity: 45, expiryDate: "2024-04-20", daysLeft: 68, category: "Topical", mrp: 75 },
  { id: "E011", name: "Digestive Enzymes", batch: "DE2024K", quantity: 123, expiryDate: "2024-05-01", daysLeft: 79, category: "GI", mrp: 145 },
  { id: "E012", name: "Calcium Supplements", batch: "CS2024L", quantity: 89, expiryDate: "2024-05-15", daysLeft: 93, category: "Supplement", mrp: 165 },
];

const getExpiryStatus = (daysLeft: number) => {
  if (daysLeft <= 7) return { label: "Critical", color: "bg-destructive text-destructive-foreground", progressColor: "bg-destructive" };
  if (daysLeft <= 30) return { label: "Warning", color: "bg-chart-4/10 text-chart-4", progressColor: "bg-chart-4" };
  if (daysLeft <= 60) return { label: "Attention", color: "bg-primary/10 text-primary", progressColor: "bg-primary" };
  return { label: "Safe", color: "bg-chart-2/10 text-chart-2", progressColor: "bg-chart-2" };
};

export const ExpiryTracking = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredProducts = expiringProducts
    .filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((p) => {
      if (filterStatus === "all") return true;
      if (filterStatus === "critical") return p.daysLeft <= 7;
      if (filterStatus === "warning") return p.daysLeft > 7 && p.daysLeft <= 30;
      if (filterStatus === "attention") return p.daysLeft > 30 && p.daysLeft <= 60;
      return p.daysLeft > 60;
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const criticalCount = expiringProducts.filter(p => p.daysLeft <= 7).length;
  const warningCount = expiringProducts.filter(p => p.daysLeft > 7 && p.daysLeft <= 30).length;
  const attentionCount = expiringProducts.filter(p => p.daysLeft > 30 && p.daysLeft <= 60).length;
  const totalValue = expiringProducts.filter(p => p.daysLeft <= 30).reduce((a, b) => a + (b.quantity * b.mrp), 0);

  const downloadExpiryReport = () => {
    const data = {
      reportType: "expiry-tracking",
      generatedAt: new Date().toISOString(),
      summary: {
        critical: criticalCount,
        warning: warningCount,
        attention: attentionCount,
        totalAtRiskValue: totalValue,
      },
      products: expiringProducts,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expiry-report-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {criticalCount > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              <div>
                <h3 className="font-semibold text-destructive">Immediate Action Required</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {criticalCount} product{criticalCount > 1 ? "s" : ""} will expire within 7 days. 
                  Consider returning to distributor or offering discounts before expiry.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-destructive/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Critical (&lt;7 days)</p>
                <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-chart-4/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-4/10">
                <Clock className="h-5 w-5 text-chart-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Warning (7-30 days)</p>
                <p className="text-2xl font-bold text-chart-4">{warningCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attention (30-60 days)</p>
                <p className="text-2xl font-bold text-primary">{attentionCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">At-Risk Value</p>
                <p className="text-2xl font-bold text-foreground">₹{totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-card border border-border">
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="critical">Critical Only</SelectItem>
              <SelectItem value="warning">Warning Only</SelectItem>
              <SelectItem value="attention">Attention Only</SelectItem>
              <SelectItem value="safe">Safe Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={downloadExpiryReport} className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Products Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Expiry Timeline
          </CardTitle>
          <CardDescription>Products sorted by expiry date (earliest first)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Days Left</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Value at Risk</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const status = getExpiryStatus(product.daysLeft);
                  const maxDays = 90;
                  const progressValue = Math.min(100, (product.daysLeft / maxDays) * 100);
                  
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{product.batch}</code>
                      </TableCell>
                      <TableCell className="text-center font-medium">{product.quantity}</TableCell>
                      <TableCell className="text-muted-foreground">{product.expiryDate}</TableCell>
                      <TableCell>
                        <div className="w-24 space-y-1">
                          <Progress value={progressValue} className="h-2" />
                          <p className="text-xs text-center">{product.daysLeft} days</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={status.color}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{(product.quantity * product.mrp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
