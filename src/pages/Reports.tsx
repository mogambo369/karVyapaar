import { Header } from "@/components/dashboard/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesReport } from "@/components/reports/SalesReport";
import { ProfitAnalysis } from "@/components/reports/ProfitAnalysis";
import { GSTSummary } from "@/components/reports/GSTSummary";
import { CustomerHistory } from "@/components/reports/CustomerHistory";
import { BarChart3, TrendingUp, Receipt, Users } from "lucide-react";

const Reports = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section - Khoj inspired */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">Reports</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Insights that help you understand your business. Clear data, actionable intelligence.
          </p>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="sales" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 bg-transparent p-0 mb-8">
            <TabsTrigger 
              value="sales" 
              className="flex items-center gap-2 py-3 px-4 border border-border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary bg-card hover:bg-muted transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Sales Report</span>
              <span className="sm:hidden">Sales</span>
            </TabsTrigger>
            <TabsTrigger 
              value="profit" 
              className="flex items-center gap-2 py-3 px-4 border border-border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary bg-card hover:bg-muted transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Profit Analysis</span>
              <span className="sm:hidden">Profit</span>
            </TabsTrigger>
            <TabsTrigger 
              value="gst" 
              className="flex items-center gap-2 py-3 px-4 border border-border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary bg-card hover:bg-muted transition-colors"
            >
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">GST Summary</span>
              <span className="sm:hidden">GST</span>
            </TabsTrigger>
            <TabsTrigger 
              value="customers" 
              className="flex items-center gap-2 py-3 px-4 border border-border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary bg-card hover:bg-muted transition-colors"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Customer History</span>
              <span className="sm:hidden">Customers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="mt-0">
            <SalesReport />
          </TabsContent>
          <TabsContent value="profit" className="mt-0">
            <ProfitAnalysis />
          </TabsContent>
          <TabsContent value="gst" className="mt-0">
            <GSTSummary />
          </TabsContent>
          <TabsContent value="customers" className="mt-0">
            <CustomerHistory />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Reports;
