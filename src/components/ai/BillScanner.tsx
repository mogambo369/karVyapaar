import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Camera, Upload, Loader2, Check, X, FileImage } from "lucide-react";
import { useAIFeatures } from "@/hooks/useAIFeatures";
import { useAddProduct } from "@/hooks/useProducts";
import { toast } from "sonner";

interface StockEntry {
  name: string;
  quantity: number;
  unit: string;
  price: number;
  category: string;
}

export const BillScanner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scanResults, setScanResults] = useState<StockEntry[]>([]);
  const [notes, setNotes] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const { scanBill, isScanning } = useAIFeatures();
  const addProduct = useAddProduct();

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(",")[1];
      setImagePreview(reader.result as string);
      setScanResults([]);
      setNotes("");

      const result = await scanBill(base64);
      setScanResults(result.entries || []);
      if (result.notes) {
        setNotes(result.notes);
      }
    };
    reader.readAsDataURL(file);
  }, [scanBill]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleAddToInventory = async (entry: StockEntry) => {
    try {
      await addProduct.mutateAsync({
        name: entry.name,
        barcode: `AUTO-${Date.now()}`,
        category: entry.category || "Grocery",
        price: entry.price || 0,
        cost_price: (entry.price || 0) * 0.8,
        stock: entry.quantity,
        min_stock: Math.ceil(entry.quantity * 0.2),
        unit: entry.unit || "piece",
        gst_rate: 18,
        expiry_date: null,
        batch_number: null,
        is_banned: false,
        ban_reason: null,
        ban_source: null,
      });
      
      setScanResults(prev => prev.filter(e => e.name !== entry.name));
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const handleAddAllToInventory = async () => {
    for (const entry of scanResults) {
      await handleAddToInventory(entry);
    }
    toast.success("All items added to inventory!");
    setIsOpen(false);
    setImagePreview(null);
    setScanResults([]);
  };

  const handleClose = () => {
    setIsOpen(false);
    setImagePreview(null);
    setScanResults([]);
    setNotes("");
  };

  return (
    <>
      <Button
        variant="outline"
        className="h-auto flex-col gap-2 p-4"
        onClick={() => setIsOpen(true)}
      >
        <FileImage className="h-5 w-5" />
        <div className="text-center">
          <p className="font-medium text-sm">Scan Bill</p>
          <p className="text-xs opacity-70">AI-powered entry</p>
        </div>
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5 text-primary" />
              Scan Handwritten Bill
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Upload Options */}
            {!imagePreview && (
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-32 flex-col gap-2"
                  onClick={handleCameraClick}
                >
                  <Camera className="h-8 w-8 text-primary" />
                  <span>Take Photo</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-32 flex-col gap-2"
                  onClick={handleUploadClick}
                >
                  <Upload className="h-8 w-8 text-primary" />
                  <span>Upload Image</span>
                </Button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Bill preview"
                  className="w-full max-h-48 object-contain rounded-lg border border-border"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setImagePreview(null);
                    setScanResults([]);
                    setNotes("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Loading State */}
            {isScanning && (
              <div className="flex items-center justify-center gap-2 py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-muted-foreground">AI is reading the bill...</span>
              </div>
            )}

            {/* Results */}
            {scanResults.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Check className="h-4 w-4 text-success" />
                    Found {scanResults.length} Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {scanResults.map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{entry.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.quantity} {entry.unit} • ₹{entry.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{entry.category}</Badge>
                        <Button
                          size="sm"
                          onClick={() => handleAddToInventory(entry)}
                          disabled={addProduct.isPending}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {notes && (
              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-sm text-warning-foreground">{notes}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            {scanResults.length > 0 && (
              <Button onClick={handleAddAllToInventory} disabled={addProduct.isPending}>
                Add All to Inventory
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
