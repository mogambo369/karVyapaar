import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Barcode, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Product {
  id: string;
  barcode: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
}

const sampleProducts: Product[] = [
  { id: "1", barcode: "8901234567890", name: "Paracetamol 500mg", category: "Medicine", price: 25, stock: 150, unit: "strip" },
  { id: "2", barcode: "8901234567891", name: "Crocin Advance", category: "Medicine", price: 45, stock: 80, unit: "strip" },
  { id: "3", barcode: "8901234567892", name: "Dettol Soap 75g", category: "Personal Care", price: 35, stock: 200, unit: "piece" },
  { id: "4", barcode: "8901234567893", name: "Tata Salt 1kg", category: "Grocery", price: 28, stock: 50, unit: "pack" },
  { id: "5", barcode: "8901234567894", name: "Amul Butter 100g", category: "Dairy", price: 56, stock: 30, unit: "pack" },
  { id: "6", barcode: "8901234567895", name: "Maggi Noodles", category: "Grocery", price: 14, stock: 100, unit: "pack" },
  { id: "7", barcode: "8901234567896", name: "Colgate Toothpaste 100g", category: "Personal Care", price: 85, stock: 75, unit: "tube" },
  { id: "8", barcode: "8901234567897", name: "Vim Dishwash Bar", category: "Household", price: 25, stock: 60, unit: "bar" },
  { id: "9", barcode: "8901234567898", name: "Britannia Good Day", category: "Snacks", price: 30, stock: 90, unit: "pack" },
  { id: "10", barcode: "8901234567899", name: "Lifebuoy Handwash 200ml", category: "Personal Care", price: 95, stock: 45, unit: "bottle" },
  { id: "11", barcode: "8901234567900", name: "Ibuprofen 400mg", category: "Medicine", price: 35, stock: 120, unit: "strip" },
  { id: "12", barcode: "8901234567901", name: "Cetirizine 10mg", category: "Medicine", price: 18, stock: 200, unit: "strip" },
];

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

  const filteredProducts = sampleProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.barcode.includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const product = sampleProducts.find((p) => p.barcode === barcodeInput);
    if (product) {
      onAddToCart(product);
      setBarcodeInput("");
    }
  };

  const handleProductSelect = (product: Product) => {
    onAddToCart(product);
    setSearchQuery("");
    setShowResults(false);
  };

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
            Simulated barcodes: 8901234567890 - 8901234567901
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
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className={cn(
                      "w-full p-3 text-left hover:bg-accent transition-colors flex items-center justify-between border-b last:border-b-0",
                      product.stock < 10 && "bg-warning/5"
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
                        product.stock < 10 ? "text-destructive" : "text-muted-foreground"
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
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export { sampleProducts };
