import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Invoice } from "./Invoice";
import { CartItem } from "./Cart";
import { CreditCard, Wallet, Banknote, Printer, Check, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onComplete: (paymentMethod: string, customerName?: string, customerPhone?: string) => Promise<void>;
}

const paymentMethods = [
  { id: "cash", label: "Cash", icon: Banknote },
  { id: "upi", label: "UPI", icon: Wallet },
  { id: "card", label: "Card", icon: CreditCard },
];

export const PaymentModal = ({
  open,
  onClose,
  items,
  onComplete,
}: PaymentModalProps) => {
  const [step, setStep] = useState<"details" | "invoice">("details");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  const invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
  const invoiceDate = new Date();

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice-${invoiceNumber}`,
    onAfterPrint: () => {
      toast.success("Invoice printed successfully!");
    },
  });

  const handleProceedToInvoice = () => {
    setStep("invoice");
  };

  const handleComplete = async () => {
    setIsProcessing(true);
    try {
      await onComplete(
        paymentMethod,
        customerName || undefined,
        customerPhone || undefined
      );
      toast.success("Payment completed successfully!", {
        description: `Invoice ${invoiceNumber} generated`,
      });
      setStep("details");
      setCustomerName("");
      setCustomerPhone("");
      setPaymentMethod("cash");
    } catch (error) {
      // Error handled by parent
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendWhatsApp = () => {
    const message = `Thank you for shopping at karVyapaar! Your invoice ${invoiceNumber} for Rs. ${total.toFixed(2)} has been generated.`;
    const phone = customerPhone.replace(/\D/g, "");
    if (phone.length >= 10) {
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/91${phone.slice(-10)}?text=${encodedMessage}`, "_blank");
    } else {
      toast.error("Please enter a valid phone number");
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setStep("details");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "details" ? "Complete Payment" : "Invoice Preview"}
          </DialogTitle>
        </DialogHeader>

        {step === "details" ? (
          <div className="space-y-6">
            {/* Customer Details */}
            <div className="space-y-4">
              <h3 className="font-medium">Customer Details (Optional)</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Name</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    maxLength={100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone Number</Label>
                  <Input
                    id="customerPhone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h3 className="font-medium">Payment Method</h3>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="grid grid-cols-3 gap-3"
              >
                {paymentMethods.map((method) => (
                  <Label
                    key={method.id}
                    htmlFor={method.id}
                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem
                      value={method.id}
                      id={method.id}
                      className="sr-only"
                    />
                    <method.icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{method.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {/* Order Summary */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Items ({items.length})</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>GST (18%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <Button onClick={handleProceedToInvoice} className="w-full" size="lg">
              <Check className="h-5 w-5 mr-2" />
              Confirm Payment
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Invoice Preview */}
            <div className="border rounded-lg overflow-hidden">
              <Invoice
                ref={invoiceRef}
                invoiceNumber={invoiceNumber}
                date={invoiceDate}
                items={items}
                customerName={customerName || undefined}
                customerPhone={customerPhone || undefined}
                paymentMethod={
                  paymentMethods.find((m) => m.id === paymentMethod)?.label || "Cash"
                }
              />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => handlePrint()}>
                <Printer className="h-4 w-4 mr-2" />
                Print Invoice
              </Button>
              {customerPhone && (
                <Button variant="outline" onClick={handleSendWhatsApp}>
                  <Send className="h-4 w-4 mr-2" />
                  Send WhatsApp
                </Button>
              )}
            </div>

            <Button 
              onClick={handleComplete} 
              className="w-full" 
              size="lg"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Check className="h-5 w-5 mr-2" />
              )}
              Complete & New Bill
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
