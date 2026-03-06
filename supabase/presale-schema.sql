-- Simple products table (for demo)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT,
  price NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders (pre-sales)
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  status TEXT CHECK (status IN ('draft','confirmed','cancelled')) DEFAULT 'draft',
  total_amount NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER DEFAULT 1,
  unit_price NUMERIC(10,2) DEFAULT 0,
  line_total NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

-- Insert demo products
INSERT INTO products (name, sku, price) VALUES
  ('Coca-Cola 33cl', 'COKE33', 45.00),
  ('Eau Minérale 1.5L', 'EAU15', 30.00),
  ('Pain Baguette', 'PAIN', 25.00),
  ('Lait 1L', 'LAIT1', 120.00)
ON CONFLICT DO NOTHING;
