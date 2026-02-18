'use client'

import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { MapPin } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [category, setCategory] = useState(searchParams.get('category') || 'all')
  const [loadingLocation, setLoadingLocation] = useState(false)

  // Update local state when URL changes
  useEffect(() => {
    setCategory(searchParams.get('category') || 'all')
  }, [searchParams])

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set('category', value)
    } else {
      params.delete('category')
    }
    router.push(`/?${params.toString()}`)
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
        const params = new URLSearchParams(searchParams.toString())
        params.set('lat', latitude.toString())
        params.set('long', longitude.toString())
        router.push(`/?${params.toString()}`)
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
    const params = new URLSearchParams(searchParams.toString())
    params.delete('lat')
    params.delete('long')
    router.push(`/?${params.toString()}`)
  }

  const hasLocation = searchParams.has('lat') && searchParams.has('long')

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-card p-4 rounded-lg shadow-sm border">
      <div className="flex-1">
        <Select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full"
        >
          <option value="all">Tous les repas</option>
          <option value="Petit-Dej">Petit-Déjeuner</option>
          <option value="Dejeuner">Déjeuner</option>
          <option value="Gouter">Goûter</option>
          <option value="Diner">Dîner</option>
          <option value="AntiGaspi">Panier Anti-Gaspi ♻️</option>
          <option value="favorites">❤️ Mes Favoris</option>
        </Select>
      </div>

      <div className="flex gap-2">
        {hasLocation ? (
          <Button
            variant="outline"
            onClick={clearLocation}
            className="whitespace-nowrap bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          >
            <MapPin className="mr-2 h-4 w-4 fill-current" />
            Autour de moi
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={handleLocationClick}
            disabled={loadingLocation}
            className="whitespace-nowrap"
          >
            <MapPin className="mr-2 h-4 w-4" />
            {loadingLocation ? 'Localisation...' : 'Autour de moi'}
          </Button>
        )}
      </div>
    </div>
  )
}
