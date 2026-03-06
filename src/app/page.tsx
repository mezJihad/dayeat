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
    <div className="container mx-auto p-4 max-w-2xl md:max-w-6xl md:py-8 flex-1 flex flex-col">
      {/* Mobile Title */}
      <h1 className="md:hidden text-[#27251F] dark:text-white text-base font-bold mb-6 pb-2 border-b border-slate-100">
        Les meilleurs <span className="text-red-700">menus du jour</span>
      </h1>

      {/* Desktop Hero Title */}
      <div className="hidden md:flex flex-col items-center justify-center mb-12 text-center pt-4">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-[#27251F] dark:text-white tracking-tight">
          Les meilleurs <span className="text-red-700">menus du jour</span>
        </h1>
        <p className="mt-4 text-muted-foreground text-lg max-w-lg">
          Découvrez les pépites culinaires disponibles près de chez vous aujourd&apos;hui.
        </p>
      </div>

      {menus.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center text-center py-20 text-muted-foreground">
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

      <Footer className="mt-auto" />
    </div>
  )
}
