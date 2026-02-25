'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet's default icon path issue with webpack
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

interface MapUIProps {
    menus: any[]
}

export default function MapUI({ menus }: MapUIProps) {
    // Group menus by restaurant
    const restaurantsMap = menus.reduce((acc, menu) => {
        const rId = menu.restaurant_id || menu.restaurants?.id || menu.restaurant_name
        if (!acc[rId]) {
            acc[rId] = {
                name: menu.restaurant_name,
                phone: menu.restaurant_phone,
                address: menu.restaurant_address,
                lat: menu.restaurants?.lat || menu.restaurant_lat,
                long: menu.restaurants?.long || menu.restaurant_long,
                menus: []
            }
        }
        acc[rId].menus.push(menu)
        return acc
    }, {} as Record<string, any>)

    const restaurants = (Object.values(restaurantsMap) as any[]).filter((r: any) => r.lat && r.long)

    // Default to Casablanca if no restaurants, otherwise center on the first one
    const defaultCenter: [number, number] = [33.5731, -7.5898]
    const center = restaurants.length > 0 ? [restaurants[0].lat, restaurants[0].long] as [number, number] : defaultCenter

    return (
        <MapContainer
            center={center}
            zoom={13}
            style={{ height: '600px', width: '100%', borderRadius: '0.5rem', zIndex: 0 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {restaurants.map((r: any, idx) => (
                <Marker key={idx} position={[r.lat, r.long]}>
                    <Popup>
                        <div className="font-sans min-w-[200px]">
                            <h3 className="font-bold text-base m-0 mb-1 leading-tight">{r.name}</h3>
                            <p className="text-xs text-muted-foreground m-0 mb-3">{r.address}</p>
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-orange-600 border-b pb-1 mb-2">Les menus d'aujourd'hui</p>
                                {r.menus.map((m: any) => (
                                    <div key={m.id} className="text-sm border-t pt-2">
                                        <div className="font-medium leading-tight">{m.title}</div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-orange-600 font-semibold">{m.price} MAD</span>
                                            {m.is_sold_out && <span className="text-xs text-destructive bg-destructive/10 px-1 rounded">(Épuisé)</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    )
}
