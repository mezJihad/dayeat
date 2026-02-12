-- Enable PostGIS for geography types
create extension if not exists postgis;

-- Restaurants Table
create table restaurants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users not null,
  name text not null,
  whatsapp_phone text not null, -- Format: 212661000000
  location geography(POINT) not null,
  address text,
  logo_url text,
  is_open boolean default true,
  created_at timestamptz default now()
);

-- Enable RLS for Restaurants
alter table restaurants enable row level security;

-- Policies for Restaurants
create policy "Public can view restaurants"
  on restaurants for select
  using (true);

create policy "Owners can manage their own restaurant"
  on restaurants for all
  using (auth.uid() = owner_id);


-- Enums for Menu Items
create type meal_period as enum ('Petit-Dej', 'Dejeuner', 'Gouter', 'Diner', 'AntiGaspi');
create type menu_category as enum ('Entrée', 'Plat', 'Dessert', 'Boisson', 'Formule');

-- Menu Items Table
create table menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  title text not null,
  description text,
  price numeric(10, 2) not null,
  photo_url text,
  category menu_category not null,
  meal_period meal_period not null,
  is_template boolean default false,
  is_active_today boolean default true,
  is_sold_out boolean default false,
  published_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Enable RLS for Menu Items
alter table menu_items enable row level security;

-- Policies for Menu Items
create policy "Public can view active menu items"
  on menu_items for select
  using (is_active_today = true);

create policy "Owners can manage their menu items"
  on menu_items for all
  using (
    exists (
      select 1 from restaurants
      where restaurants.id = menu_items.restaurant_id
      and restaurants.owner_id = auth.uid()
    )
  );


-- RPC: Get Menus Around Function
-- Finds restaurants within a radius (e.g., 5000 meters) and returns their active menu items
create or replace function get_menus_around(
  lat float,
  long float,
  radius_meters float default 5000
)
returns table (
  menu_item_id uuid,
  title text,
  description text,
  price numeric,
  photo_url text,
  category menu_category,
  meal_period meal_period,
  is_sold_out boolean,
  restaurant_name text,
  restaurant_phone text,
  restaurant_address text,
  dist_meters float
)
language sql
as $$
  select
    m.id as menu_item_id,
    m.title,
    m.description,
    m.price,
    m.photo_url,
    m.category,
    m.meal_period,
    m.is_sold_out,
    r.name as restaurant_name,
    r.whatsapp_phone as restaurant_phone,
    r.address as restaurant_address,
    st_distance(r.location, st_point(long, lat)::geography) as dist_meters
  from
    menu_items m
  join
    restaurants r on m.restaurant_id = r.id
  where
    m.is_active_today = true
    and st_dwithin(r.location, st_point(long, lat)::geography, radius_meters)
  order by
    dist_meters asc,
    m.published_at desc;
$$;
