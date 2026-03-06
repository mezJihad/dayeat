import Link from 'next/link'
import { Store } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FooterProps {
    className?: string
}

export function Footer({ className }: FooterProps) {
    return (
        <footer className={cn("w-full py-8 mt-12 mb-4 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-4 text-center", className)}>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
                <Link href="/terms" className="hover:text-primary transition-colors">
                    Conditions d'utilisation
                </Link>
                <span className="hidden sm:inline text-slate-300">•</span>
                <Link href="/login" className="flex items-center hover:text-primary transition-colors">
                    <Store className="w-4 h-4 mr-1.5" />
                    Vous êtes restaurateur ?
                </Link>
            </div>
            <p className="text-xs text-muted-foreground/70">
                &copy; {new Date().getFullYear()} DayEat. Tous droits réservés.
            </p>
        </footer>
    )
}
