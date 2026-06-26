-- 1. Ajouter la colonne d'abonnement
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS subscription_pack TEXT DEFAULT 'Aucun (Gratuit)';

-- 2. Mettre à jour la vue publique
DROP VIEW IF EXISTS public_restaurants;
CREATE OR REPLACE VIEW public_restaurants AS
SELECT 
    id, name, slug, rating, reviews_count, category, address, 
    whatsapp, open_hours, closed_days, is_open_manual, status, 
    cover_image, menu, reviews, subscription_pack, created_at
FROM restaurants;

-- 3. Mettre à jour la fonction d'update de l'admin
CREATE OR REPLACE FUNCTION admin_update_restaurant(p_admin_password TEXT, p_restaurant_id TEXT, p_updates JSONB)
RETURNS VOID AS $$
BEGIN
    IF encode(digest(p_admin_password, 'sha256'), 'hex') IN (
        '42eb8c4db0ea9234a9e42c8caa8daaf4c8c8197a6555498f622e62fd0980cd92',
        '7ea441c9232272092447095c465d58026dcbdc67cf6df9348d4dcea89451bd61',
        'bb17e5611cb14f1b2abfecebd1b2c51ed510d347495c9751576cae6d1b15b60a'
    ) THEN
        UPDATE restaurants
        SET 
            name = COALESCE(p_updates->>'name', name),
            status = COALESCE(p_updates->>'status', status),
            username = COALESCE(p_updates->>'username', username),
            password = COALESCE(p_updates->>'password', password),
            subscription_pack = COALESCE(p_updates->>'subscription_pack', subscription_pack)
        WHERE id = p_restaurant_id;
    ELSE
        RAISE EXCEPTION 'Non autorisé';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. Créer le Storage Bucket pour l'upload des images (Plats et Couvertures)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('restaurant_images', 'restaurant_images', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Autoriser tout le monde à lire les images (Public Read)
DROP POLICY IF EXISTS "Images Publiques" ON storage.objects;
CREATE POLICY "Images Publiques" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'restaurant_images' );

-- 6. Autoriser les utilisateurs anonymes à uploader des images
DROP POLICY IF EXISTS "Upload d'images par les restaurants" ON storage.objects;
CREATE POLICY "Upload d'images par les restaurants" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'restaurant_images' );

-- 7. Autoriser la mise à jour/suppression
DROP POLICY IF EXISTS "Gestion d'images" ON storage.objects;
CREATE POLICY "Gestion d'images" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'restaurant_images' );

DROP POLICY IF EXISTS "Suppression d'images" ON storage.objects;
CREATE POLICY "Suppression d'images" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'restaurant_images' );

-- 8. Verify Admin Login RPC
CREATE OR REPLACE FUNCTION verify_admin_login(p_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN encode(digest(p_password, 'sha256'), 'hex') IN (
        '42eb8c4db0ea9234a9e42c8caa8daaf4c8c8197a6555498f622e62fd0980cd92',
        '7ea441c9232272092447095c465d58026dcbdc67cf6df9348d4dcea89451bd61',
        'bb17e5611cb14f1b2abfecebd1b2c51ed510d347495c9751576cae6d1b15b60a'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
