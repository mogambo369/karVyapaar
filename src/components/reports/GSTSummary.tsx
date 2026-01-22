import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Calendar, FileText, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const gstData = [
  { month: "January 2024", salesGst: 22410, purchaseGst: 17100, netPayable: 5310, status: "paid", dueDate: "20 Feb 2024" },
  { month: "February 2024", salesGst: 24120, purchaseGst: 18540, netPayable: 5580, status: "paid", dueDate: "20 Mar 2024" },
  { month: "March 2024", salesGst: 28160, purchaseGst: 21320, netPayable: 6840, status: "paid", dueDate: "20 Apr 2024" },
  { month: "April 2024", salesGst: 26020, purchaseGst: 19840, netPayable: 6180, status: "paid", dueDate: "20 May 2024" },
  { month: "May 2024", salesGst: 30120, purchaseGst: 22680, netPayable: 7440, status: "pending", dueDate: "20 Jun 2024" },
  { month: "June 2024", salesGst: 32080, purchaseGst: 24160, netPayable: 7920, status: "due", dueDate: "20 Jul 2024" },
];

const invoiceBreakdown = [
  { category: "GST @ 5%", taxableValue: 89000, gstAmount: 4450 },
  { category: "GST @ 12%", taxableValue: 156000, gstAmount: 18720 },
  { category: "GST @ 18%", taxableValue: 234000, gstAmount: 42120 },
  { category: "GST @ 28%", taxableValue: 45000, gstAmount: 12600 },
];

const downloadGSTReport = (period: string) => {
  const data = {
    reportType: "gst-summary",
    period: period,
    generatedAt: new Date().toISOString(),
    gstin: "07AAACR5055K1Z5",
    summary: {
      totalSalesGst: 162910,
      totalPurchaseGst: 123640,
      netGstPayable: 39270,
    },
    monthlyData: gstData,
    invoiceBreakdown: invoiceBreakdown,
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `gst-summary-${period}-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "paid":
      return <Badge className="bg-chart-2/10 text-chart-2 border-0"><CheckCircle className="h-3 w-3 mr-1" />Paid</Badge>;
    case "pending":
      return <Badge className="bg-chart-4/10 text-chart-4 border-0"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    case "due":
      return <Badge className="bg-destructive/10 text-destructive border-0"><AlertCircle className="h-3 w-3 mr-1" />Due</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const GSTSummary = () => {
  const [period, setPeriod] = useState("fy2024");

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="bg-card border border-border">
              <SelectItem value="q1">Q1 (Apr-Jun)</SelectItem>
              <SelectItem value="q2">Q2 (Jul-Sep)</SelectItem>
              <SelectItem value="q3">Q3 (Oct-Dec)</SelectItem>
              <SelectItem value="q4">Q4 (Jan-Mar)</SelectItem>
              <SelectItem value="fy2024">FY 2024-25</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => downloadGSTReport(period)} className="gap-2">
          <Download className="h-4 w-4" />
          Download GSTR-3B
        </Button>
      </div>

      {/* GSTIN Card */}
      <Card className="border-border bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">GSTIN</p>
                <p className="text-lg font-mono font-bold text-foreground">07AAACR5055K1Z5</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-muted-foreground">Registration Status</p>
              <Badge className="bg-chart-2/10 text-chart-2 border-0 mt-1">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Output GST (Sales)</p>
            <p className="text-2xl font-bold text-foreground">₹1,62,910</p>
            <p className="text-xs text-muted-foreground mt-1">Total GST collected on sales</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Input GST (Purchases)</p>
            <p className="text-2xl font-bold text-foreground">₹1,23,640</p>
            <p className="text-xs text-muted-foreground mt-1">Total GST paid on purchases</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Net GST Payable</p>
            <p className="text-2xl font-bold text-primary">₹39,270</p>
            <p className="text-xs text-muted-foreground mt-1">Amount payable to government</p>
          </CardContent>
        </Card>
      </div>

      {/* GST Breakdown by Rate */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">GST by Tax Rate</CardTitle>
          <CardDescription>Breakdown of sales by GST slab</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>GST Slab</TableHead>
                  <TableHead className="text-right">Taxable Value</TableHead>
                  <TableHead className="text-right">GST Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceBreakdown.map((item) => (
                  <TableRow key={item.category}>
                    <TableCell className="font-medium">{item.category}</TableCell>
                    <TableCell className="text-right">₹{item.taxableValue.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium">₹{item.gstAmount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell className="text-right font-bold">₹{invoiceBreakdown.reduce((a, b) => a + b.taxableValue, 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold">₹{invoiceBreakdown.reduce((a, b) => a + b.gstAmount, 0).toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Monthly GST Summary */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Monthly GST Summary</CardTitle>
          <CardDescription>Track your monthly GST liability and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Output GST</TableHead>
                  <TableHead className="text-right">Input GST</TableHead>
                  <TableHead className="text-right">Net Payable</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gstData.map((row) => (
                  <TableRow key={row.month}>
                    <TableCell className="font-medium">{row.month}</TableCell>
                    <TableCell className="text-right">₹{row.salesGst.toLocaleString()}</TableCell>
                    <TableCell className="text-right">₹{row.purchaseGst.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium">₹{row.netPayable.toLocaleString()}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(row.status)}</TableCell>
                    <TableCell className="text-muted-foreground">{row.dueDate}</TableCell>
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
