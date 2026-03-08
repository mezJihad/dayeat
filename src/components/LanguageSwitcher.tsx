'use client'

import { useLanguage } from '@/context/LanguageContext'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

const LOCALES = [
    { code: 'fr' as const, label: 'Français', flag: '🇫🇷' },
    { code: 'en' as const, label: 'English', flag: '🇬🇧' },
    { code: 'ar' as const, label: 'العربية', flag: '🇲🇦' },
]

export function LanguageSwitcher() {
    const { locale, setLocale } = useLanguage()
    const current = LOCALES.find(l => l.code === locale) || LOCALES[0]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground h-9 px-2"
                    aria-label="Change language"
                >
                    <Globe className="h-4 w-4" />
                    <span className="text-sm font-medium hidden sm:inline">{current.flag} {current.code.toUpperCase()}</span>
                    <span className="text-sm font-medium sm:hidden">{current.flag}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                {LOCALES.map((loc) => (
                    <DropdownMenuItem
                        key={loc.code}
                        onClick={() => setLocale(loc.code)}
                        className={`flex items-center gap-2 cursor-pointer ${locale === loc.code ? 'font-bold text-primary' : ''}`}
                    >
                        <span>{loc.flag}</span>
                        <span>{loc.label}</span>
                        {locale === loc.code && <span className="ml-auto text-xs text-primary">✓</span>}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
