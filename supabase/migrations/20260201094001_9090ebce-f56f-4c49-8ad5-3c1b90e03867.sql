-- Drop all existing public policies on products table
DROP POLICY IF EXISTS "Allow public delete on products" ON public.products;
DROP POLICY IF EXISTS "Allow public insert on products" ON public.products;
DROP POLICY IF EXISTS "Allow public read on products" ON public.products;
DROP POLICY IF EXISTS "Allow public update on products" ON public.products;

-- Drop all existing public policies on sales table
DROP POLICY IF EXISTS "Allow public insert on sales" ON public.sales;
DROP POLICY IF EXISTS "Allow public read on sales" ON public.sales;

-- Drop all existing public policies on sale_items table
DROP POLICY IF EXISTS "Allow public insert on sale_items" ON public.sale_items;
DROP POLICY IF EXISTS "Allow public read on sale_items" ON public.sale_items;

-- Drop all existing public policies on customers table
DROP POLICY IF EXISTS "Allow public insert on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow public read on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow public update on customers" ON public.customers;

-- Drop all existing public policies on banned_medicines table
DROP POLICY IF EXISTS "Allow public delete on banned_medicines" ON public.banned_medicines;
DROP POLICY IF EXISTS "Allow public insert on banned_medicines" ON public.banned_medicines;
DROP POLICY IF EXISTS "Allow public read on banned_medicines" ON public.banned_medicines;

-- Drop all existing public policies on regulatory_alerts table
DROP POLICY IF EXISTS "Allow public read on regulatory_alerts" ON public.regulatory_alerts;
DROP POLICY IF EXISTS "Allow public update on regulatory_alerts" ON public.regulatory_alerts;

-- Create secure policies for products (authenticated users only)
CREATE POLICY "Authenticated users can read products" ON public.products
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert products" ON public.products
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update products" ON public.products
FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete products" ON public.products
FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create secure policies for sales (authenticated users only)
CREATE POLICY "Authenticated users can read sales" ON public.sales
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert sales" ON public.sales
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create secure policies for sale_items (authenticated users only)
CREATE POLICY "Authenticated users can read sale_items" ON public.sale_items
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert sale_items" ON public.sale_items
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create secure policies for customers (authenticated users only)
CREATE POLICY "Authenticated users can read customers" ON public.customers
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert customers" ON public.customers
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update customers" ON public.customers
FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create secure policies for banned_medicines (authenticated users only)
CREATE POLICY "Authenticated users can read banned_medicines" ON public.banned_medicines
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert banned_medicines" ON public.banned_medicines
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete banned_medicines" ON public.banned_medicines
FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create secure policies for regulatory_alerts (authenticated users only)
CREATE POLICY "Authenticated users can read regulatory_alerts" ON public.regulatory_alerts
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update regulatory_alerts" ON public.regulatory_alerts
FOR UPDATE USING (auth.uid() IS NOT NULL);