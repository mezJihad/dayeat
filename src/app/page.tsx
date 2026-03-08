import { getTodayMenus } from './actions'
import { FilterBar } from '@/components/FilterBar'
import { FeedToggle } from '@/components/FeedToggle'
import { Footer } from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { Store } from 'lucide-react'
import { HomeHero, NoMenus } from '@/components/HomeHero'
import { LocationPrompt } from '@/components/LocationPrompt'
import { Suspense } from 'react'

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


      <HomeHero />

      <Suspense fallback={null}>
        <LocationPrompt />
      </Suspense>

      {menus.length === 0 ? (
        <NoMenus />
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
