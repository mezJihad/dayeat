'use client'

import { deleteMenu, toggleMenuStatus, republishMenu } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Trash2, Eye, EyeOff, RotateCcw } from 'lucide-react'
import { useState } from 'react'

interface AdminMenuCardProps {
    menu: {
        id: string
        title: string
        price: number
        photo_url: string | null
        is_sold_out: boolean
        meal_period: string
        created_at: string
    }
    isHistory?: boolean
}

export function AdminMenuCard({ menu, isHistory = false }: AdminMenuCardProps) {
    const [loading, setLoading] = useState(false)

    const handleToggleStatus = async () => {
        setLoading(true)
        try {
            await toggleMenuStatus(menu.id, !menu.is_sold_out)
        } catch (error) {
            console.error("Failed to toggle status", error)
            alert("Erreur lors de la mise à jour du statut")
        } finally {
            setLoading(false)
        }
    }

    const handleRepublish = async () => {
        if (!confirm("Voulez-vous republier ce menu pour aujourd'hui ?")) return

        setLoading(true)
        try {
            await republishMenu(menu.id)
        } catch (error) {
            console.error("Failed to republish menu", error)
            alert("Erreur lors de la republication")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce plat ?")) return

        setLoading(true)
        try {
            await deleteMenu(menu.id)
        } catch (error) {
            console.error("Failed to delete menu", error)
            alert("Erreur lors de la suppression")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className={`overflow-hidden transition-all ${menu.is_sold_out ? 'opacity-75 bg-muted' : 'bg-card'}`}>
            <div className="flex flex-row">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted relative shrink-0">
                    <img
                        src={menu.photo_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200"}
                        alt={menu.title}
                        className="w-full h-full object-cover"
                    />
                    {menu.is_sold_out && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold -rotate-12">
                            ÉPUISÉ
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col justify-between p-3">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-sm line-clamp-1">{menu.title}</h3>
                            <span className="font-bold text-sm text-green-600">{menu.price} DH</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 capitalize">{menu.meal_period}</p>
                    </div>

                    <div className="flex gap-2 justify-end mt-2">
                        <Button
                            variant={menu.is_sold_out ? "default" : "outline"}
                            size="sm"
                            onClick={isHistory ? handleRepublish : handleToggleStatus}
                            disabled={loading}
                            className="h-8 text-xs"
                        >
                            {isHistory ? (
                                <>
                                    <RotateCcw className="w-3 h-3 mr-1" /> Republier
                                </>
                            ) : (
                                <>
                                    {menu.is_sold_out ? (
                                        <>
                                            <Eye className="w-3 h-3 mr-1" /> Activer
                                        </>
                                    ) : (
                                        <>
                                            <EyeOff className="w-3 h-3 mr-1" /> Épuisé
                                        </>
                                    )}
                                </>
                            )}
                        </Button>

                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={handleDelete}
                            disabled={loading}
                            className="h-8 w-8"
                        >
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
