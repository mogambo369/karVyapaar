import { Header } from "@/components/dashboard/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BannedMedicines } from "@/components/compliance/BannedMedicines";
import { ExpiryTracking } from "@/components/compliance/ExpiryTracking";
import { RegulatoryAlerts } from "@/components/compliance/RegulatoryAlerts";
import { ShieldAlert, CalendarClock, Bell, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Compliance = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-destructive/10 rounded-full mb-4">
            <Shield className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">Compliance Center</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Stay compliant with pharmaceutical regulations. Monitor banned medicines, track expiries, and receive alerts.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-5 w-5 text-destructive" />
                <div>
                  <p className="text-sm text-muted-foreground">Banned Items</p>
                  <p className="text-2xl font-bold text-destructive">24</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-chart-4/20 bg-chart-4/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CalendarClock className="h-5 w-5 text-chart-4" />
                <div>
                  <p className="text-sm text-muted-foreground">Expiring Soon</p>
                  <p className="text-2xl font-bold text-chart-4">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                  <p className="text-2xl font-bold text-primary">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="banned" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto gap-2 bg-transparent p-0 mb-8">
            <TabsTrigger 
              value="banned" 
              className="flex items-center gap-2 py-3 px-4 border border-border rounded-lg data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground data-[state=active]:border-destructive bg-card hover:bg-muted transition-colors"
            >
              <ShieldAlert className="h-4 w-4" />
              <span className="hidden sm:inline">Banned Medicines</span>
              <span className="sm:hidden">Banned</span>
            </TabsTrigger>
            <TabsTrigger 
              value="expiry" 
              className="flex items-center gap-2 py-3 px-4 border border-border rounded-lg data-[state=active]:bg-chart-4 data-[state=active]:text-white data-[state=active]:border-chart-4 bg-card hover:bg-muted transition-colors"
            >
              <CalendarClock className="h-4 w-4" />
              <span className="hidden sm:inline">Expiry Tracking</span>
              <span className="sm:hidden">Expiry</span>
            </TabsTrigger>
            <TabsTrigger 
              value="alerts" 
              className="flex items-center gap-2 py-3 px-4 border border-border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary bg-card hover:bg-muted transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Regulatory Alerts</span>
              <span className="sm:hidden">Alerts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="banned" className="mt-0">
            <BannedMedicines />
          </TabsContent>
          <TabsContent value="expiry" className="mt-0">
            <ExpiryTracking />
          </TabsContent>
          <TabsContent value="alerts" className="mt-0">
            <RegulatoryAlerts />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Compliance;
