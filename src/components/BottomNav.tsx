'use client'

import Link from 'next/link'
import { Home, ChefHat, Heart } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

export function BottomNav() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const isActive = (path: string) => pathname === path

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-2 pb-4 shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
            <div className="mx-auto grid max-w-md grid-cols-3 gap-1">
                <Link
                    href="/"
                    className={cn(
                        "flex flex-col items-center justify-center rounded-lg py-2 text-xs font-medium transition-colors hover:bg-muted",
                        isActive('/') && !searchParams.get('favorites') ? "text-red-700" : "text-muted-foreground"
                    )}
                >
                    <Home className="mb-1 h-5 w-5" />
                    <span>Accueil</span>
                </Link>
                <Link
                    href="/?favorites=true"
                    className={cn(
                        "flex flex-col items-center justify-center rounded-lg py-2 text-xs font-medium transition-colors hover:bg-muted",
                        searchParams.get('favorites') === 'true' ? "text-red-700" : "text-muted-foreground"
                    )}
                >
                    <Heart className="mb-1 h-5 w-5" />
                    <span>Favoris</span>
                </Link>
                <Link
                    href="/admin"
                    className={cn(
                        "flex flex-col items-center justify-center rounded-lg py-2 text-xs font-medium transition-colors hover:bg-muted",
                        isActive('/admin') ? "text-red-700" : "text-muted-foreground"
                    )}
                >
                    <ChefHat className="mb-1 h-5 w-5" />
                    <span>Espace restaurant</span>
                </Link>
            </div>
        </div>
    )
}
