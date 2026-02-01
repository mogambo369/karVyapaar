import { z } from "zod";

// Product validation schema
export const ProductSchema = z.object({
  barcode: z.string().min(1, "Barcode is required").max(50, "Barcode too long"),
  name: z.string().min(1, "Name is required").max(200, "Name too long"),
  category: z.string().min(1, "Category is required").max(100, "Category too long"),
  price: z.number().min(0, "Price must be positive").max(9999999, "Price too high"),
  cost_price: z.number().min(0, "Cost price must be positive").max(9999999, "Cost too high"),
  stock: z.number().int("Stock must be a whole number").min(0, "Stock cannot be negative"),
  min_stock: z.number().int("Min stock must be a whole number").min(0, "Min stock cannot be negative"),
  unit: z.string().min(1, "Unit is required").max(50, "Unit too long"),
  gst_rate: z.number().min(0, "GST rate must be positive").max(100, "GST rate too high"),
  expiry_date: z.string().nullable().optional(),
  batch_number: z.string().max(100, "Batch number too long").nullable().optional(),
  is_banned: z.boolean().optional().default(false),
  ban_reason: z.string().max(500, "Ban reason too long").nullable().optional(),
  ban_source: z.string().max(200, "Ban source too long").nullable().optional(),
});

export type ProductInput = z.infer<typeof ProductSchema>;

// Sale validation schema
export const SaleItemSchema = z.object({
  product_id: z.string().uuid("Invalid product ID"),
  product_name: z.string().min(1, "Product name is required").max(200, "Product name too long"),
  quantity: z.number().int("Quantity must be a whole number").min(1, "Quantity must be at least 1"),
  unit_price: z.number().min(0, "Unit price must be positive"),
  total_price: z.number().min(0, "Total price must be positive"),
});

export const SaleSchema = z.object({
  invoice_number: z.string().min(1, "Invoice number is required").max(50, "Invoice number too long"),
  customer_name: z.string().max(200, "Customer name too long").optional(),
  customer_phone: z.string().max(20, "Phone number too long").regex(/^[+\d\s-]*$/, "Invalid phone format").optional(),
  subtotal: z.number().min(0, "Subtotal must be positive"),
  gst_amount: z.number().min(0, "GST amount must be positive"),
  total: z.number().min(0, "Total must be positive"),
  payment_method: z.enum(["cash", "card", "upi", "credit"], { errorMap: () => ({ message: "Invalid payment method" }) }),
  items: z.array(SaleItemSchema).min(1, "At least one item is required"),
});

export type SaleInput = z.infer<typeof SaleSchema>;

// Banned medicine validation schema
export const BannedMedicineSchema = z.object({
  name: z.string().min(1, "Medicine name is required").max(200, "Name too long"),
  reason: z.string().min(1, "Reason is required").max(1000, "Reason too long"),
  source: z.string().min(1, "Source is required").max(200, "Source too long"),
  banned_date: z.string().optional(),
});

export type BannedMedicineInput = z.infer<typeof BannedMedicineSchema>;

// Auth validation schemas
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const SignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(72, "Password too long"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;

// AI Features validation schemas
export const ScanBillInputSchema = z.object({
  imageBase64: z.string().min(1, "Image data is required").max(10_000_000, "Image too large (max 10MB)"),
});

export const VoiceCommandInputSchema = z.object({
  transcript: z.string().min(1, "Transcript is required").max(5000, "Transcript too long"),
  language: z.string().max(20).optional().default("auto"),
});

export const ReorderInputSchema = z.object({
  lowStockItems: z.array(z.object({
    name: z.string(),
    stock: z.number(),
    min_stock: z.number(),
    category: z.string(),
    unit: z.string(),
  })),
  distributorName: z.string().max(200).optional(),
});
