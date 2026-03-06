'use client'

import { useState, useEffect } from 'react'
import { MenuFeed } from '@/components/MenuFeed'
import { RestaurantMap } from '@/components/RestaurantMap'
import { Map, List, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FilterBar } from '@/components/FilterBar'
import { useRouter, useSearchParams } from 'next/navigation'

interface FeedToggleProps {
    menus: any[]
}

export function FeedToggle({ menus }: FeedToggleProps) {
    const [view, setView] = useState<'list' | 'map'>('list')
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loadingLocation, setLoadingLocation] = useState(false)

    const updateParams = (newParams: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString())
        Object.entries(newParams).forEach(([key, value]) => {
            if (value) {
                params.set(key, value)
            } else {
                params.delete(key)
            }
        })
        router.push(`/?${params.toString()}`)
    }

    const handleLocationClick = () => {
        if (!navigator.geolocation) {
            alert("La géolocalisation n'est pas supportée par votre navigateur.")
            return
        }

        setLoadingLocation(true)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                localStorage.setItem('user_lat', latitude.toString())
                localStorage.setItem('user_long', longitude.toString())
                updateParams({
                    lat: latitude.toString(),
                    long: longitude.toString(),
                    sort: 'dist_asc'
                })
                setLoadingLocation(false)
            },
            (error) => {
                console.error("Error getting location:", error)
                alert("Impossible de récupérer votre position. Vérifiez vos autorisations.")
                setLoadingLocation(false)
            }
        )
    }

    const clearLocation = () => {
        localStorage.removeItem('user_lat')
        localStorage.removeItem('user_long')
        updateParams({
            lat: null,
            long: null,
            sort: searchParams.get('sort') === 'dist_asc' ? 'default' : searchParams.get('sort')
        })
    }

    const hasLocation = searchParams.has('lat') && searchParams.has('long')

    return (
        <div className="w-full flex flex-col gap-4">
            {/* Desktop Layout: FilterBar and Toggle on the same line */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-3 md:gap-4 w-full">
                <FilterBar />

                {/* View Toggle */}
                <div className="flex justify-center">
                    <div className="inline-flex bg-muted/60 p-0.5 rounded-lg border shadow-sm h-8 items-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setView('list')}
                            className={`rounded-md px-4 text-xs font-semibold transition-all h-7 ${view === 'list' ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-600 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <List className="h-3.5 w-3.5 mr-1.5" />
                            Liste
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setView('map')}
                            className={`rounded-md px-4 text-xs font-semibold transition-all h-7 ${view === 'map' ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-600 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <Map className="h-3.5 w-3.5 mr-1.5" />
                            Carte
                        </Button>
                    </div>
                </div>

                {/* Desktop Location Button */}
                <div className="hidden md:flex items-center">
                    {hasLocation ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearLocation}
                            className="whitespace-nowrap bg-green-50 text-green-700 border-green-200 hover:bg-green-100 rounded-full h-8 text-xs shadow-sm"
                        >
                            <MapPin className="mr-1.5 h-3.5 w-3.5 fill-current" />
                            Autour de moi
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLocationClick}
                            disabled={loadingLocation}
                            className="whitespace-nowrap rounded-full h-8 text-xs bg-background shadow-sm hover:shadow transition-all"
                        >
                            <MapPin className="mr-1.5 h-3.5 w-3.5" />
                            {loadingLocation ? 'Recherche...' : 'Autour de moi'}
                        </Button>
                    )}
                </div>
            </div>

            <div className="w-full mt-2">
                {view === 'list' ? (
                    <MenuFeed menus={menus} />
                ) : (
                    <RestaurantMap menus={menus} />
                )}
            </div>
        </div>
    )
}
