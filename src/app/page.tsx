import { getTodayMenus } from './actions'
import { FilterBar } from '@/components/FilterBar'
import { FeedToggle } from '@/components/FeedToggle'
import Image from 'next/image'

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
    <div className="container mx-auto p-4 max-w-2xl">
      <header className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="relative p-1 bg-white rounded-full shadow-sm shrink-0">
            <Image
              src="/logo.png"
              alt="DayEat Logo"
              width={65}
              height={65}
              className="object-contain rounded-full"
              priority
            />
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-medium leading-snug">
            Les meilleurs <span className="text-red-700 font-bold">menus du jour</span><br />autour de vous
          </p>
        </div>
      </header>

      <FilterBar />

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
    </div>
  )
}
