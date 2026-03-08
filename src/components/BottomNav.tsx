'use client'

import Link from 'next/link'
import { Home, ChefHat, Heart, Coffee, Utensils, IceCream, Moon, Leaf, ArrowDownAZ, List, Map, MapPin, Store } from 'lucide-react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function BottomNav({ initialUser }: { initialUser?: any }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    const [loadingLocation, setLoadingLocation] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const [user, setUser] = useState<any>(initialUser || null)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        setUser(initialUser || null)
    }, [initialUser])

    if (!isMounted) {
        return null // Avoid SSR hydration mismatches
    }

    const isActive = (path: string) => pathname === path
    const activeCategory = isMounted ? (searchParams.get('category') || 'all') : 'all'
    const view = isMounted ? (searchParams.get('view') || 'list') : 'list'
    const sort = isMounted ? (searchParams.get('sort') || 'default') : 'default'
    const isFavorites = isMounted ? searchParams.get('favorites') === 'true' : false
    const hasLocation = isMounted ? (searchParams.has('lat') && searchParams.has('long')) : false

    const updateParams = (newParams: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString())
        Object.entries(newParams).forEach(([key, value]) => {
            if (value) params.set(key, value)
            else params.delete(key)
        })
        router.push(`/?${params.toString()}`)
    }

    const handleLocationClick = () => {
        if (!navigator.geolocation) return alert("La géolocalisation n'est pas supportée")
        setLoadingLocation(true)
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude: lat, longitude: long } = pos.coords
                localStorage.setItem('user_lat', lat.toString())
                localStorage.setItem('user_long', long.toString())
                updateParams({ lat: lat.toString(), long: long.toString(), sort: 'dist_asc' })
                setLoadingLocation(false)
            },
            () => {
                alert("Erreur de localisation")
                setLoadingLocation(false)
            }
        )
    }

    const clearLocation = () => {
        localStorage.removeItem('user_lat')
        localStorage.removeItem('user_long')
        updateParams({ lat: null, long: null, sort: sort === 'dist_asc' ? 'default' : sort })
    }

    // Categories
    const CATEGORIES = [
        { value: 'all', label: 'Tous', icon: Home },
        { value: 'Petit-Dej', label: 'Matin', icon: Coffee },
        { value: 'Dejeuner', label: 'Midi', icon: Utensils },
        { value: 'Gouter', label: 'Goûter', icon: IceCream },
        { value: 'Diner', label: 'Soir', icon: Moon },
        { value: 'AntiGaspi', label: 'Anti-Gaspi', icon: Leaf },
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t md:border-t-0 md:border-r bg-background p-2 pb-4 md:p-4 md:w-64 md:top-0 md:h-screen md:flex md:flex-col shadow-[0_-1px_3px_rgba(0,0,0,0.1)] md:shadow-[1px_0_3px_rgba(0,0,0,0.05)]">
            {/* Desktop Brand Header */}
            <div className="hidden md:flex flex-col items-center justify-center gap-3 px-2 pt-0 pb-4 mb-2">
                <div className="relative p-2 bg-white rounded-full shadow-md shrink-0">
                    <img src="/logo.png" alt="DayEat Logo" width={90} height={90} className="object-cover rounded-full" />
                </div>
            </div>

            <div className="mx-auto grid w-full max-w-md grid-cols-3 gap-1 md:flex md:flex-col md:max-w-none md:gap-2">
                <Link
                    href="/"
                    className={cn(
                        "flex flex-col md:flex-row items-center md:justify-start rounded-lg py-2 md:py-3 md:px-4 text-xs md:text-sm font-medium transition-colors hover:bg-muted",
                        isActive('/') && !isFavorites ? "text-red-700 bg-red-50/50" : "text-muted-foreground",
                        "md:hidden" // Hidden on Desktop sidebar as it's in the Header
                    )}
                >
                    <Home className="mb-1 md:mb-0 md:mr-3 h-5 w-5" />
                    <span>Accueil</span>
                </Link>
                <Link
                    href="/?favorites=true"
                    className={cn(
                        "flex flex-col md:flex-row items-center md:justify-start rounded-lg py-2 md:py-3 md:px-4 text-xs md:text-sm font-medium transition-colors hover:bg-muted",
                        isFavorites ? "text-red-700 bg-red-50/50" : "text-muted-foreground",
                        "md:hidden" // Hidden on Desktop sidebar
                    )}
                >
                    <Heart className="mb-1 md:mb-0 md:mr-3 h-5 w-5" />
                    <span>Favoris</span>
                </Link>
                <Link
                    href="/admin"
                    className={cn(
                        "flex flex-col md:flex-row items-center md:justify-start rounded-lg py-2 md:py-3 md:px-4 text-xs md:text-sm font-medium transition-colors hover:bg-muted",
                        isActive('/admin') ? "text-red-700 bg-red-50/50" : "text-muted-foreground",
                        "md:hidden" // Hidden on Desktop sidebar
                    )}
                >
                    {user ? (
                        <>
                            <ChefHat className="mb-1 md:mb-0 md:mr-3 h-5 w-5" />
                            <span>Espace pro</span>
                        </>
                    ) : (
                        <>
                            <Store className="mb-1 md:mb-0 md:mr-3 h-5 w-5" />
                            <span>Restaurateur ?</span>
                        </>
                    )}
                </Link>
            </div>

            {/* Desktop Tools Section */}
            <div className="hidden md:flex flex-col gap-6 px-2">
                {/* 1. Location Tool */}
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider px-2">Localisation</span>
                    {hasLocation ? (
                        <Button
                            variant="outline"
                            onClick={clearLocation}
                            className="w-full justify-start h-9 rounded-xl bg-yellow-500 text-slate-900 border-none hover:bg-yellow-600 text-xs shadow-md font-bold"
                        >
                            <MapPin className="mr-2 h-4 w-4 fill-current" />
                            Proche de moi (Activé)
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={handleLocationClick}
                            disabled={loadingLocation}
                            className="w-full justify-start h-9 rounded-xl bg-background border-slate-200 shadow-sm hover:shadow-md transition-all text-xs"
                        >
                            <MapPin className="mr-2 h-4 w-4 text-slate-400" />
                            {loadingLocation ? 'Recherche...' : 'Autour de moi'}
                        </Button>
                    )}
                </div>

                {/* 2. Sorting Tool */}
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider px-2">Trier par</span>
                    <Select value={sort} onValueChange={(v) => updateParams({ sort: v === 'default' ? null : v })}>
                        <SelectTrigger className="w-full h-9 rounded-xl border-slate-200 shadow-sm text-xs bg-background focus:ring-red-500">
                            <div className="flex items-center gap-2">
                                <ArrowDownAZ className="h-4 w-4 text-slate-400" />
                                <SelectValue placeholder="Pertinence" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="default">Pertinence</SelectItem>
                            {hasLocation && <SelectItem value="dist_asc">Le plus proche</SelectItem>}
                            <SelectItem value="price_asc">Prix croissant</SelectItem>
                            <SelectItem value="price_desc">Prix décroissant</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* 3. View Toggle */}
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider px-2">Affichage</span>
                    <div className="grid grid-cols-2 bg-muted/50 p-1 rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateParams({ view: 'list' })}
                            className={cn("h-8 rounded-lg text-xs font-semibold transition-all", view === 'list' ? "bg-yellow-500 text-slate-900 shadow-sm" : "text-muted-foreground hover:bg-slate-200")}
                        >
                            <List className="h-3.5 w-3.5 mr-1.5" />
                            Liste
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateParams({ view: 'map' })}
                            className={cn("h-8 rounded-lg text-xs font-semibold transition-all", view === 'map' ? "bg-yellow-500 text-slate-900 shadow-sm" : "text-muted-foreground hover:bg-slate-200")}
                        >
                            <Map className="h-3.5 w-3.5 mr-1.5" />
                            Carte
                        </Button>
                    </div>
                </div>

                {/* 4. Categories */}
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider px-2">Catégories</span>
                    <div className="flex flex-col gap-1">
                        {CATEGORIES.map((cat) => {
                            const Icon = cat.icon
                            const isSelected = activeCategory === cat.value && !isFavorites
                            const currentParams = new URLSearchParams(isMounted ? searchParams.toString() : '')
                            if (cat.value === 'all') currentParams.delete('category')
                            else currentParams.set('category', cat.value)
                            currentParams.delete('favorites')

                            return (
                                <Link
                                    key={cat.value}
                                    href={`/?${currentParams.toString()}`}
                                    className={cn(
                                        "flex items-center justify-start rounded-xl py-2 px-4 text-sm transition-all duration-200",
                                        isSelected ? "text-slate-900 bg-yellow-500 shadow-md font-bold scale-[1.02]" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    )}
                                >
                                    <Icon className="mr-3 h-4 w-4" />
                                    <span>{cat.label}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Desktop Footer Info */}
            <div suppressHydrationWarning className="hidden md:block mt-auto pt-4 text-[10px] text-muted-foreground text-center opacity-60">
                &copy; {new Date().getFullYear()} DayEat
            </div>
        </div>
    )
}

