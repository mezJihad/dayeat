'use client'

import { useState, useEffect } from 'react'
import { MenuFeed } from '@/components/MenuFeed'
import { RestaurantMap } from '@/components/RestaurantMap'
import { Map, List, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FilterBar } from '@/components/FilterBar'
import { useRouter, useSearchParams } from 'next/navigation'

interface FeedToggleProps {
    menus: any[]
}

export function FeedToggle({ menus }: FeedToggleProps) {
    const searchParams = useSearchParams()
    const view = (searchParams.get('view') as 'list' | 'map') || 'list'

    return (
        <div className="w-full flex flex-col gap-4">
            {/* Toolbar: Visible ONLY on Mobile, hidden on Desktop (already in sidebar) */}
            <div className="flex flex-col gap-3 w-full md:hidden">
                <FilterBar />
            </div>

            <div className="w-full">
                {view === 'list' ? (
                    <MenuFeed menus={menus} />
                ) : (
                    <RestaurantMap menus={menus} />
                )}
            </div>
        </div>
    )
}

