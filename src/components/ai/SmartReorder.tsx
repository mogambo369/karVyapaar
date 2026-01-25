import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Loader2, Copy, ExternalLink, AlertTriangle } from "lucide-react";
import { useAIFeatures } from "@/hooks/useAIFeatures";
import { useLowStockProducts } from "@/hooks/useProducts";
import { toast } from "sonner";

export const SmartReorder = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [distributorName, setDistributorName] = useState("");
  const [distributorPhone, setDistributorPhone] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [summary, setSummary] = useState("");

  const { generateReorderMessage, isGeneratingReorder } = useAIFeatures();
  const { data: lowStockProducts, isLoading } = useLowStockProducts();

  const handleGenerate = async () => {
    if (!lowStockProducts || lowStockProducts.length === 0) {
      toast.info("No low stock items to reorder");
      return;
    }

    const result = await generateReorderMessage(
      lowStockProducts.map(p => ({
        name: p.name,
        stock: p.stock,
        min_stock: p.min_stock,
        category: p.category,
        unit: p.unit,
      })),
      distributorName || undefined
    );

    if (result.whatsappMessage) {
      setWhatsappMessage(result.whatsappMessage);
      setSummary(result.summary || "");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappMessage);
    toast.success("Message copied to clipboard!");
  };

  const handleOpenWhatsApp = () => {
    const phone = distributorPhone.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const url = phone 
      ? `https://wa.me/91${phone}?text=${encodedMessage}`
      : `https://wa.me/?text=${encodedMessage}`;
    window.open(url, "_blank");
  };

  const handleClose = () => {
    setIsOpen(false);
    setWhatsappMessage("");
    setSummary("");
  };

  return (
    <>
      <Button
        variant="outline"
        className="h-auto flex-col gap-2 p-4"
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-5 w-5" />
        <div className="text-center">
          <p className="font-medium text-sm">Smart Reorder</p>
          <p className="text-xs opacity-70">Auto WhatsApp order</p>
        </div>
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Smart Reorder
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Low Stock Summary */}
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : lowStockProducts && lowStockProducts.length > 0 ? (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    {lowStockProducts.length} Items Need Reordering
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {lowStockProducts.slice(0, 8).map((product) => (
                      <Badge key={product.id} variant="outline" className="text-xs">
                        {product.name} ({product.stock}/{product.min_stock})
                      </Badge>
                    ))}
                    {lowStockProducts.length > 8 && (
                      <Badge variant="secondary" className="text-xs">
                        +{lowStockProducts.length - 8} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                All items are well stocked! 🎉
              </div>
            )}

            {/* Distributor Info */}
            {lowStockProducts && lowStockProducts.length > 0 && (
              <div className="space-y-3">
                <Input
                  placeholder="Distributor Name (e.g., Sharma Traders)"
                  value={distributorName}
                  onChange={(e) => setDistributorName(e.target.value)}
                />
                <Input
                  placeholder="WhatsApp Number (10 digits)"
                  value={distributorPhone}
                  onChange={(e) => setDistributorPhone(e.target.value)}
                  maxLength={10}
                />
                <Button 
                  className="w-full" 
                  onClick={handleGenerate}
                  disabled={isGeneratingReorder}
                >
                  {isGeneratingReorder ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Order Message"
                  )}
                </Button>
              </div>
            )}

            {/* Generated Message */}
            {whatsappMessage && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Generated Message:</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
                {summary && (
                  <p className="text-sm text-muted-foreground">{summary}</p>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            {whatsappMessage && (
              <Button onClick={handleOpenWhatsApp} className="w-full gap-2">
                <ExternalLink className="h-4 w-4" />
                Open in WhatsApp
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
