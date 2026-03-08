'use client'

import { useState, useEffect } from 'react'
import { MapPin, Loader2, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function LocationPrompt() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [isMounted, setIsMounted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [hasLocationData, setHasLocationData] = useState(true) // Default to true to prevent initial pop-in

    useEffect(() => {
        setIsMounted(true)
        // Check if user already provided coordinates
        const lat = searchParams.get('lat')
        const long = searchParams.get('long')
        const category = searchParams.get('category')
        const isFavorites = searchParams.get('favorites') === 'true'

        // Only show if no coords, NOT looking at favorites, and NOT explicitly avoiding location
        setHasLocationData(!!(lat && long) || isFavorites || category === 'favorites')
    }, [searchParams])

    if (!isMounted || hasLocationData) {
        return null
    }

    const handleEnableLocation = () => {
        if (!navigator.geolocation) {
            toast.error("La géolocalisation n'est pas supportée par votre navigateur.")
            return
        }

        setIsLoading(true)

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude: lat, longitude: long } = pos.coords

                // Save to localStorage for persistence
                localStorage.setItem('user_lat', lat.toString())
                localStorage.setItem('user_long', long.toString())

                // Update URL params to reload feed data
                const params = new URLSearchParams(searchParams.toString())
                params.set('lat', lat.toString())
                params.set('long', long.toString())
                params.set('sort', 'dist_asc') // Automatically sort by distance!

                router.push(`/?${params.toString()}`)
                setIsLoading(false)
                toast.success("Position trouvée ! Les plats les plus proches sont affichés en premier.", {
                    icon: '📍'
                })
            },
            (err) => {
                setIsLoading(false)
                let errorMessage = "Erreur lors de la localisation."
                if (err.code === err.PERMISSION_DENIED) {
                    errorMessage = "Vous avez refusé l'accès. Veuillez l'activer dans les paramètres de votre navigateur."
                } else if (err.code === err.POSITION_UNAVAILABLE) {
                    errorMessage = "Information de localisation indisponible."
                } else if (err.code === err.TIMEOUT) {
                    errorMessage = "La demande a pris trop de temps."
                }
                toast.error(errorMessage)
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        )
    }

    return (
        <div className="mb-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200/60 shadow-sm">

                {/* Decorative background elements */}
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

                <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                    <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-full border border-yellow-200 shadow-inner">
                        <MapPin className="w-8 h-8 text-yellow-600 drop-shadow-sm" />
                    </div>

                    <div className="flex-1 space-y-1.5">
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Que mangez-vous autour de vous ?</h3>
                        <p className="text-sm text-slate-700 leading-relaxed max-w-lg mx-auto sm:mx-0">
                            Activez la localisation pour découvrir immédiatement les pépites culinaires chaudes et disponibles à <span className="font-semibold text-red-700">quelques mètres</span> de votre position.
                        </p>
                    </div>

                    <div className="w-full sm:w-auto mt-2 sm:mt-0 flex-shrink-0 flex items-center">
                        <Button
                            onClick={handleEnableLocation}
                            disabled={isLoading}
                            className={cn(
                                "w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl h-11 px-6 shadow-md transition-all hover:shadow-lg",
                                isLoading && "opacity-80 cursor-wait"
                            )}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Recherche...
                                </>
                            ) : (
                                <>
                                    <Navigation className="w-4 h-4 mr-2 fill-current" />
                                    Activer ma position
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
