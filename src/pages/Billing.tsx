import { useState, useCallback } from "react";
import { Header } from "@/components/dashboard/Header";
import { ProductSearch } from "@/components/billing/ProductSearch";
import { Cart, CartItem } from "@/components/billing/Cart";
import { PaymentModal } from "@/components/billing/PaymentModal";
import { VoiceCommand } from "@/components/ai/VoiceCommand";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Keyboard, Loader2, Mic } from "lucide-react";
import { toast } from "sonner";
import { useProducts, Product } from "@/hooks/useProducts";
import { useCreateSale, generateInvoiceNumber } from "@/hooks/useSales";

const Billing = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { data: products = [], isLoading } = useProducts();
  const createSale = useCreateSale();

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
          price: Number(product.price),
          quantity: 1,
          unit: product.unit,
        },
      ];
    });
  }, []);

  // Voice command handler to add items to cart by name
  const handleVoiceAddToCart = useCallback((item: { name: string; quantity: number; price?: number }) => {
    const matchedProduct = products.find(p => 
      p.name.toLowerCase().includes(item.name.toLowerCase()) ||
      item.name.toLowerCase().includes(p.name.toLowerCase())
    );

    if (matchedProduct) {
      setCartItems((prev) => {
        const existingItem = prev.find((i) => i.id === matchedProduct.id);
        if (existingItem) {
          return prev.map((i) =>
            i.id === matchedProduct.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        }
        return [
          ...prev,
          {
            id: matchedProduct.id,
            barcode: matchedProduct.barcode,
            name: matchedProduct.name,
            price: Number(matchedProduct.price),
            quantity: item.quantity,
            unit: matchedProduct.unit,
          },
        ];
      });
    } else {
      toast.warning(`Product "${item.name}" not found in inventory`);
    }
  }, [products]);

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

  const handlePaymentComplete = useCallback(
    async (paymentMethod: string, customerName?: string, customerPhone?: string) => {
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const gst = subtotal * 0.18;
      const total = subtotal + gst;

      try {
        await createSale.mutateAsync({
          invoice_number: generateInvoiceNumber(),
          customer_name: customerName,
          customer_phone: customerPhone,
          subtotal,
          gst_amount: gst,
          total,
          payment_method: paymentMethod,
          items: cartItems.map((item) => ({
            product_id: item.id,
            product_name: item.name,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.price * item.quantity,
          })),
        });

        setCartItems([]);
        setShowPaymentModal(false);
      } catch (error) {
        // Error handled by mutation
      }
    },
    [cartItems, createSale]
  );

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  // Get popular items from actual products
  const popularItems = products.slice(0, 4);

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

            {/* Voice Input & Tips */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Mic className="h-5 w-5 text-primary" />
                  Voice Input
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <VoiceCommand onAddToCart={handleVoiceAddToCart} />
                  <div className="flex-1 text-sm text-muted-foreground">
                    <p className="font-medium mb-1">Speak to add items</p>
                    <p>Say "Bill mein 2 packet doodh dalo" or "Add 5 kg rice to bill"</p>
                  </div>
                </div>
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
                      Switch to barcode mode and scan products directly.
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium">Voice Mode</p>
                    <p className="text-muted-foreground">
                      Speak in Hindi, Marathi, Gujarati, or English to add items.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Items Quick Add */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">
                  Popular Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {popularItems.map((product) => (
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
                )}
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
                disabled={cartItems.length === 0 || createSale.isPending}
                className="w-full h-14 text-lg"
                size="lg"
              >
                {createSale.isPending ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <CreditCard className="h-5 w-5 mr-2" />
                )}
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
