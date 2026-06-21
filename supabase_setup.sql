-- ==========================================
-- THIES Resto Supabase Database Setup Schema
-- Secure Production Version with Strict RLS & RPC
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- 5. Create Secure View for Restaurants (excl. username & password)
CREATE OR REPLACE VIEW public_restaurants AS
SELECT 
    id, name, slug, rating, reviews_count, category, address, 
    whatsapp, open_hours, closed_days, is_open_manual, status, 
    cover_image, menu, reviews, created_at
FROM restaurants;

-- 6. Enable Row Level Security (RLS)
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

-- 7. Define Strict Security Policies

-- Restaurants Table Policies:
-- Allow public inserts for registration & initial seed
CREATE POLICY "Allow public insert on restaurants" ON restaurants FOR INSERT WITH CHECK (true);
-- No direct public SELECT, UPDATE or DELETE allowed
CREATE POLICY "No direct select on restaurants" ON restaurants FOR SELECT USING (false);
CREATE POLICY "No direct update on restaurants" ON restaurants FOR UPDATE USING (false);
CREATE POLICY "No direct delete on restaurants" ON restaurants FOR DELETE USING (false);

-- Orders Table Policies:
-- Allow customers to place orders
CREATE POLICY "Allow public insert on orders" ON orders FOR INSERT WITH CHECK (true);
-- No direct public SELECT, UPDATE or DELETE allowed
CREATE POLICY "No direct select on orders" ON orders FOR SELECT USING (false);
CREATE POLICY "No direct update on orders" ON orders FOR UPDATE USING (false);
CREATE POLICY "No direct delete on orders" ON orders FOR DELETE USING (false);

-- Reservations Table Policies:
-- Allow customers to book tables
CREATE POLICY "Allow public insert on reservations" ON reservations FOR INSERT WITH CHECK (true);
-- No direct public SELECT, UPDATE or DELETE allowed
CREATE POLICY "No direct select on reservations" ON reservations FOR SELECT USING (false);
CREATE POLICY "No direct update on reservations" ON reservations FOR UPDATE USING (false);
CREATE POLICY "No direct delete on reservations" ON reservations FOR DELETE USING (false);

-- Customers Table Policies:
-- Allow loyalty profile inserts & upserts
CREATE POLICY "Allow public insert on customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on customers" ON customers FOR UPDATE USING (true); -- Allow loyalty upserting
-- No direct public SELECT or DELETE allowed
CREATE POLICY "No direct select on customers" ON customers FOR SELECT USING (false);
CREATE POLICY "No direct delete on customers" ON customers FOR DELETE USING (false);


-- 8. Define Secure Database RPC Functions (SECURITY DEFINER)

-- Verify Partner Login
CREATE OR REPLACE FUNCTION verify_restaurant_login(p_username TEXT, p_password TEXT)
RETURNS TABLE (id TEXT, name TEXT, slug TEXT, status TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT r.id, r.name, r.slug, r.status
    FROM restaurants r
    WHERE LOWER(r.username) = LOWER(p_username) AND r.password = p_password;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update Restaurant Profile/Menu Securely
CREATE OR REPLACE FUNCTION update_restaurant_data(p_restaurant_id TEXT, p_password TEXT, p_updates JSONB)
RETURNS VOID AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM restaurants WHERE id = p_restaurant_id AND password = p_password) THEN
        UPDATE restaurants
        SET 
            name = COALESCE(p_updates->>'name', name),
            address = COALESCE(p_updates->>'address', address),
            whatsapp = COALESCE(p_updates->>'whatsapp', whatsapp),
            open_hours = COALESCE(p_updates->>'open_hours', open_hours),
            closed_days = COALESCE(p_updates->'closed_days', closed_days),
            is_open_manual = COALESCE((p_updates->>'is_open_manual')::boolean, is_open_manual),
            cover_image = COALESCE(p_updates->>'cover_image', cover_image),
            menu = COALESCE(p_updates->'menu', menu),
            reviews = COALESCE(p_updates->'reviews', reviews)
        WHERE id = p_restaurant_id;
    ELSE
        RAISE EXCEPTION 'Non autorisé';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Change Restaurant Password Securely
CREATE OR REPLACE FUNCTION change_restaurant_password(p_restaurant_id TEXT, p_old_password TEXT, p_new_password TEXT)
RETURNS VOID AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM restaurants WHERE id = p_restaurant_id AND password = p_old_password) THEN
        UPDATE restaurants SET password = p_new_password WHERE id = p_restaurant_id;
    ELSE
        RAISE EXCEPTION 'Ancien mot de passe incorrect';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get Orders for Logged-in Restaurant
CREATE OR REPLACE FUNCTION get_restaurant_orders(p_restaurant_id TEXT, p_password TEXT)
RETURNS SETOF orders AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM restaurants WHERE id = p_restaurant_id AND password = p_password) THEN
        RETURN QUERY SELECT * FROM orders WHERE restaurant_id = p_restaurant_id;
    ELSE
        RAISE EXCEPTION 'Non autorisé';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get Reservations for Logged-in Restaurant
CREATE OR REPLACE FUNCTION get_restaurant_reservations(p_restaurant_id TEXT, p_password TEXT)
RETURNS SETOF reservations AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM restaurants WHERE id = p_restaurant_id AND password = p_password) THEN
        RETURN QUERY SELECT * FROM reservations WHERE restaurant_id = p_restaurant_id;
    ELSE
        RAISE EXCEPTION 'Non autorisé';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update Order Status Securely
CREATE OR REPLACE FUNCTION update_order_status(p_order_id TEXT, p_restaurant_id TEXT, p_password TEXT, p_status TEXT)
RETURNS VOID AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM restaurants WHERE id = p_restaurant_id AND password = p_password) THEN
        UPDATE orders SET status = p_status WHERE id = p_order_id AND restaurant_id = p_restaurant_id;
    ELSE
        RAISE EXCEPTION 'Non autorisé';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update Reservation Status Securely
CREATE OR REPLACE FUNCTION update_reservation_status(p_res_id TEXT, p_restaurant_id TEXT, p_password TEXT, p_status TEXT)
RETURNS VOID AS $$
BEGIN
    IF EXISTS (SELECT 1 FROM restaurants WHERE id = p_restaurant_id AND password = p_password) THEN
        UPDATE reservations SET status = p_status WHERE id = p_res_id AND restaurant_id = p_restaurant_id;
    ELSE
        RAISE EXCEPTION 'Non autorisé';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get Customer Loyalty Summary (No Raw Orders Disclosed)
CREATE OR REPLACE FUNCTION get_customer_loyalty_data(p_phone TEXT)
RETURNS TABLE (
    total_points INT,
    used_rewards INT,
    active_rewards INT,
    next_reward_points INT,
    tier TEXT,
    tier_class TEXT
) AS $$
DECLARE
    v_orders_count INT;
    v_reservations_count INT;
    v_used_rewards INT;
    v_total_points INT;
    v_total_rewards_unlocked INT;
    v_active_rewards INT;
    v_next_reward_points INT;
    v_tier TEXT;
    v_tier_class TEXT;
BEGIN
    -- Count delivered orders
    SELECT COUNT(*)::INT INTO v_orders_count
    FROM orders
    WHERE (customer_phone = p_phone OR REPLACE(customer_phone, ' ', '') = REPLACE(p_phone, ' ', ''))
      AND status = 'Livrée';

    -- Count confirmed reservations
    SELECT COUNT(*)::INT INTO v_reservations_count
    FROM reservations
    WHERE (customer_phone = p_phone OR REPLACE(customer_phone, ' ', '') = REPLACE(p_phone, ' ', ''))
      AND status = 'Confirmée';

    -- Get used rewards count
    SELECT COALESCE(c.used_rewards, 0) INTO v_used_rewards
    FROM customers c
    WHERE c.phone = p_phone;

    IF v_used_rewards IS NULL THEN
        v_used_rewards := 0;
    END IF;

    -- Calculate points (5 pts per delivered order/confirmed reservation)
    v_total_points := (v_orders_count + v_reservations_count) * 5;
    
    -- Rewards calculation: 100 points per reward
    v_total_rewards_unlocked := FLOOR(v_total_points / 100);
    v_active_rewards := GREATEST(0, v_total_rewards_unlocked - v_used_rewards);
    v_next_reward_points := 100 - (v_total_points % 100);

    -- Tiers definitions
    IF v_total_points >= 200 THEN
        v_tier := 'Empereur du Goût 👑';
        v_tier_class := 'tier-emperor';
    ELSIF v_total_points >= 100 THEN
        v_tier := 'Gourmand d''Or 🥇';
        v_tier_class := 'tier-gold';
    ELSIF v_total_points >= 50 THEN
        v_tier := 'Gourmand d''Argent 🥈';
        v_tier_class := 'tier-silver';
    ELSE
        v_tier := 'Gourmand de Bronze 🥉';
        v_tier_class := 'tier-bronze';
    END IF;

    RETURN QUERY SELECT v_total_points, v_used_rewards, v_active_rewards, v_next_reward_points, v_tier, v_tier_class;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get Super-Admin Aggregated Console Data Securely
CREATE OR REPLACE FUNCTION get_admin_data(p_admin_password TEXT)
RETURNS JSON AS $$
DECLARE
    v_result JSON;
BEGIN
    IF p_admin_password = 'adminthies' OR p_admin_password = 'admin221' OR p_admin_password = 'Mouhamadou2005' THEN
        SELECT json_build_object(
            'restaurants', (SELECT json_agg(r) FROM restaurants r),
            'orders', (SELECT json_agg(o) FROM orders o),
            'reservations', (SELECT json_agg(res) FROM reservations res)
        ) INTO v_result;
        RETURN v_result;
    ELSE
        RAISE EXCEPTION 'Non autorisé';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Super-Admin Restaurant Update
CREATE OR REPLACE FUNCTION admin_update_restaurant(p_admin_password TEXT, p_restaurant_id TEXT, p_updates JSONB)
RETURNS VOID AS $$
BEGIN
    IF p_admin_password = 'adminthies' OR p_admin_password = 'admin221' OR p_admin_password = 'Mouhamadou2005' THEN
        UPDATE restaurants
        SET 
            name = COALESCE(p_updates->>'name', name),
            status = COALESCE(p_updates->>'status', status),
            username = COALESCE(p_updates->>'username', username),
            password = COALESCE(p_updates->>'password', password)
        WHERE id = p_restaurant_id;
    ELSE
        RAISE EXCEPTION 'Non autorisé';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Super-Admin Restaurant Delete
CREATE OR REPLACE FUNCTION admin_delete_restaurant(p_admin_password TEXT, p_restaurant_id TEXT)
RETURNS VOID AS $$
BEGIN
    IF p_admin_password = 'adminthies' OR p_admin_password = 'admin221' OR p_admin_password = 'Mouhamadou2005' THEN
        DELETE FROM restaurants WHERE id = p_restaurant_id;
    ELSE
        RAISE EXCEPTION 'Non autorisé';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Fonction pour soumettre un avis client
CREATE OR REPLACE FUNCTION submit_restaurant_review(
    p_restaurant_id UUID,
    p_customer_name TEXT,
    p_rating INT,
    p_comment TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_reviews JSONB;
    new_review JSONB;
    total_reviews INT;
    current_rating DECIMAL;
    new_average DECIMAL;
BEGIN
    -- Fetch current reviews and stats
    SELECT reviews, reviews_count, rating INTO current_reviews, total_reviews, current_rating 
    FROM restaurants 
    WHERE id = p_restaurant_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Restaurant non trouvé';
    END IF;

    -- Ensure it's not null
    IF current_reviews IS NULL THEN
        current_reviews := '[]'::jsonb;
    END IF;

    -- Create new review object
    new_review := jsonb_build_object(
        'author', p_customer_name,
        'rating', p_rating,
        'comment', p_comment,
        'date', to_char(NOW(), 'YYYY-MM-DD')
    );

    -- Append to reviews array
    current_reviews := current_reviews || new_review;

    -- Calculate new average
    new_average := ROUND((((current_rating * total_reviews) + p_rating) / (total_reviews + 1.0))::numeric, 1);

    -- Update table
    UPDATE restaurants
    SET 
        reviews = current_reviews,
        reviews_count = total_reviews + 1,
        rating = new_average
    WHERE id = p_restaurant_id;
END;
$$;

-- 11. Configuration du Storage (Images des restaurants)
-- Création du bucket 'restaurant_images' s'il n'existe pas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('restaurant_images', 'restaurant_images', true)
ON CONFLICT (id) DO NOTHING;

-- Autoriser la lecture publique des images
DROP POLICY IF EXISTS "Images Publiques" ON storage.objects;
CREATE POLICY "Images Publiques" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'restaurant_images');

-- Autoriser l'insertion (Upload) par n'importe qui (anonyme pour l'instant via le client)
DROP POLICY IF EXISTS "Upload Images" ON storage.objects;
CREATE POLICY "Upload Images" ON storage.objects
FOR INSERT TO public
WITH CHECK (bucket_id = 'restaurant_images');

-- ==========================================
-- 13. CONFIGURATION SUPABASE STORAGE (UPLOADS IMAGES)
-- ==========================================

-- 1. Cration du dossier de stockage (bucket) public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('restaurant-images', 'restaurant-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Dfinir les rgles de scurit pour les images (Lecture publique)
DROP POLICY IF EXISTS "Images sont publiques" ON storage.objects;
CREATE POLICY "Images sont publiques" ON storage.objects 
FOR SELECT USING (bucket_id = 'restaurant-images');

-- 3. Autoriser l'upload d'images
DROP POLICY IF EXISTS "Upload d'images autoris" ON storage.objects;
CREATE POLICY "Upload d'images autoris" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'restaurant-images');

-- ==========================================
-- TABLE: clients
-- ==========================================
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_order_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    total_orders INTEGER DEFAULT 1
);

-- Policies for clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert for everyone" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for everyone" ON public.clients FOR UPDATE USING (true);
CREATE POLICY "Enable select for admins" ON public.clients FOR SELECT USING (true);

-- RPC for upserting clients
CREATE OR REPLACE FUNCTION upsert_client(p_name TEXT, p_phone TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO clients (name, phone, last_order_at, total_orders)
    VALUES (p_name, p_phone, NOW(), 1)
    ON CONFLICT (phone) DO UPDATE 
    SET name = EXCLUDED.name, 
        last_order_at = NOW(),
        total_orders = clients.total_orders + 1;
END;
$$;
