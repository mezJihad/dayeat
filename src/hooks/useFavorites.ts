
import { useState, useEffect } from 'react'

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([])

    useEffect(() => {
        const stored = localStorage.getItem('dayeat_favorites')
        if (stored) {
            setFavorites(JSON.parse(stored))
        }
    }, [])

    const toggleFavorite = (restaurantId: string) => {
        const newFavorites = favorites.includes(restaurantId)
            ? favorites.filter(id => id !== restaurantId)
            : [...favorites, restaurantId]

        setFavorites(newFavorites)
        localStorage.setItem('dayeat_favorites', JSON.stringify(newFavorites))
    }

    const isFavorite = (restaurantId: string) => favorites.includes(restaurantId)

    return { favorites, toggleFavorite, isFavorite }
}
