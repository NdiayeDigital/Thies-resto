-- ==========================================
-- THIES Resto Supabase Database Setup Schema
-- ==========================================

-- 1. Create Restaurants Table
CREATE TABLE IF NOT EXISTS restaurants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    rating NUMERIC(3, 2) DEFAULT 4.0,
    reviews_count INT DEFAULT 0,
    category TEXT NOT NULL,
    address TEXT,
    whatsapp TEXT,
    open_hours TEXT,
    closed_days JSONB DEFAULT '[]'::jsonb,
    is_open_manual BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'active',
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    cover_image TEXT,
    menu JSONB DEFAULT '[]'::jsonb,
    reviews JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT REFERENCES restaurants(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    mode TEXT NOT NULL,
    address TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total NUMERIC(10, 2) NOT NULL,
    note TEXT,
    status TEXT DEFAULT 'Reçue',
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
    id TEXT PRIMARY KEY,
    restaurant_id TEXT REFERENCES restaurants(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    guests INT DEFAULT 1,
    note TEXT,
    status TEXT DEFAULT 'En attente',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Customers Table (Loyalty & Profiles)
CREATE TABLE IF NOT EXISTS customers (
    phone TEXT PRIMARY KEY,
    name TEXT,
    used_rewards INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Clean existing policies if any
DROP POLICY IF EXISTS "Allow public read on restaurants" ON restaurants;
DROP POLICY IF EXISTS "Allow public insert on restaurants" ON restaurants;
DROP POLICY IF EXISTS "Allow public update on restaurants" ON restaurants;
DROP POLICY IF EXISTS "Allow public delete on restaurants" ON restaurants;

DROP POLICY IF EXISTS "Allow public read on orders" ON orders;
DROP POLICY IF EXISTS "Allow public insert on orders" ON orders;
DROP POLICY IF EXISTS "Allow public update on orders" ON orders;
DROP POLICY IF EXISTS "Allow public delete on orders" ON orders;

DROP POLICY IF EXISTS "Allow public read on reservations" ON reservations;
DROP POLICY IF EXISTS "Allow public insert on reservations" ON reservations;
DROP POLICY IF EXISTS "Allow public update on reservations" ON reservations;
DROP POLICY IF EXISTS "Allow public delete on reservations" ON reservations;

DROP POLICY IF EXISTS "Allow public read on customers" ON customers;
DROP POLICY IF EXISTS "Allow public insert on customers" ON customers;
DROP POLICY IF EXISTS "Allow public update on customers" ON customers;
DROP POLICY IF EXISTS "Allow public delete on customers" ON customers;

-- Recreate RLS policies
CREATE POLICY "Allow public read on restaurants" ON restaurants FOR SELECT USING (true);
CREATE POLICY "Allow public insert on restaurants" ON restaurants FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on restaurants" ON restaurants FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on restaurants" ON restaurants FOR DELETE USING (true);

CREATE POLICY "Allow public read on orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert on orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on orders" ON orders FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on orders" ON orders FOR DELETE USING (true);

CREATE POLICY "Allow public read on reservations" ON reservations FOR SELECT USING (true);
CREATE POLICY "Allow public insert on reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on reservations" ON reservations FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on reservations" ON reservations FOR DELETE USING (true);

CREATE POLICY "Allow public read on customers" ON customers FOR SELECT USING (true);
CREATE POLICY "Allow public insert on customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on customers" ON customers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on customers" ON customers FOR DELETE USING (true);
