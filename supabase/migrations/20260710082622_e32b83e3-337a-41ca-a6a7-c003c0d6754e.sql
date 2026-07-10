-- Revert RLS to allow public access since authentication is being removed

-- Products
DROP POLICY IF EXISTS "Authenticated users can read products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Public delete products" ON public.products FOR DELETE USING (true);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO anon, authenticated;

-- Sales
DROP POLICY IF EXISTS "Authenticated users can read sales" ON public.sales;
DROP POLICY IF EXISTS "Authenticated users can insert sales" ON public.sales;
CREATE POLICY "Public read sales" ON public.sales FOR SELECT USING (true);
CREATE POLICY "Public insert sales" ON public.sales FOR INSERT WITH CHECK (true);
GRANT SELECT, INSERT ON public.sales TO anon, authenticated;

-- Sale items
DROP POLICY IF EXISTS "Authenticated users can read sale_items" ON public.sale_items;
DROP POLICY IF EXISTS "Authenticated users can insert sale_items" ON public.sale_items;
CREATE POLICY "Public read sale_items" ON public.sale_items FOR SELECT USING (true);
CREATE POLICY "Public insert sale_items" ON public.sale_items FOR INSERT WITH CHECK (true);
GRANT SELECT, INSERT ON public.sale_items TO anon, authenticated;

-- Customers
DROP POLICY IF EXISTS "Authenticated users can read customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can insert customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can update customers" ON public.customers;
CREATE POLICY "Public read customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Public insert customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update customers" ON public.customers FOR UPDATE USING (true);
GRANT SELECT, INSERT, UPDATE ON public.customers TO anon, authenticated;

-- Banned medicines
DROP POLICY IF EXISTS "Authenticated users can read banned_medicines" ON public.banned_medicines;
DROP POLICY IF EXISTS "Authenticated users can insert banned_medicines" ON public.banned_medicines;
DROP POLICY IF EXISTS "Authenticated users can delete banned_medicines" ON public.banned_medicines;
CREATE POLICY "Public read banned_medicines" ON public.banned_medicines FOR SELECT USING (true);
CREATE POLICY "Public insert banned_medicines" ON public.banned_medicines FOR INSERT WITH CHECK (true);
CREATE POLICY "Public delete banned_medicines" ON public.banned_medicines FOR DELETE USING (true);
GRANT SELECT, INSERT, DELETE ON public.banned_medicines TO anon, authenticated;

-- Regulatory alerts
DROP POLICY IF EXISTS "Authenticated users can read regulatory_alerts" ON public.regulatory_alerts;
DROP POLICY IF EXISTS "Authenticated users can update regulatory_alerts" ON public.regulatory_alerts;
CREATE POLICY "Public read regulatory_alerts" ON public.regulatory_alerts FOR SELECT USING (true);
CREATE POLICY "Public update regulatory_alerts" ON public.regulatory_alerts FOR UPDATE USING (true);
GRANT SELECT, UPDATE ON public.regulatory_alerts TO anon, authenticated;