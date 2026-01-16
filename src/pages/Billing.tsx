import { useState, useCallback } from "react";
import { Header } from "@/components/dashboard/Header";
import { ProductSearch, Product } from "@/components/billing/ProductSearch";
import { Cart, CartItem } from "@/components/billing/Cart";
import { PaymentModal } from "@/components/billing/PaymentModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Keyboard } from "lucide-react";
import { toast } from "sonner";

const Billing = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleAddToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        toast.info(`${product.name} quantity updated`);
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success(`${product.name} added to cart`);
      return [
        ...prev,
        {
          id: product.id,
          barcode: product.barcode,
          name: product.name,
          price: product.price,
          quantity: 1,
          unit: product.unit,
        },
      ];
    });
  }, []);

  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast.info("Item removed from cart");
  }, []);

  const handleClearCart = useCallback(() => {
    setCartItems([]);
    toast.info("Cart cleared");
  }, []);

  const handlePaymentComplete = useCallback(() => {
    setCartItems([]);
    setShowPaymentModal(false);
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Product Search & Quick Keys */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Search */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">
                  Add Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProductSearch onAddToCart={handleAddToCart} />
              </CardContent>
            </Card>

            {/* Keyboard Shortcuts */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Keyboard className="h-5 w-5" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium">Barcode Mode</p>
                    <p className="text-muted-foreground">
                      Switch to barcode mode and scan products directly. Use simulated barcodes for testing.
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium">Search Mode</p>
                    <p className="text-muted-foreground">
                      Search by product name, category, or barcode number. Click to add to cart.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sample Products Quick Add */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">
                  Popular Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "1", name: "Paracetamol", price: 25, barcode: "8901234567890", stock: 150, unit: "strip", category: "Medicine" },
                    { id: "3", name: "Dettol Soap", price: 35, barcode: "8901234567892", stock: 200, unit: "piece", category: "Personal Care" },
                    { id: "6", name: "Maggi", price: 14, barcode: "8901234567895", stock: 100, unit: "pack", category: "Grocery" },
                    { id: "5", name: "Amul Butter", price: 56, barcode: "8901234567894", stock: 30, unit: "pack", category: "Dairy" },
                  ].map((product) => (
                    <Button
                      key={product.id}
                      variant="outline"
                      className="h-auto py-3 flex-col"
                      onClick={() => handleAddToCart(product)}
                    >
                      <span className="font-medium">{product.name}</span>
                      <span className="text-xs text-primary">₹{product.price}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Cart */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="h-[calc(100vh-200px)]">
                <Cart
                  items={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onClearCart={handleClearCart}
                />
              </div>

              {/* Checkout Button */}
              <Button
                onClick={() => setShowPaymentModal(true)}
                disabled={cartItems.length === 0}
                className="w-full h-14 text-lg"
                size="lg"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Checkout • ₹{total.toFixed(2)}
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Payment Modal */}
      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        items={cartItems}
        onComplete={handlePaymentComplete}
      />
    </div>
  );
};

export default Billing;
