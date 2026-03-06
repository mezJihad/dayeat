'use client'

import Link from 'next/link'
import { Home, ChefHat, Heart, Coffee, Utensils, IceCream, Moon, Leaf } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

export function BottomNav() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const isActive = (path: string) => pathname === path
    const activeCategory = searchParams.get('category') || 'all'

    // Define categories to mimic FilterBar
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
            <div className="hidden md:flex flex-col items-center justify-center gap-3 px-2 py-4 mb-2 mt-2">
                <div className="relative p-2 bg-white rounded-full shadow-md shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="DayEat Logo" width={90} height={90} className="object-cover rounded-full" />
                </div>
            </div>

            <div className="mx-auto grid w-full max-w-md grid-cols-3 gap-1 md:flex md:flex-col md:max-w-none md:gap-2">
                <Link
                    href="/"
                    className={cn(
                        "flex flex-col md:flex-row items-center md:justify-start rounded-lg py-2 md:py-3 md:px-4 text-xs md:text-sm font-medium transition-colors hover:bg-muted",
                        isActive('/') && !searchParams.get('favorites') ? "text-red-700 bg-red-50/50 dark:bg-red-950/20 md:bg-red-50 dark:md:bg-red-950/30" : "text-muted-foreground"
                    )}
                >
                    <Home className="mb-1 md:mb-0 md:mr-3 h-5 w-5" />
                    <span>Accueil</span>
                </Link>
                <Link
                    href="/?favorites=true"
                    className={cn(
                        "flex flex-col md:flex-row items-center md:justify-start rounded-lg py-2 md:py-3 md:px-4 text-xs md:text-sm font-medium transition-colors hover:bg-muted",
                        searchParams.get('favorites') === 'true' ? "text-red-700 bg-red-50/50 dark:bg-red-950/20 md:bg-red-50 dark:md:bg-red-950/30" : "text-muted-foreground"
                    )}
                >
                    <Heart className="mb-1 md:mb-0 md:mr-3 h-5 w-5" />
                    <span>Favoris</span>
                </Link>
                <Link
                    href="/admin"
                    className={cn(
                        "flex flex-col md:flex-row items-center md:justify-start rounded-lg py-2 md:py-3 md:px-4 text-xs md:text-sm font-medium transition-colors hover:bg-muted",
                        isActive('/admin') ? "text-red-700 bg-red-50/50 dark:bg-red-950/20 md:bg-red-50 dark:md:bg-red-950/30" : "text-muted-foreground"
                    )}
                >
                    <ChefHat className="mb-1 md:mb-0 md:mr-3 h-5 w-5" />
                    <span>Espace restaurant</span>
                </Link>
            </div>

            {/* Desktop Filters (Sidebar only) */}
            <div className="hidden md:flex md:flex-col mt-6 pt-6 border-t px-2 gap-1">
                <span className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Catégories
                </span>
                {CATEGORIES.map((cat) => {
                    const Icon = cat.icon
                    const isSelected = activeCategory === cat.value && !searchParams.get('favorites')

                    // Preserve existing location/sort params when filtering
                    const currentParams = new URLSearchParams(searchParams.toString())
                    if (cat.value === 'all') {
                        currentParams.delete('category')
                    } else {
                        currentParams.set('category', cat.value)
                    }
                    currentParams.delete('favorites') // Clearing favorites when picking a category

                    return (
                        <Link
                            key={cat.value}
                            href={`/?${currentParams.toString()}`}
                            className={cn(
                                "flex items-center justify-start rounded-lg py-2.5 px-4 text-sm font-medium transition-colors hover:bg-muted",
                                isSelected ? "text-slate-900 bg-yellow-500 hover:bg-yellow-600 shadow-sm font-bold" : "text-slate-600 hover:text-slate-900"
                            )}
                        >
                            <Icon className="mr-3 h-4 w-4" />
                            <span>{cat.label}</span>
                        </Link>
                    )
                })}
            </div>

            {/* Desktop Footer Info */}
            <div className="hidden md:block mt-auto pt-4 border-t text-xs text-muted-foreground text-center">
                &copy; {new Date().getFullYear()} DayEat
            </div>
        </div>
    )
}
