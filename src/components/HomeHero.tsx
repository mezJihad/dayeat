'use client'

import { useLanguage } from '@/context/LanguageContext'

export function HomeHero() {
    const { t } = useLanguage()
    return (
        <div className="hidden md:flex flex-col items-center justify-center mb-8 text-center pt-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-[#27251F] dark:text-white tracking-tight">
                {t.home.hero_title}
            </h1>
            <p className="mt-2 text-muted-foreground text-base max-w-lg">
                {t.home.hero_subtitle}
            </p>
        </div>
    )
}

export function NoMenus() {
    const { t } = useLanguage()
    return (
        <div className="flex-1 flex flex-col justify-center text-center py-20 text-muted-foreground">
            <p>{t.home.no_menus}</p>
            <p className="text-sm mt-2">{t.home.no_menus_subtitle}</p>
        </div>
    )
}
