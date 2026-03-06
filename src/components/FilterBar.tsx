'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

  useEffect(() => {
    setCategory(searchParams.get('category') || 'all')
    setSort(searchParams.get('sort') || 'default')
  }, [searchParams])

  // Restore location from localStorage ONLY on initial mount
  useEffect(() => {
    const lat = searchParams.get('lat')
    const long = searchParams.get('long')
    const savedLat = localStorage.getItem('user_lat')
    const savedLong = localStorage.getItem('user_long')

    if (!lat && !long && savedLat && savedLong) {
      const params = new URLSearchParams(window.location.search)
      params.set('lat', savedLat)
      params.set('long', savedLong)
      params.set('sort', 'dist_asc')
      router.push(`/?${params.toString()}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

        // Save to localStorage for persistence
        localStorage.setItem('user_lat', latitude.toString())
        localStorage.setItem('user_long', longitude.toString())

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
    localStorage.removeItem('user_lat')
    localStorage.removeItem('user_long')

    updateParams({
      lat: null,
      long: null,
      sort: sort === 'dist_asc' ? 'default' : sort
    })
  }

  const hasLocation = searchParams.has('lat') && searchParams.has('long')

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4">
      {/* Horizontal scrolling Categories */}
      <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:hidden">
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
      <div className="flex flex-wrap items-center justify-between md:justify-start gap-3 px-1 md:px-0">
        <Select value={sort} onValueChange={(value) => handleSortChange(value)}>
          <SelectTrigger className="w-[130px] md:w-auto h-8 rounded-full bg-background/50 border shadow-sm text-xs">
            <div className="flex items-center gap-1.5">
              <ArrowDownAZ className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <SelectValue placeholder="Trier par" />
            </div>
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4}>
            <SelectItem value="default">Pertinence</SelectItem>
            {hasLocation && <SelectItem value="dist_asc">Plus proche</SelectItem>}
            <SelectItem value="price_asc">Prix: Croissant</SelectItem>
            <SelectItem value="price_desc">Prix: Décroissant</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center md:hidden">
          {hasLocation ? (
            <Button
              variant="outline"
              size="sm"
              onClick={clearLocation}
              className="whitespace-nowrap bg-yellow-500 text-slate-900 border-none hover:bg-yellow-600 rounded-full h-8 text-xs shadow-md font-bold"
            >
              <MapPin className="mr-1.5 h-3.5 w-3.5 fill-current" />
              Autour de moi
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLocationClick}
              disabled={loadingLocation}
              className="whitespace-nowrap rounded-full h-8 text-xs bg-background shadow-sm hover:shadow transition-all"
            >
              <MapPin className="mr-1.5 h-3.5 w-3.5" />
              {loadingLocation ? 'Recherche...' : 'Autour de moi'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
