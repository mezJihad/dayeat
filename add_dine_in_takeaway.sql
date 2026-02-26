-- Migration for adding is_dine_in and is_takeaway to menu_items

-- Step 1: Add the new columns with a default value of true
-- ALTER TABLE public.menu_items
-- ADD COLUMN is_dine_in BOOLEAN DEFAULT true,
-- ADD COLUMN is_takeaway BOOLEAN DEFAULT true;

-- Step 2: Update the get_all_active_menus function
DROP FUNCTION IF EXISTS public.get_all_active_menus();

CREATE OR REPLACE FUNCTION public.get_all_active_menus()
 RETURNS TABLE(menu_item_id uuid, title text, description text, price numeric, photo_url text, category menu_category, meal_period meal_period, is_sold_out boolean, restaurant_id uuid, restaurant_name text, restaurant_phone text, restaurant_address text, restaurant_lat double precision, restaurant_long double precision, dist_meters double precision, accepts_reservations boolean, is_dine_in boolean, is_takeaway boolean)
 LANGUAGE sql
AS $function$
SELECT 
    m.id AS menu_item_id,
    m.title,
    m.description,
    m.price,
    m.photo_url,
    m.category,
    m.meal_period,
    m.is_sold_out,
    r.id AS restaurant_id,
    r.name AS restaurant_name,
    r.whatsapp_phone AS restaurant_phone,
    r.address AS restaurant_address,
    ST_Y(r.location::geometry) AS restaurant_lat,
    ST_X(r.location::geometry) AS restaurant_long,
    0.0::double precision AS dist_meters,
    m.accepts_reservations,
    m.is_dine_in,
    m.is_takeaway
FROM 
    menu_items m
JOIN 
    restaurants r ON m.restaurant_id = r.id
WHERE 
    m.is_active_today = true 
    AND r.is_open = true
    AND date(m.created_at) = CURRENT_DATE;
$function$;

-- Step 3: Update the get_menus_around function
DROP FUNCTION IF EXISTS public.get_menus_around(double precision, double precision, double precision);

CREATE OR REPLACE FUNCTION public.get_menus_around(lat double precision, long double precision, radius_meters double precision DEFAULT 5000)
 RETURNS TABLE(menu_item_id uuid, title text, description text, price numeric, photo_url text, category menu_category, meal_period meal_period, is_sold_out boolean, restaurant_id uuid, restaurant_name text, restaurant_phone text, restaurant_address text, restaurant_lat double precision, restaurant_long double precision, dist_meters double precision, accepts_reservations boolean, is_dine_in boolean, is_takeaway boolean)
 LANGUAGE sql
AS $function$
SELECT 
    m.id AS menu_item_id,
    m.title,
    m.description,
    m.price,
    m.photo_url,
    m.category,
    m.meal_period,
    m.is_sold_out,
    r.id AS restaurant_id,
    r.name AS restaurant_name,
    r.whatsapp_phone AS restaurant_phone,
    r.address AS restaurant_address,
    ST_Y(r.location::geometry) AS restaurant_lat,
    ST_X(r.location::geometry) AS restaurant_long,
    ST_Distance(r.location, ST_SetSRID(ST_MakePoint(long, lat), 4326)::geography) AS dist_meters,
    m.accepts_reservations,
    m.is_dine_in,
    m.is_takeaway
FROM 
    menu_items m
JOIN 
    restaurants r ON m.restaurant_id = r.id
WHERE 
    ST_DWithin(r.location, ST_SetSRID(ST_MakePoint(long, lat), 4326)::geography, radius_meters)
    AND m.is_active_today = true
    AND r.is_open = true
    AND date(m.created_at) = CURRENT_DATE
ORDER BY 
    m.is_sold_out ASC,
    dist_meters ASC;
$function$;
