import { getTodayMenus } from './actions'
import { FilterBar } from '@/components/FilterBar'
import { FeedToggle } from '@/components/FeedToggle'
import { Footer } from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { Store } from 'lucide-react'

interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Home({ searchParams }: HomeProps) {
  const resolvedParams = await searchParams
  const category = resolvedParams.category as string
  const lat = resolvedParams.lat ? parseFloat(resolvedParams.lat as string) : undefined
  const long = resolvedParams.long ? parseFloat(resolvedParams.long as string) : undefined
  const sort = (resolvedParams.sort as string) || 'default'

  // If category is favorites, we fetch ALL menus and filter client-side
  const serverCategory = category === 'favorites' ? undefined : category
  let menus = await getTodayMenus({ category: serverCategory, lat, long })

  // Apply sorting
  if (sort === 'price_asc') {
    menus.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
  } else if (sort === 'price_desc') {
    menus.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
  } else if (sort === 'dist_asc' && lat && long) {
    menus.sort((a, b) => (a.dist_meters || 0) - (b.dist_meters || 0))
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl md:max-w-6xl md:py-8">
      <header className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800 md:flex md:justify-between md:items-center">
        <div className="flex items-center gap-4">
          <div className="relative p-1 bg-white rounded-full shadow-sm shrink-0 md:hidden">
            <Image
              src="/logo.png"
              alt="DayEat Logo"
              width={65}
              height={65}
              className="object-contain rounded-full"
              priority
            />
          </div>
          <h1 className="text-[#27251F] dark:text-white text-sm sm:text-base md:text-2xl lg:text-3xl font-bold leading-snug md:leading-tight">
            Les meilleurs <span className="text-red-700 font-bold">menus du jour</span>
            <br className="md:hidden" />
            <span className="hidden md:inline"> </span>
            autour de vous
          </h1>
        </div>

        {/* Desktop CTA Restaurateur */}
        <div className="hidden md:block">
          <Link
            href="/admin"
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-6 py-2 rounded-full shadow-md"
          >
            <Store className="mr-2 h-4 w-4" />
            Vous &ecirc;tes restaurateur ?
          </Link>
        </div>
      </header>

      {menus.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>Aucun menu disponible pour le moment.</p>
          <p className="text-sm mt-2">Revenez plus tard ! 🕒</p>
        </div>
      ) : (
        <div className="w-full">
          <FeedToggle
            menus={menus.map((menu: any) => ({
              ...menu,
              restaurant_name: menu.restaurants?.name || menu.restaurant_name,
              restaurant_phone: menu.restaurants?.whatsapp_phone || menu.restaurant_phone,
              restaurant_address: menu.restaurants?.address || menu.restaurant_address,
              lat: menu.restaurants?.lat || menu.restaurant_lat,
              long: menu.restaurants?.long || menu.restaurant_long,
              dist_meters: menu.dist_meters || 0
            }))}
          />
        </div>
      )}

      <Footer />
    </div>
  )
}
