'use client'

import { useState } from 'react'
import { MenuFeed } from '@/components/MenuFeed'
import { RestaurantMap } from '@/components/RestaurantMap'
import { Map, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FilterBar } from '@/components/FilterBar'

interface FeedToggleProps {
    menus: any[]
}

export function FeedToggle({ menus }: FeedToggleProps) {
    const [view, setView] = useState<'list' | 'map'>('list')

    return (
        <div className="w-full flex flex-col gap-4">
            {/* Desktop Layout: FilterBar and Toggle on the same line */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-3 md:gap-4 w-full">
                <FilterBar />

                {/* View Toggle */}
                <div className="flex justify-center md:justify-end">
                    <div className="inline-flex bg-muted/60 p-0.5 rounded-lg border shadow-sm h-8 items-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setView('list')}
                            className={`rounded-md px-4 text-xs font-semibold transition-all h-7 ${view === 'list' ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-600 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <List className="h-3.5 w-3.5 mr-1.5" />
                            Liste
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setView('map')}
                            className={`rounded-md px-4 text-xs font-semibold transition-all h-7 ${view === 'map' ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-600 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <Map className="h-3.5 w-3.5 mr-1.5" />
                            Carte
                        </Button>
                    </div>
                </div>
            </div>

            <div className="w-full mt-2">
                {view === 'list' ? (
                    <MenuFeed menus={menus} />
                ) : (
                    <RestaurantMap menus={menus} />
                )}
            </div>
        </div>
    )
}
