-- 1. Mise à jour de la fonction existante (Recherche géolocalisée)
DROP FUNCTION IF EXISTS public.get_menus_around(double precision, double precision, double precision);

CREATE OR REPLACE FUNCTION public.get_menus_around(
    lat double precision,
    long double precision,
    radius_meters double precision DEFAULT 5000
)
RETURNS TABLE (
    menu_item_id uuid,
    restaurant_id uuid,
    restaurant_name text,
    restaurant_phone text,
    restaurant_address text,
    restaurant_lat double precision,
    restaurant_long double precision,
    title text,
    price double precision,
    photo_url text,
    category text,
    meal_period text,
    is_sold_out boolean,
    is_active_today boolean,
    created_at timestamptz,
    dist_meters double precision
)
LANGUAGE sql
AS $$
    SELECT
        m.id as menu_item_id,
        r.id as restaurant_id,
        r.name as restaurant_name,
        r.whatsapp_phone as restaurant_phone,
        r.address as restaurant_address,
        st_y(r.location::geometry) as restaurant_lat,
        st_x(r.location::geometry) as restaurant_long,
        m.title,
        m.price,
        m.photo_url,
        m.category,
        m.meal_period,
        m.is_sold_out,
        m.is_active_today,
        m.created_at,
        st_distance(
            r.location::geography,
            st_point(long, lat)::geography
        ) as dist_meters
    FROM
        restaurants r
    JOIN
        menu_items m ON r.id = m.restaurant_id
    WHERE
        st_dwithin(
            r.location::geography,
            st_point(long, lat)::geography,
            radius_meters
        )
        AND m.is_active_today = true
    ORDER BY
        dist_meters ASC,
        m.created_at DESC;
$$;


-- 2. Nouvelle fonction pour la recherche globale (Sans géolocalisation utilisateur)
-- Utile pour afficher TOUS les restaurants sur la carte quand l'utilisateur n'a pas activé son GPS.
DROP FUNCTION IF EXISTS public.get_all_active_menus();

CREATE OR REPLACE FUNCTION public.get_all_active_menus()
RETURNS TABLE (
    menu_item_id uuid,
    restaurant_id uuid,
    restaurant_name text,
    restaurant_phone text,
    restaurant_address text,
    restaurant_lat double precision,
    restaurant_long double precision,
    title text,
    price double precision,
    photo_url text,
    category text,
    meal_period text,
    is_sold_out boolean,
    is_active_today boolean,
    created_at timestamptz,
    dist_meters double precision
)
LANGUAGE sql
AS $$
    SELECT
        m.id as menu_item_id,
        r.id as restaurant_id,
        r.name as restaurant_name,
        r.whatsapp_phone as restaurant_phone,
        r.address as restaurant_address,
        st_y(r.location::geometry) as restaurant_lat,
        st_x(r.location::geometry) as restaurant_long,
        m.title,
        m.price,
        m.photo_url,
        m.category,
        m.meal_period,
        m.is_sold_out,
        m.is_active_today,
        m.created_at,
        0::double precision as dist_meters -- Default distance
    FROM
        restaurants r
    JOIN
        menu_items m ON r.id = m.restaurant_id
    WHERE
        m.is_active_today = true
    ORDER BY
        m.created_at DESC;
$$;
