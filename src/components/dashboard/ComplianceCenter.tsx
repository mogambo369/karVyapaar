import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ban, Clock, AlertTriangle, FileText, Download, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const complianceStats = [
  { label: "Banned Medicines", count: 3, icon: Ban, variant: "destructive" as const },
  { label: "Expired Stock", count: 2, icon: Clock, variant: "warning" as const },
  { label: "Expiring Soon", count: 5, icon: AlertTriangle, variant: "warning" as const },
  { label: "CDSCO Orders", count: 1, icon: FileText, variant: "default" as const },
];

const restrictedMedicines = [
  { name: "Paracetamol 500mg", reason: "Failed dissolution test", source: "CDSCO" },
  { name: "Cough Syrup ABC", reason: "Contamination risk", source: "MANUAL" },
  { name: "Aspirin 100mg", reason: "Substandard quality", source: "STATE_DRUG_CONTROL" },
];

const expiryAlerts = [
  { name: "Paracetamol 650mg", batch: "BATCH005", daysLeft: -7, action: "DISPOSE NOW" },
  { name: "Cough Syrup", batch: "BATCH004", daysLeft: 1, action: "DISPOSE NOW" },
  { name: "Amoxicillin 500mg", batch: "BATCH001", daysLeft: 8, action: "MARK CLEARANCE" },
  { name: "Ibuprofen 200mg", batch: "BATCH002", daysLeft: 13, action: "MARK CLEARANCE" },
  { name: "Vitamin C Tablets", batch: "BATCH003", daysLeft: 82, action: "MONITOR" },
];

const statVariantStyles = {
  destructive: "bg-destructive/10 border-destructive/20 text-destructive",
  warning: "bg-warning/10 border-warning/20 text-warning",
  default: "bg-muted border-border text-muted-foreground",
};

const getExpiryBadgeStyle = (days: number) => {
  if (days < 0) return "bg-destructive text-destructive-foreground";
  if (days <= 7) return "bg-destructive text-destructive-foreground";
  if (days <= 14) return "bg-warning text-warning-foreground";
  return "bg-success text-success-foreground";
};

const getExpiryText = (days: number) => {
  if (days < 0) return `Expired ${Math.abs(days)} days ago`;
  return `${days} days left`;
};

export const ComplianceCenter = () => {
  return (
    <Card className="col-span-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <Ban className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                Pharmacy Compliance Center
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Medicine regulatory compliance and billing safety gate
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Deduction Report
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {complianceStats.map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "p-4 rounded-lg border flex items-center justify-between",
                statVariantStyles[stat.variant]
              )}
            >
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.count}</p>
              </div>
              <stat.icon className="h-5 w-5 opacity-70" />
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Restricted Medicines */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Ban className="h-4 w-4 text-destructive" />
              Restricted Medicines
            </h4>
            <div className="space-y-2">
              {restrictedMedicines.map((med) => (
                <div
                  key={med.name}
                  className="p-3 bg-card rounded-lg border flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-sm">{med.name}</p>
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {med.reason}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {med.source}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Expiry Alerts */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              Expiry Alerts
            </h4>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {expiryAlerts.map((item) => (
                <div
                  key={item.batch}
                  className="p-3 bg-card rounded-lg border flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Batch: {item.batch}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Prepare for: {item.action}
                    </p>
                  </div>
                  <Badge className={cn("text-xs", getExpiryBadgeStyle(item.daysLeft))}>
                    {getExpiryText(item.daysLeft)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
