import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database } from "@/types"
import { ExternalLink, MapPin, Map, Heart, Store, ShoppingBag, Info, Phone, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
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
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useFavorites } from "@/hooks/useFavorites"
import { toast } from "sonner"

import Image from 'next/image'

type MenuItem = Database['public']['Functions']['get_menus_around']['Returns'][number]

interface MenuCardProps {
    item: MenuItem
}

export function MenuCard({ item }: MenuCardProps) {
    const { isFavorite, toggleFavorite } = useFavorites()
    const isFav = isFavorite(item.restaurant_id)
    const whatsappMessage = `Bonjour, je souhaite commander : ${item.title} du menu du jour.`
    const whatsappUrl = `https://wa.me/${item.restaurant_phone}?text=${encodeURIComponent(whatsappMessage)}`

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault()
        toggleFavorite(item.restaurant_id)
        if (!isFav) {
            toast.success(`Le restaurant ${item.restaurant_name} a été ajouté aux favoris`)
        } else {
            toast.info(`Le restaurant ${item.restaurant_name} a été retiré des favoris`)
        }
    }

    return (
        <Card className="w-full max-w-sm overflow-hidden transition-all hover:shadow-md flex flex-col">
            {item.photo_url && (
                <div className="relative h-48 w-full overflow-hidden shrink-0">
                    <Image
                        src={item.photo_url}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={true}
                    />
                    {item.is_sold_out && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                            <span className="font-bold text-white tracking-widest bg-red-600 px-4 py-1.5 rounded shadow-lg rotate-12">ÉPUISÉ</span>
                        </div>
                    )}
                    {!item.is_sold_out && (
                        <Badge className="absolute right-3 top-3 bg-white/95 text-black hover:bg-white shadow-md font-bold text-sm px-2.5 py-1">
                            {item.price} MAD
                        </Badge>
                    )}
                </div>
            )}
            <CardHeader className="p-4 pb-0 shrink-0">
                <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1.5 flex-1">
                        <CardTitle className="line-clamp-1 text-lg leading-tight font-bold text-slate-800 dark:text-slate-100">{item.title}</CardTitle>
                        <CardDescription className="line-clamp-2 text-sm text-slate-500 leading-snug">{item.description}</CardDescription>
                    </div>
                    {!item.photo_url && (
                        <div className="flex flex-col gap-2 items-end shrink-0">
                            <Badge variant={item.is_sold_out ? "destructive" : "secondary"} className="shadow-sm font-bold text-sm">
                                {item.is_sold_out ? "Épuisé" : `${item.price} MAD`}
                            </Badge>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="px-4 pb-0 pt-1 flex-1 flex flex-col">
                <div className="flex flex-col gap-0 text-sm text-muted-foreground flex-1">
                    <div className="flex items-center gap-1 justify-between">
                        <div className="flex items-center gap-2 max-w-[85%]">
                            {item.restaurant_address ? (
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.restaurant_address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-red-50 dark:bg-red-900/20 p-1.5 rounded-full shrink-0 shadow-sm border border-red-100 dark:border-red-900/50 hover:bg-red-100 transition-colors"
                                    title="Ouvrir dans Google Maps"
                                >
                                    <Map className="h-3.5 w-3.5 text-red-700 dark:text-red-500" />
                                </a>
                            ) : (
                                <div className="bg-red-50 dark:bg-red-900/20 p-1.5 rounded-full shrink-0 shadow-sm border border-red-100 dark:border-red-900/50">
                                    <Map className="h-3.5 w-3.5 text-red-700 dark:text-red-500" />
                                </div>
                            )}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button
                                        className="flex items-center gap-1 group text-left outline-none shrink-1 min-w-0"
                                        title="Voir infos du restaurant"
                                    >
                                        <span className="line-clamp-1 font-bold text-slate-800 dark:text-slate-200 text-sm group-hover:text-red-700 transition-colors">
                                            {item.restaurant_name}
                                        </span>
                                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-red-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md rounded-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl">{item.restaurant_name}</DialogTitle>
                                        <DialogDescription>
                                            Informations pratiques et contact
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-5 py-2">
                                        {item.restaurant_address && (
                                            <div className="flex items-start gap-3">
                                                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                                <div className="flex flex-col gap-2">
                                                    <p className="text-sm">{item.restaurant_address}</p>
                                                    <a
                                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.restaurant_address)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-md px-3 py-2 w-max transition-colors"
                                                    >
                                                        <MapPin className="h-4 w-4" />
                                                        Ouvrir dans Google Maps
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                        {item.restaurant_phone && (
                                            <div className="flex items-center gap-3">
                                                <Phone className="h-5 w-5 text-muted-foreground shrink-0" />
                                                <p className="text-sm font-medium">{item.restaurant_phone}</p>
                                            </div>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-500 shrink-0 right-0 -mr-2"
                            onClick={handleToggleFavorite}
                        >
                            <Heart className={`h-4 w-4 transition-all ${isFav ? "fill-red-500 text-red-500 scale-110" : "text-slate-400"}`} />
                        </Button>
                    </div>
                    {item.dist_meters > 0 && (
                        <div className="flex items-center pl-9 text-xs font-medium text-slate-500 mt-0.5">
                            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">À {Math.round(item.dist_meters)} m</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-wrap gap-2 mt-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100 shadow-sm">{item.meal_period}</Badge>
                    {item.is_dine_in !== false && (
                        <Badge variant="outline" className="bg-secondary/40 text-muted-foreground font-medium flex items-center gap-1">
                            <Store className="w-3 h-3" /> Sur place
                        </Badge>
                    )}
                    {item.is_takeaway !== false && (
                        <Badge variant="outline" className="bg-secondary/40 text-muted-foreground font-medium flex items-center gap-1">
                            <ShoppingBag className="w-3 h-3" /> À emporter
                        </Badge>
                    )}
                </div>
            </CardContent>
            <CardFooter className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 mt-auto shrink-0 flex flex-col gap-2 rounded-b-xl border-t-0">
                {item.is_sold_out ? (
                    <Button className="w-full gap-2 mt-1" size="default" disabled variant="secondary">
                        <ExternalLink className="h-4 w-4" />
                        Épuisé
                    </Button>
                ) : (
                    <div className="w-full mt-1 flex flex-col gap-3">
                        {item.accepts_reservations !== false ? (
                            item.dist_meters > 0 ? (
                                item.dist_meters > 50000 ? (
                                    <Button className="w-full gap-2 bg-secondary/50 text-muted-foreground shadow-sm" size="default" variant="secondary" disabled>
                                        <ExternalLink className="h-4 w-4" />
                                        Trop éloigné (&gt; {Math.round(item.dist_meters / 1000)}km)
                                    </Button>
                                ) : (
                                    <Button asChild className="w-full gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-md font-medium" size="default">
                                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-4 w-4" />
                                            Réserver via WhatsApp
                                        </a>
                                    </Button>
                                )
                            ) : (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button className="w-full gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-md font-medium" size="default">
                                            <ExternalLink className="h-4 w-4" />
                                            Réserver via WhatsApp
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Vérifier la distance</AlertDialogTitle>
                                            <AlertDialogDescription className="space-y-2">
                                                <p>
                                                    Nous n'avons pas accès à votre localisation pour vérifier la distance. L'activation de la position GPS est <strong className="text-foreground">obligatoire</strong> pour pouvoir commander.
                                                </p>
                                                {item.restaurant_address && (
                                                    <p className="font-medium text-foreground mt-4">
                                                        📍 Adresse : {item.restaurant_address}
                                                    </p>
                                                )}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel className="w-full">J'ai compris</AlertDialogCancel>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )
                        ) : (
                            <Button className="w-full gap-2 bg-secondary/50 text-muted-foreground" size="sm" variant="secondary" disabled>
                                Pas de réservation WhatsApp
                            </Button>
                        )}
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}
