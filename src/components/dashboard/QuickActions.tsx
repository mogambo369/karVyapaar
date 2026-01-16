import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Receipt, 
  Package, 
  TrendingUp, 
  FileText, 
  Mic, 
  Barcode,
  Upload 
} from "lucide-react";

const actions = [
  {
    label: "New Bill",
    description: "Create customer invoice",
    icon: Receipt,
    variant: "default" as const,
  },
  {
    label: "Add Stock",
    description: "Update inventory",
    icon: Package,
    variant: "outline" as const,
  },
  {
    label: "Scan Barcode",
    description: "Quick product lookup",
    icon: Barcode,
    variant: "outline" as const,
  },
  {
    label: "Voice Input",
    description: "Speak to add items",
    icon: Mic,
    variant: "outline" as const,
  },
  {
    label: "View Reports",
    description: "Analytics & insights",
    icon: TrendingUp,
    variant: "outline" as const,
  },
  {
    label: "Upload Data",
    description: "Import CSV/Excel",
    icon: Upload,
    variant: "outline" as const,
  },
];

export const QuickActions = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <Button
              key={action.label}
              variant={index === 0 ? "default" : "outline"}
              className="h-auto flex-col gap-2 p-4"
            >
              <action.icon className="h-5 w-5" />
              <div className="text-center">
                <p className="font-medium text-sm">{action.label}</p>
                <p className="text-xs opacity-70">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
