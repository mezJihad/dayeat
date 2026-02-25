'use client'

import { deleteMenu, toggleMenuStatus, republishMenu } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AddMenuForm } from '@/components/AddMenuForm'
import { Trash2, Eye, EyeOff, RotateCcw, Pencil } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface AdminMenuCardProps {
    menu: {
        id: string
        title: string
        price: number
        description: string | null
        photo_url: string | null
        is_sold_out: boolean
        meal_period: string
        created_at: string
        accepts_reservations: boolean | null
    }
    isHistory?: boolean
}

export function AdminMenuCard({ menu, isHistory = false }: AdminMenuCardProps) {
    const [loading, setLoading] = useState(false)
    const [isRepublishOpen, setIsRepublishOpen] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const handleToggleStatus = async () => {
        setLoading(true)
        try {
            await toggleMenuStatus(menu.id, !menu.is_sold_out)
            toast.success("Statut mis à jour")
        } catch (error) {
            console.error("Failed to toggle status", error)
            toast.error("Erreur lors de la mise à jour du statut")
        } finally {
            setLoading(false)
        }
    }

    const handleRepublish = async () => {
        setLoading(true)
        try {
            await republishMenu(menu.id)
            toast.success("Menu republié avec succès")
            setIsRepublishOpen(false)
        } catch (error) {
            console.error("Failed to republish menu", error)
            toast.error("Erreur lors de la republication")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        setLoading(true)
        try {
            await deleteMenu(menu.id)
            toast.success("Menu supprimé")
            setIsDeleteOpen(false)
        } catch (error) {
            console.error("Failed to delete menu", error)
            toast.error("Erreur lors de la suppression")
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
                        {menu.description && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2 border-l-2 border-orange-200 pl-2">
                                {menu.description}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-2 justify-end mt-2">
                        {isHistory ? (
                            <AlertDialog open={isRepublishOpen} onOpenChange={setIsRepublishOpen}>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={loading}
                                        className="h-8 text-xs"
                                    >
                                        <RotateCcw className="w-3 h-3 mr-1" /> Republier
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Republier ce menu ?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Voulez-vous vraiment republier "{menu.title}" pour aujourd'hui ?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
                                        <Button
                                            onClick={handleRepublish}
                                            disabled={loading}
                                        >
                                            {loading ? "En cours..." : "Republier"}
                                        </Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        ) : (
                            <Button
                                variant={menu.is_sold_out ? "default" : "outline"}
                                size="sm"
                                onClick={handleToggleStatus}
                                disabled={loading}
                                className="h-8 text-xs"
                            >
                                {menu.is_sold_out ? (
                                    <>
                                        <Eye className="w-3 h-3 mr-1" /> Activer
                                    </>
                                ) : (
                                    <>
                                        <EyeOff className="w-3 h-3 mr-1" /> Épuisé
                                    </>
                                )}
                            </Button>
                        )}

                        {!isHistory && (
                            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        disabled={loading}
                                        className="h-8 w-8 text-foreground hover:bg-muted"
                                    >
                                        <Pencil className="w-3 h-3" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Modifier le plat</DialogTitle>
                                    </DialogHeader>
                                    <AddMenuForm
                                        menuToEdit={menu}
                                        onSuccess={() => setIsEditOpen(false)}
                                    />
                                </DialogContent>
                            </Dialog>
                        )}

                        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    disabled={loading}
                                    className="h-8 w-8"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Cette action supprimera définitivement "{menu.title}". Cette action est irréversible.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDelete}
                                        disabled={loading}
                                    >
                                        {loading ? "Suppression..." : "Supprimer"}
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                    </div>
                </div>
            </div>
        </Card>
    )
}
