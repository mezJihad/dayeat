
'use client'

import { MenuCard } from '@/components/MenuCard'
import { useFavorites } from '@/hooks/useFavorites'
import { useSearchParams } from 'next/navigation'
import { PlusCircle, Heart } from 'lucide-react'

interface MenuFeedProps {
    menus: any[]
}

export function MenuFeed({ menus }: MenuFeedProps) {
    const searchParams = useSearchParams()
    const { isFavorite, favorites } = useFavorites()

    // Check if we should filter by favorites
    const showFavoritesOnly = searchParams.get('favorites') === 'true'

    // Sort logic happens in page.tsx, so we just filter by favorites here
    const displayedMenus = showFavoritesOnly
        ? menus.filter((menu) => isFavorite(menu.restaurant_id || menu.restaurants?.id)) // Handle both flat and nested ID potentially
        : menus

    if (displayedMenus.length === 0) {
        if (showFavoritesOnly) {
            return (
                <div className="text-center py-20 text-muted-foreground">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>Aucun menu favori trouvé pour aujourd'hui.</p>
                    <p className="text-sm mt-2">Ajoutez des restaurants à vos favoris en cliquant sur le cœur ! ❤️</p>
                </div>
            )
        }
        return (
            <div className="text-center py-20 text-muted-foreground">
                <p>Aucun menu disponible pour le moment.</p>
                <p className="text-sm mt-2">Revenez plus tard ! 🕒</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
            {displayedMenus.map((menu) => (
                <MenuCard
                    key={menu.id}
                    item={{
                        ...menu,
                        // Ensure data mapping matches standard (should be passed correctly from page.tsx)
                        restaurant_name: menu.restaurants?.name || menu.restaurant_name,
                        restaurant_phone: menu.restaurants?.whatsapp_phone || menu.restaurant_phone,
                        restaurant_address: menu.restaurants?.address || menu.restaurant_address,
                        // dist_meters might be missing if not GPS search, default to 0
                        dist_meters: menu.dist_meters || 0
                    }}
                />
            ))}
        </div>
    )
}
