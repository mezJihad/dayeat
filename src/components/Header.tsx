'use client'

import Link from 'next/link'
import { Home, Heart, Store, ChefHat } from 'lucide-react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'
import { ProfileMenu } from './ProfileMenu'
import { getRestaurant } from '@/app/actions'

export function Header({ initialUser, initialRestaurant }: { initialUser?: any, initialRestaurant?: any }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()

    // Use server-provided data as initial state for instant rendering
    const [user, setUser] = useState<any>(initialUser || null)
    const [restaurant, setRestaurant] = useState<any>(initialRestaurant || null)

    const supabase = createClient()

    // Sync state if server props update (e.g., after a redirect from server action)
    useEffect(() => {
        setUser(initialUser || null)
        setRestaurant(initialRestaurant || null)
    }, [initialUser, initialRestaurant])

    // Client-side listener mainly for rapid logout feedback
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                setUser(null)
                setRestaurant(null)
                router.refresh()
            }
        })

        return () => subscription.unsubscribe()
    }, [supabase.auth, router])

    const isActive = (path: string) => pathname === path && !searchParams.get('favorites')
    const isFavorites = searchParams.get('favorites') === 'true'

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Mobile/Tablet Logo & Text (Visible when sidebar hidden) */}
                <div className="flex items-center gap-3 md:hidden">
                    <Link href="/" className="relative h-10 w-10 shrink-0">
                        <Image src="/logo.png" alt="DayEat" fill className="object-contain rounded-full" />
                    </Link>
                    <span className="text-[11px] sm:text-xs font-medium leading-tight text-slate-800">
                        {user && pathname.startsWith('/admin') ? (
                            <span className="text-black dark:text-white">
                                Les meilleurs <span className="text-red-700 font-bold">menus de jour</span>
                                <br />
                                autour de vous
                            </span>
                        ) : (
                            <>
                                Les meilleurs <span className="text-red-700 font-bold">menus de jour</span>
                                <br />
                                autour de vous
                            </>
                        )}
                    </span>
                </div>

                {/* Left Side: Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/"
                        className={cn(
                            "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                            isActive('/') && !isFavorites ? "text-red-700" : "text-muted-foreground"
                        )}
                    >
                        <Home className="h-4 w-4" />
                        Accueil
                    </Link>
                    <Link
                        href="/?favorites=true"
                        className={cn(
                            "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                            isFavorites ? "text-red-700" : "text-muted-foreground"
                        )}
                    >
                        <Heart className={cn("h-4 w-4", isFavorites && "fill-current")} />
                        Mes Favoris
                    </Link>

                    {/* Desktop Only: Restaurant Space Link in Nav */}
                    {user && (
                        <Link
                            href="/admin"
                            className={cn(
                                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                                pathname.startsWith('/admin') ? "text-red-700" : "text-muted-foreground"
                            )}
                        >
                            <ChefHat className="h-4 w-4" />
                            Espace restaurant
                        </Link>
                    )}
                </nav>

                {/* Right Side: CTA or Profile */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-3">
                            {/* Profile Menu (Avatar) for Desktop */}
                            <ProfileMenu restaurant={restaurant} />
                        </div>
                    ) : (
                        <Link
                            href="/admin"
                            className="hidden md:inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 rounded-full shadow-sm bg-slate-900 text-slate-50 hover:bg-slate-900/90"
                        >
                            <Store className="mr-2 h-4 w-4" />
                            <span>Vous êtes restaurateur ?</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
