import { Header } from "@/components/dashboard/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { ProfitChart } from "@/components/dashboard/ProfitChart";
import { ComplianceCenter } from "@/components/dashboard/ComplianceCenter";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import {
  IndianRupee,
  ShoppingCart,
  Package,
  TrendingUp,
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary/10 via-accent to-primary/5 rounded-xl p-6 border border-primary/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                नमस्ते, राजेश जी! 🙏
              </h2>
              <p className="text-muted-foreground mt-1">
                आज का व्यापार शुभ हो। Your store is performing 12% better than last week.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 px-3 py-1 bg-success/10 text-success rounded-full">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                Online Mode
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Today's Sales"
            value="₹24,500"
            icon={IndianRupee}
            trend={{ value: 12, isPositive: true }}
            variant="primary"
          />
          <StatsCard
            title="Orders"
            value="47"
            icon={ShoppingCart}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Low Stock Items"
            value="12"
            icon={Package}
            variant="warning"
          />
          <StatsCard
            title="Monthly Profit"
            value="₹1.2L"
            icon={TrendingUp}
            trend={{ value: 15, isPositive: true }}
            variant="success"
          />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          <SalesChart />
          <ProfitChart />
        </div>

        {/* Recent Transactions */}
        <RecentTransactions />

        {/* Compliance Center */}
        <ComplianceCenter />

        {/* Footer */}
        <footer className="text-center py-6 text-sm text-muted-foreground border-t border-border">
          <p>
            karVyapaar - आपके व्यापार का डिजिटल साथी | Works offline • 
            Supports Hindi voice input • Built for Bharat 🇮🇳
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
