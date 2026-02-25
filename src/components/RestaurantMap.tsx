'use client'

import dynamic from 'next/dynamic'

// Dynamically import the map because Leaflet only works in the browser (uses window object)
const MapUI = dynamic(() => import('./MapUI'), {
    ssr: false,
    loading: () => <div className="w-full h-[600px] rounded-lg bg-muted animate-pulse" />
})

interface RestaurantMapProps {
    menus: any[]
}

export function RestaurantMap({ menus }: RestaurantMapProps) {
    return (
        <div className="w-full border rounded-lg overflow-hidden shadow-sm">
            <MapUI menus={menus} />
        </div>
    )
}
