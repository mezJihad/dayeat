'use client'

import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { MapPin, ArrowDownAZ } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

const CATEGORIES = [
  { value: 'all', label: 'Tous' },
  { value: 'Petit-Dej', label: 'Matin' },
  { value: 'Dejeuner', label: 'Midi' },
  { value: 'Gouter', label: 'Goûter' },
  { value: 'Diner', label: 'Soir' },
  { value: 'AntiGaspi', label: 'Anti-Gaspi ♻️' },
]

export function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [sort, setSort] = useState(searchParams.get('sort') || 'default')
  const [loadingLocation, setLoadingLocation] = useState(false)

  useEffect(() => {
    setCategory(searchParams.get('category') || 'all')
    setSort(searchParams.get('sort') || 'default')
  }, [searchParams])

  const updateParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    router.push(`/?${params.toString()}`)
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    updateParams({ category: value !== 'all' ? value : null })
  }

  const handleSortChange = (value: string) => {
    setSort(value)
    updateParams({ sort: value !== 'default' ? value : null })
  }

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.")
      return
    }

    setLoadingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        updateParams({
          lat: latitude.toString(),
          long: longitude.toString(),
          sort: 'dist_asc' // Default to distance sort when location is set
        })
        setLoadingLocation(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        alert("Impossible de récupérer votre position. Vérifiez vos autorisations.")
        setLoadingLocation(false)
      }
    )
  }

  const clearLocation = () => {
    updateParams({
      lat: null,
      long: null,
      sort: sort === 'dist_asc' ? 'default' : sort
    })
  }

  const hasLocation = searchParams.has('lat') && searchParams.has('long')

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Horizontal scrolling Categories */}
      <div className="flex overflow-x-auto gap-2 pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={`snap-start whitespace-nowrap px-4 py-2 rounded-full text-sm transition-colors ${category === cat.value
              ? 'bg-yellow-500 text-slate-900 font-bold shadow-md'
              : 'bg-card border hover:bg-muted text-foreground font-medium'
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sorting & Location Container */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 mt-1">
        <div className="flex items-center gap-1.5 text-muted-foreground mr-auto bg-background/50 rounded-full px-3 py-1.5 border hover:bg-muted transition-colors">
          <ArrowDownAZ className="h-4 w-4 shrink-0" />
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer outline-none w-full"
          >
            <option value="default">Pertinence</option>
            {hasLocation && <option value="dist_asc">Plus proche</option>}
            <option value="price_asc">Prix: Croissant</option>
            <option value="price_desc">Prix: Décroissant</option>
          </select>
        </div>

        <div className="flex items-center">
          {hasLocation ? (
            <Button
              variant="outline"
              size="sm"
              onClick={clearLocation}
              className="whitespace-nowrap bg-green-50 text-green-700 border-green-200 hover:bg-green-100 rounded-full h-9 shadow-sm"
            >
              <MapPin className="mr-2 h-4 w-4 fill-current" />
              Autour de moi
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLocationClick}
              disabled={loadingLocation}
              className="whitespace-nowrap rounded-full h-9 bg-background shadow-sm hover:shadow transition-all"
            >
              <MapPin className="mr-2 h-4 w-4" />
              {loadingLocation ? 'Recherche...' : 'Autour de moi'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
