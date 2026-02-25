'use client'

import { useState, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin, Navigation } from 'lucide-react'

// Fix Leaflet's default icon path issue
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

// Helper to center map
function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap()
    useEffect(() => {
        map.flyTo(center, 15) // Zoom level 15 for street view
    }, [center, map])
    return null
}

// Draggable Marker Component
function DraggableMarker({
    position,
    setPosition
}: {
    position: [number, number]
    setPosition: (pos: [number, number]) => void
}) {
    const markerRef = useRef<L.Marker>(null)

    const eventHandlers = {
        dragend() {
            const marker = markerRef.current
            if (marker != null) {
                const newPos = marker.getLatLng()
                setPosition([newPos.lat, newPos.lng])
            }
        },
    }

    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng])
        }
    })

    return (
        <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
        >
        </Marker>
    )
}

export default function AddressLocationPicker() {
    // Default to Casablanca
    const defaultCenter: [number, number] = [33.5731, -7.5898]
    const [position, setPosition] = useState<[number, number]>(defaultCenter)
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [addressText, setAddressText] = useState('')

    // Fallback if the user just hits enter on form
    const handleSearch = async (e?: React.MouseEvent | React.FormEvent) => {
        if (e) e.preventDefault()
        if (!searchQuery.trim()) return

        setIsSearching(true)
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
            const data = await response.json()

            if (data && data.length > 0) {
                const firstResult = data[0]
                setPosition([parseFloat(firstResult.lat), parseFloat(firstResult.lon)])
                setAddressText(firstResult.display_name)
            } else {
                alert('Adresse introuvable. Essayez de glisser le marqueur sur la carte.')
            }
        } catch (error) {
            console.error('Erreur de recherche:', error)
            alert('Erreur lors de la recherche de l\'adresse.')
        } finally {
            setIsSearching(false)
        }
    }

    const getLocation = (e: React.MouseEvent) => {
        e.preventDefault()
        if (!navigator.geolocation) {
            alert("La géolocalisation n'est pas supportée par votre navigateur.")
            return
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosition([pos.coords.latitude, pos.coords.longitude])
                setAddressText("Position GPS Actuelle")
            },
            () => {
                alert("Impossible de récupérer votre position. Vérifiez vos autorisations.")
            }
        )
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Rechercher votre adresse</label>
                <div className="flex gap-2">
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ex: 123 Bd Mohamed V, Casablanca"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                handleSearch()
                            }
                        }}
                    />
                    <Button type="button" variant="secondary" onClick={handleSearch} disabled={isSearching}>
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Glissez le marqueur pour ajuster
                </span>
                <Button type="button" variant="outline" size="sm" onClick={getLocation} className="h-8">
                    <Navigation className="h-4 w-4 mr-2" />
                    Ma Position
                </Button>
            </div>

            <div className="w-full h-[300px] border rounded-lg overflow-hidden z-0 isolate">
                <MapContainer
                    center={position}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <ChangeView center={position} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <DraggableMarker position={position} setPosition={setPosition} />
                </MapContainer>
            </div>

            {/* Editable address confirmation to allow user to add specifics (Floor, Door, etc.) */}
            <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-foreground">
                    📍 Adresse finale (Modifiable)
                </label>
                <Input
                    name="address"
                    value={addressText}
                    onChange={(e) => setAddressText(e.target.value)}
                    placeholder="Ex: 123 Bd Anfa, 4ème étage..."
                    className="bg-orange-50/50"
                />
                <p className="text-xs text-muted-foreground">
                    Vous pouvez préciser l'étage, l'appartement ou des indications spécifiques.
                </p>
            </div>

            {/* Hidden inputs to send to Server Action */}
            <input type="hidden" name="lat" value={position[0]} />
            <input type="hidden" name="long" value={position[1]} />
        </div>
    )
}
