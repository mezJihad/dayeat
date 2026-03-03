'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        // Check if the user has already accepted or dismissed the banner
        const consent = localStorage.getItem('dayeat_cookie_consent')
        if (!consent) {
            setIsVisible(true)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('dayeat_cookie_consent', 'true')
        setIsVisible(false)
    }

    // Do not show on login or admin pages
    if (pathname?.startsWith('/login') || pathname?.startsWith('/admin')) {
        return null
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-[72px] left-0 right-0 z-50 p-4 sm:p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t shadow-lg">
            <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
                <div className="text-sm text-muted-foreground flex-1">
                    <p>
                        <strong>Respect de votre vie privée :</strong> DayEat n'utilise aucun cookie de traçage ou publicitaire.
                        Nous utilisons uniquement le stockage local de votre appareil pour mémoriser vos{' '}
                        <strong>restaurants favoris</strong> temporairement. Aucune donnée personnelle n'est envoyée à nos serveurs.
                    </p>
                    <p className="mt-1 text-xs">
                        Pour en savoir plus, consultez nos{' '}
                        <Link href="/terms" className="underline hover:text-primary">
                            Conditions d'utilisation
                        </Link>.
                    </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    <Button onClick={handleAccept} className="w-full sm:w-auto whitespace-nowrap bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold">
                        J'ai compris
                    </Button>
                </div>
            </div>
        </div>
    )
}
