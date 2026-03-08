'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

type Locale = 'fr' | 'en' | 'ar'

type Messages = {
    header: {
        slogan_line1: string
        slogan_highlight: string
        slogan_line2: string
        home: string
        favorites: string
        restaurant_space: string
        restaurateur_cta: string
    }
    bottomNav: {
        home: string
        favorites: string
        restaurant_space: string
        restaurateur_cta: string
    }
    home: {
        hero_title: string
        hero_subtitle: string
        no_menus: string
        no_menus_subtitle: string
    }
    locationPrompt: {
        title: string
        subtitle: string
        highlight: string
        button: string
        loading: string
        success: string
        error_denied: string
        error_unavailable: string
        error_timeout: string
        error_generic: string
        error_not_supported: string
    }
    auth: {
        login: string
        logout: string
        signup: string
        email: string
        password: string
        forgot_password: string
    }
    profileMenu: {
        my_restaurant: string
        settings: string
        logout: string
    }
}

const translations: Record<Locale, Messages> = {
    fr: {
        header: {
            slogan_line1: 'Les meilleurs',
            slogan_highlight: 'menus de jour',
            slogan_line2: 'autour de vous',
            home: 'Accueil',
            favorites: 'Mes Favoris',
            restaurant_space: 'Espace restaurant',
            restaurateur_cta: 'Vous êtes restaurateur ?',
        },
        bottomNav: {
            home: 'Accueil',
            favorites: 'Favoris',
            restaurant_space: 'Espace pro',
            restaurateur_cta: 'Restaurateur ?',
        },
        home: {
            hero_title: 'Les meilleurs menus de jour',
            hero_subtitle: "Découvrez les pépites culinaires disponibles près de chez vous aujourd'hui.",
            no_menus: 'Aucun menu disponible pour le moment.',
            no_menus_subtitle: 'Revenez plus tard ! 🕒',
        },
        locationPrompt: {
            title: 'Que mangez-vous autour de vous ?',
            subtitle: 'Activez la localisation pour découvrir immédiatement les pépites culinaires chaudes et disponibles à quelques mètres de votre position.',
            highlight: 'quelques mètres',
            button: 'Activer ma position',
            loading: 'Recherche...',
            success: 'Position trouvée ! Les plats les plus proches sont affichés en premier.',
            error_denied: "Vous avez refusé l'accès. Veuillez l'activer dans les paramètres de votre navigateur.",
            error_unavailable: 'Information de localisation indisponible.',
            error_timeout: 'La demande a pris trop de temps.',
            error_generic: 'Erreur lors de la localisation.',
            error_not_supported: "La géolocalisation n'est pas supportée par votre navigateur.",
        },
        auth: {
            login: 'Connexion',
            logout: 'Déconnexion',
            signup: 'Inscription',
            email: 'Email',
            password: 'Mot de passe',
            forgot_password: 'Mot de passe oublié ?',
        },
        profileMenu: {
            my_restaurant: 'Mon Restaurant',
            settings: 'Paramètres',
            logout: 'Déconnexion',
        },
    },
    en: {
        header: {
            slogan_line1: 'The best',
            slogan_highlight: 'daily menus',
            slogan_line2: 'near you',
            home: 'Home',
            favorites: 'My Favorites',
            restaurant_space: 'My Restaurant',
            restaurateur_cta: 'Are you a restaurateur?',
        },
        bottomNav: {
            home: 'Home',
            favorites: 'Favorites',
            restaurant_space: 'My Space',
            restaurateur_cta: 'Restaurateur?',
        },
        home: {
            hero_title: 'The best daily menus',
            hero_subtitle: 'Discover the culinary gems available near you today.',
            no_menus: 'No menu available at the moment.',
            no_menus_subtitle: 'Come back later! 🕒',
        },
        locationPrompt: {
            title: "What's around you to eat?",
            subtitle: 'Enable location to instantly discover hot culinary gems available a few meters from your position.',
            highlight: 'a few meters',
            button: 'Enable my location',
            loading: 'Searching...',
            success: 'Location found! The nearest dishes are displayed first.',
            error_denied: 'You denied access. Please enable it in your browser settings.',
            error_unavailable: 'Location information unavailable.',
            error_timeout: 'The request took too long.',
            error_generic: 'Error while locating.',
            error_not_supported: 'Geolocation is not supported by your browser.',
        },
        auth: {
            login: 'Login',
            logout: 'Logout',
            signup: 'Sign Up',
            email: 'Email',
            password: 'Password',
            forgot_password: 'Forgot password?',
        },
        profileMenu: {
            my_restaurant: 'My Restaurant',
            settings: 'Settings',
            logout: 'Logout',
        },
    },
    ar: {
        header: {
            slogan_line1: 'أفضل',
            slogan_highlight: 'قوائم اليوم',
            slogan_line2: 'بالقرب منك',
            home: 'الرئيسية',
            favorites: 'المفضلة',
            restaurant_space: 'فضاء المطعم',
            restaurateur_cta: 'هل أنت صاحب مطعم؟',
        },
        bottomNav: {
            home: 'الرئيسية',
            favorites: 'المفضلة',
            restaurant_space: 'فضائي',
            restaurateur_cta: 'مطعم؟',
        },
        home: {
            hero_title: 'أفضل قوائم اليوم',
            hero_subtitle: 'اكتشف أفضل الوجبات المتاحة بالقرب منك اليوم.',
            no_menus: 'لا توجد قائمة متاحة في الوقت الحالي.',
            no_menus_subtitle: 'عد لاحقاً! 🕒',
        },
        locationPrompt: {
            title: 'ما الذي يمكنك تناوله بالقرب منك؟',
            subtitle: 'فعّل الموقع الجغرافي لاكتشاف أفضل المطاعم والوجبات الساخنة المتاحة على بُعد أمتار من مكانك.',
            highlight: 'على بُعد أمتار',
            button: 'تفعيل موقعي',
            loading: 'جارٍ البحث...',
            success: 'تم تحديد موقعك! يتم عرض أقرب الأطباق أولاً.',
            error_denied: 'لقد رفضت الوصول. يرجى تفعيله في إعدادات المتصفح.',
            error_unavailable: 'معلومات الموقع غير متاحة.',
            error_timeout: 'استغرق الطلب وقتاً طويلاً.',
            error_generic: 'خطأ أثناء تحديد الموقع.',
            error_not_supported: 'المتصفح لا يدعم تحديد الموقع.',
        },
        auth: {
            login: 'تسجيل الدخول',
            logout: 'تسجيل الخروج',
            signup: 'إنشاء حساب',
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            forgot_password: 'نسيت كلمة المرور؟',
        },
        profileMenu: {
            my_restaurant: 'مطعمي',
            settings: 'الإعدادات',
            logout: 'تسجيل الخروج',
        },
    },
}

type LanguageContextType = {
    locale: Locale
    t: Messages
    setLocale: (locale: Locale) => void
    isRTL: boolean
}

const LanguageContext = createContext<LanguageContextType>({
    locale: 'fr',
    t: translations.fr,
    setLocale: () => { },
    isRTL: false,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('fr')

    useEffect(() => {
        // Read saved locale from cookie on mount
        const cookieLocale = document.cookie
            .split('; ')
            .find(row => row.startsWith('dayeat_locale='))
            ?.split('=')[1] as Locale | undefined

        if (cookieLocale && ['fr', 'en', 'ar'].includes(cookieLocale)) {
            setLocaleState(cookieLocale)
        }
    }, [])

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale)
        // Save to cookie (1 year expiry)
        document.cookie = `dayeat_locale=${newLocale};max-age=31536000;path=/`
        // Update document direction for RTL
        document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr'
        document.documentElement.lang = newLocale
    }, [])

    // Apply direction on locale change
    useEffect(() => {
        document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
        document.documentElement.lang = locale
    }, [locale])

    return (
        <LanguageContext.Provider
            value={{
                locale,
                t: translations[locale],
                setLocale,
                isRTL: locale === 'ar',
            }}
        >
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    return useContext(LanguageContext)
}
