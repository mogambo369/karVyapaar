import { forwardRef } from "react";
import { CartItem } from "./Cart";

interface InvoiceProps {
  invoiceNumber: string;
  date: Date;
  items: CartItem[];
  customerName?: string;
  customerPhone?: string;
  paymentMethod: string;
}

export const Invoice = forwardRef<HTMLDivElement, InvoiceProps>(
  ({ invoiceNumber, date, items, customerName, customerPhone, paymentMethod }, ref) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    return (
      <div ref={ref} className="bg-card p-6 max-w-md mx-auto font-mono text-sm">
        {/* Header */}
        <div className="text-center border-b border-dashed pb-4 mb-4">
          <h1 className="text-xl font-bold">karVyapaar Store</h1>
          <p className="text-xs text-muted-foreground">123 Market Street, New Delhi</p>
          <p className="text-xs text-muted-foreground">Ph: +91 98765 43210</p>
          <p className="text-xs text-muted-foreground">GSTIN: 07AABCU9603R1ZM</p>
        </div>

        {/* Invoice Details */}
        <div className="border-b border-dashed pb-4 mb-4 space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Invoice No:</span>
            <span className="font-semibold">{invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Date:</span>
            <span>{date.toLocaleDateString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Time:</span>
            <span>{date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          {customerName && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Customer:</span>
              <span>{customerName}</span>
            </div>
          )}
          {customerPhone && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone:</span>
              <span>{customerPhone}</span>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="border-b border-dashed pb-4 mb-4">
          <div className="grid grid-cols-12 gap-2 font-semibold mb-2 text-xs">
            <span className="col-span-5">Item</span>
            <span className="col-span-2 text-right">Qty</span>
            <span className="col-span-2 text-right">Price</span>
            <span className="col-span-3 text-right">Total</span>
          </div>
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 py-1 text-xs">
              <span className="col-span-5 truncate">{item.name}</span>
              <span className="col-span-2 text-right">{item.quantity}</span>
              <span className="col-span-2 text-right">₹{item.price}</span>
              <span className="col-span-3 text-right">
                ₹{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Subtotal:</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">CGST (9%):</span>
            <span>₹{(gst / 2).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">SGST (9%):</span>
            <span>₹{(gst / 2).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t border-dashed">
            <span>Grand Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="text-center border-t border-dashed pt-4 mb-4">
          <p className="text-xs text-muted-foreground">Payment Method</p>
          <p className="font-semibold">{paymentMethod}</p>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Thank you for shopping with us!</p>
          <p>Powered by karVyapaar</p>
          <p className="mt-2">*** Save paper, Save trees ***</p>
        </div>
      </div>
    );
  }
);

Invoice.displayName = "Invoice";
