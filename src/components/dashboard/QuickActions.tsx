import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Receipt, 
  Package, 
  TrendingUp, 
  Barcode,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BillScanner } from "@/components/ai/BillScanner";
import { VoiceCommand } from "@/components/ai/VoiceCommand";
import { SmartReorder } from "@/components/ai/SmartReorder";

export const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Button
            variant="default"
            className="h-auto flex-col gap-2 p-4"
            onClick={() => navigate("/billing")}
          >
            <Receipt className="h-5 w-5" />
            <div className="text-center">
              <p className="font-medium text-sm">New Bill</p>
              <p className="text-xs opacity-70">Create invoice</p>
            </div>
          </Button>
          
          {/* AI Bill Scanner */}
          <BillScanner />
          
          {/* AI Voice Command */}
          <VoiceCommand />
          
          {/* AI Smart Reorder */}
          <SmartReorder />
          
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
            onClick={() => navigate("/reports")}
          >
            <TrendingUp className="h-5 w-5" />
            <div className="text-center">
              <p className="font-medium text-sm">Reports</p>
              <p className="text-xs opacity-70">Analytics</p>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto flex-col gap-2 p-4"
            onClick={() => navigate("/compliance")}
          >
            <Package className="h-5 w-5" />
            <div className="text-center">
              <p className="font-medium text-sm">Inventory</p>
              <p className="text-xs opacity-70">Stock check</p>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
