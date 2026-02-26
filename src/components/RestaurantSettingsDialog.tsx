'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import { EditRestaurantForm } from './EditRestaurantForm'

export function RestaurantSettingsDialog({ restaurant }: { restaurant: any }) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-full border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm" title="Paramètres du restaurant">
                    <Settings className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Paramètres du Restaurant</DialogTitle>
                </DialogHeader>
                <EditRestaurantForm restaurant={restaurant} onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}
