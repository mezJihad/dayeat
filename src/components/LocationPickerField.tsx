'use client'

import dynamic from 'next/dynamic'

// Dynamically import the map because Leaflet only works in the browser (uses window object)
const AddressLocationPicker = dynamic<{ defaultAddress?: string, defaultLat?: number, defaultLong?: number }>(
    () => import('./AddressLocationPicker'), {
    ssr: false,
    loading: () => <div className="w-full h-[300px] rounded-lg bg-muted animate-pulse" />
}
)

export function LocationPickerField({
    defaultAddress,
    defaultLat,
    defaultLong
}: {
    defaultAddress?: string
    defaultLat?: number
    defaultLong?: number
}) {
    return <AddressLocationPicker defaultAddress={defaultAddress} defaultLat={defaultLat} defaultLong={defaultLong} />
}
