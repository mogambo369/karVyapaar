import { Header } from "@/components/dashboard/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SalesChart } from "@/components/dashboard/SalesChart";
import { ProfitChart } from "@/components/dashboard/ProfitChart";
import { ComplianceCenter } from "@/components/dashboard/ComplianceCenter";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { Button } from "@/components/ui/button";
import {
  IndianRupee,
  ShoppingCart,
  Package,
  TrendingUp,
  ArrowRight,
  Play,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-market.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Indian wholesale market"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>

        {/* Animated Circles */}
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-primary/20 blur-3xl animate-float-slow" />
        <div className="absolute bottom-20 right-40 w-48 h-48 rounded-full bg-primary/30 blur-2xl animate-float" />
        <div className="absolute top-40 right-1/3 w-32 h-32 rounded-full bg-primary/10 blur-xl animate-float-slow" style={{ animationDelay: '1s' }} />
        
        {/* Pulsing Ring */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-pulse-ring" />
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
            <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-pulse-ring" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-fade-in">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              AI-Powered Business Management
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-slide-up">
              Grow your business with{" "}
              <span className="text-primary">smart tools</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Manage inventory, billing, and compliance effortlessly. 
              Built for Indian shopkeepers with voice commands and offline support.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Button 
                size="lg" 
                className="gap-2 px-6"
                onClick={() => navigate("/billing")}
              >
                Start Billing
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2 px-6"
                onClick={() => navigate("/inventory")}
              >
                <Play className="w-4 h-4" />
                View Inventory
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="relative -mt-8 z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary text-primary-foreground">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">Billing Service</h3>
                  <p className="text-sm text-muted-foreground">GST-compliant invoicing</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-lg border border-border hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary text-primary-foreground">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">Inventory Control</h3>
                  <p className="text-sm text-muted-foreground">Smart stock management</p>
                </div>
              </div>
            </div>
            <div className="bg-primary rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary-foreground/20 text-primary-foreground">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-foreground">Analytics</h3>
                  <p className="text-sm text-primary-foreground/80">Business insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <main className="container mx-auto px-4 py-12 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary/10 via-accent to-primary/5 rounded-xl p-6 border border-primary/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Welcome back, Rajesh!
              </h2>
              <p className="text-muted-foreground mt-1">
                Your store is performing 12% better than last week. Keep up the great work!
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
            karVyapaar - Your Digital Business Partner | Works offline • 
            Supports voice input • Built for India
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
