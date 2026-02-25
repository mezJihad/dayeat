'use client'

import dynamic from 'next/dynamic'

// Dynamically import the map because Leaflet only works in the browser (uses window object)
const AddressLocationPicker = dynamic(() => import('./AddressLocationPicker'), {
    ssr: false,
    loading: () => <div className="w-full h-[300px] rounded-lg bg-muted animate-pulse" />
})

export function LocationPickerField() {
    return <AddressLocationPicker />
}
