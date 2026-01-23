import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Barcode, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts";
import { useBannedMedicines } from "@/hooks/useCompliance";
import { toast } from "sonner";

export interface Product {
  id: string;
  barcode: string;
  name: string;
  category: string;
  price: number;
  cost_price: number;
  stock: number;
  min_stock: number;
  unit: string;
  gst_rate: number;
  expiry_date: string | null;
  batch_number: string | null;
  is_banned: boolean;
  ban_reason: string | null;
  ban_source: string | null;
  created_at: string;
  updated_at: string;
}

interface ProductSearchProps {
  onAddToCart: (product: Product) => void;
}

export const ProductSearch = ({ onAddToCart }: ProductSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [scanMode, setScanMode] = useState(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: products = [], isLoading } = useProducts();
  const { data: bannedMedicines = [] } = useBannedMedicines();

  const bannedNames = bannedMedicines.map((m) => m.name.toLowerCase());

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode.includes(searchQuery);
    return matchesSearch && !product.is_banned;
  });

  useEffect(() => {
    if (scanMode && barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, [scanMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.barcode === barcodeInput);
    if (product) {
      if (
        product.is_banned ||
        bannedNames.some((name) => product.name.toLowerCase().includes(name))
      ) {
        toast.error(`Cannot add ${product.name} - This product is banned/restricted`);
        setBarcodeInput("");
        return;
      }
      onAddToCart(product);
      setBarcodeInput("");
    } else {
      toast.error("Product not found");
    }
  };

  const handleProductSelect = (product: Product) => {
    if (
      product.is_banned ||
      bannedNames.some((name) => product.name.toLowerCase().includes(name))
    ) {
      toast.error(`Cannot add ${product.name} - This product is banned/restricted`);
      return;
    }
    onAddToCart(product);
    setSearchQuery("");
    setShowResults(false);
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button
          variant={!scanMode ? "default" : "outline"}
          onClick={() => setScanMode(false)}
          className="flex-1"
        >
          <Search className="h-4 w-4 mr-2" />
          Search Mode
        </Button>
        <Button
          variant={scanMode ? "default" : "outline"}
          onClick={() => setScanMode(true)}
          className="flex-1"
        >
          <Barcode className="h-4 w-4 mr-2" />
          Barcode Mode
        </Button>
      </div>

      {scanMode ? (
        /* Barcode Input */
        <form onSubmit={handleBarcodeSubmit} className="space-y-2">
          <div className="relative">
            <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              ref={barcodeInputRef}
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="Scan or enter barcode..."
              className="pl-10 h-12 text-lg font-mono"
              autoFocus
            />
            {barcodeInput && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setBarcodeInput("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Enter barcode to add product. Stock is automatically deducted on sale.
          </p>
        </form>
      ) : (
        /* Product Search */
        <div ref={searchRef} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              placeholder="Search products by name, category, or barcode..."
              className="pl-10 h-12"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => {
                  setSearchQuery("");
                  setShowResults(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchQuery && (
            <Card className="absolute z-50 w-full mt-2 max-h-64 overflow-y-auto shadow-lg">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="py-6 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </div>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.slice(0, 10).map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className={cn(
                        "w-full p-3 text-left hover:bg-accent transition-colors flex items-center justify-between border-b last:border-b-0",
                        product.stock <= product.min_stock && "bg-warning/5"
                      )}
                    >
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.category} • {product.barcode}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">₹{product.price}</p>
                        <p className={cn(
                          "text-xs",
                          product.stock <= product.min_stock ? "text-destructive" : "text-muted-foreground"
                        )}>
                          Stock: {product.stock}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <p className="p-4 text-center text-muted-foreground">
                    No products found
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
