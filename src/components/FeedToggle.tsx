'use client'

import { useState } from 'react'
import { MenuFeed } from '@/components/MenuFeed'
import { RestaurantMap } from '@/components/RestaurantMap'
import { Map, List } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FeedToggleProps {
    menus: any[]
}

export function FeedToggle({ menus }: FeedToggleProps) {
    const [view, setView] = useState<'list' | 'map'>('list')

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="flex justify-center w-full">
                <div className="inline-flex bg-muted/60 p-1 rounded-lg border shadow-sm">
                    <Button
                        variant={view === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setView('list')}
                        className={`rounded-md px-6 transition-all ${view === 'list' ? 'shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <List className="h-4 w-4 mr-2" />
                        Liste
                    </Button>
                    <Button
                        variant={view === 'map' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setView('map')}
                        className={`rounded-md px-6 transition-all ${view === 'map' ? 'shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <Map className="h-4 w-4 mr-2" />
                        Carte
                    </Button>
                </div>
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
