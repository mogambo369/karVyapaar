-- Create products table for inventory management
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  barcode TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2) DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER DEFAULT 10,
  unit TEXT NOT NULL DEFAULT 'piece',
  gst_rate DECIMAL(5,2) DEFAULT 18,
  expiry_date DATE,
  batch_number TEXT,
  is_banned BOOLEAN DEFAULT false,
  ban_reason TEXT,
  ban_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sales table for tracking transactions
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  subtotal DECIMAL(10,2) NOT NULL,
  gst_amount DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'cash',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sale_items table for line items
CREATE TABLE public.sale_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_id UUID NOT NULL REFERENCES public.sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customers table for tracking customer history
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE,
  email TEXT,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  loyalty_tier TEXT DEFAULT 'Bronze',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create banned_medicines table for compliance
CREATE TABLE public.banned_medicines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  reason TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'CDSCO',
  banned_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create regulatory_alerts table
CREATE TABLE public.regulatory_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  source TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banned_medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regulatory_alerts ENABLE ROW LEVEL SECURITY;

-- Create public read policies (for now, we'll add auth later)
CREATE POLICY "Allow public read on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public insert on products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on products" ON public.products FOR DELETE USING (true);

CREATE POLICY "Allow public read on sales" ON public.sales FOR SELECT USING (true);
CREATE POLICY "Allow public insert on sales" ON public.sales FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on sale_items" ON public.sale_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert on sale_items" ON public.sale_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Allow public insert on customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on customers" ON public.customers FOR UPDATE USING (true);

CREATE POLICY "Allow public read on banned_medicines" ON public.banned_medicines FOR SELECT USING (true);
CREATE POLICY "Allow public insert on banned_medicines" ON public.banned_medicines FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on banned_medicines" ON public.banned_medicines FOR DELETE USING (true);

CREATE POLICY "Allow public read on regulatory_alerts" ON public.regulatory_alerts FOR SELECT USING (true);
CREATE POLICY "Allow public update on regulatory_alerts" ON public.regulatory_alerts FOR UPDATE USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update customer stats after sale
CREATE OR REPLACE FUNCTION public.update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.customer_phone IS NOT NULL THEN
    INSERT INTO public.customers (name, phone, total_orders, total_spent)
    VALUES (COALESCE(NEW.customer_name, 'Walk-in Customer'), NEW.customer_phone, 1, NEW.total)
    ON CONFLICT (phone) DO UPDATE SET
      total_orders = customers.total_orders + 1,
      total_spent = customers.total_spent + NEW.total,
      loyalty_tier = CASE
        WHEN customers.total_spent + NEW.total >= 50000 THEN 'Platinum'
        WHEN customers.total_spent + NEW.total >= 20000 THEN 'Gold'
        WHEN customers.total_spent + NEW.total >= 5000 THEN 'Silver'
        ELSE 'Bronze'
      END,
      updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER after_sale_insert
AFTER INSERT ON public.sales
FOR EACH ROW EXECUTE FUNCTION public.update_customer_stats();

-- Create function to deduct stock after sale item
CREATE OR REPLACE FUNCTION public.deduct_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET stock = stock - NEW.quantity
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER after_sale_item_insert
AFTER INSERT ON public.sale_items
FOR EACH ROW EXECUTE FUNCTION public.deduct_stock();

-- Insert sample products
INSERT INTO public.products (barcode, name, category, price, cost_price, stock, unit, gst_rate, expiry_date, batch_number) VALUES
('8901234567890', 'Paracetamol 500mg', 'Medicine', 25, 18, 150, 'strip', 12, '2025-06-15', 'BATCH001'),
('8901234567891', 'Cough Syrup', 'Medicine', 85, 60, 45, 'bottle', 12, '2025-02-01', 'BATCH002'),
('8901234567892', 'Dettol Soap', 'Personal Care', 35, 25, 200, 'piece', 18, '2026-12-31', 'BATCH003'),
('8901234567893', 'Colgate Toothpaste', 'Personal Care', 55, 40, 180, 'piece', 18, '2026-06-30', 'BATCH004'),
('8901234567894', 'Amul Butter 500g', 'Dairy', 56, 48, 30, 'pack', 5, '2025-02-15', 'BATCH005'),
('8901234567895', 'Maggi Noodles', 'Grocery', 14, 10, 100, 'pack', 5, '2025-12-31', 'BATCH006'),
('8901234567896', 'Amoxicillin 500mg', 'Medicine', 120, 85, 75, 'strip', 12, '2025-01-30', 'BATCH007'),
('8901234567897', 'Vitamin C Tablets', 'Medicine', 150, 100, 60, 'bottle', 12, '2025-04-15', 'BATCH008'),
('8901234567898', 'Ibuprofen 200mg', 'Medicine', 45, 32, 90, 'strip', 12, '2025-02-05', 'BATCH009'),
('8901234567899', 'Cetrizine 10mg', 'Medicine', 35, 22, 120, 'strip', 12, '2025-08-20', 'BATCH010');

-- Insert sample banned medicines
INSERT INTO public.banned_medicines (name, reason, source, banned_date) VALUES
('Nimesulide Syrup', 'Hepatotoxicity risk in children', 'CDSCO', '2024-03-15'),
('Cisapride', 'Cardiac arrhythmias risk', 'CDSCO', '2024-01-20'),
('Phenylpropanolamine', 'Increased stroke risk', 'STATE_DRUG_CONTROL', '2024-02-10'),
('Furazolidone', 'Carcinogenic concerns', 'CDSCO', '2024-04-05');

-- Insert sample regulatory alerts
INSERT INTO public.regulatory_alerts (title, description, source, severity) VALUES
('New GST Rate Changes', 'GST rates updated for pharmaceutical products effective from next month', 'GST_COUNCIL', 'warning'),
('CDSCO Quality Alert', 'Batch recall notice for specific paracetamol batches due to contamination', 'CDSCO', 'critical'),
('License Renewal Reminder', 'Annual drug license renewal due within 30 days', 'STATE_DRUG_CONTROL', 'info');

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales;
ALTER PUBLICATION supabase_realtime ADD TABLE public.banned_medicines;
ALTER PUBLICATION supabase_realtime ADD TABLE public.regulatory_alerts;