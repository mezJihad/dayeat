-- Assurez-vous d'être connecté à votre base de données via l'éditeur SQL de Supabase.

-- Remplacez '569bbb89-e2ed-4f2b-a397-9759e865667c' par votre ID de restaurant actuel.
-- Ces données insèrent des menus créés à des dates antérieures pour tester l'historique.

INSERT INTO public.menu_items (
    restaurant_id,
    title,
    description,
    price,
    category,
    meal_period,
    photo_url,
    is_active_today,
    is_sold_out,
    created_at
)
VALUES
    -- Menu d'hier (1 jour avant)
    (
        '569bbb89-e2ed-4f2b-a397-9759e865667c',
        'Tajine de Veau aux Pruneaux (Hier)',
        'Un classique marocain savoureux préparé hier.',
        65.00,
        'Plat',
        'Dejeuner',
        'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=200',
        false, -- Important : non actif aujourd'hui pour être dans l'historique
        false,
        NOW() - INTERVAL '1 day'
    ),
    -- Menu de la semaine dernière (7 jours avant)
    (
        '569bbb89-e2ed-4f2b-a397-9759e865667c',
        'Couscous Royal (Semaine dernière)',
        'Couscous aux 7 légumes avec viande et merguez.',
        75.00,
        'Plat',
        'Dejeuner',
        'https://images.unsplash.com/photo-1585937421612-70a008356f36?auto=format&fit=crop&q=80&w=200',
        false,
        true, -- Simuler un plat épuisé de la semaine dernière
        NOW() - INTERVAL '7 days'
    ),
    -- Menu du mois dernier (30 jours avant)
    (
        '569bbb89-e2ed-4f2b-a397-9759e865667c',
        'Pastilla Poulet (Mois dernier)',
        'Pastilla traditionnelle au poulet et amandes.',
        55.00,
        'Entrée',
        'Dejeuner',
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200',
        false,
        false,
        NOW() - INTERVAL '1 month'
    );
