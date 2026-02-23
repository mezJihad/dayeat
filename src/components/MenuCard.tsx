import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database } from "@/types"
import { ExternalLink, MapPin, Heart, Store, ShoppingBag, Info, Phone } from "lucide-react"
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
                    <Badge className="absolute right-2 top-2" variant={item.is_sold_out ? "destructive" : "secondary"}>
                        {item.is_sold_out ? "Épuisé" : `${item.price} MAD`}
                    </Badge>
                </div>
            )}
            <CardHeader className="p-4 pb-1 shrink-0">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="line-clamp-1">{item.title}</CardTitle>
                        <CardDescription className="line-clamp-2 text-sm">{item.description}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                        {!item.photo_url && (
                            <Badge variant={item.is_sold_out ? "destructive" : "secondary"}>
                                {item.is_sold_out ? "Épuisé" : `${item.price} MAD`}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 flex-1 flex flex-col">
                <div className="flex flex-col gap-1 text-sm text-muted-foreground mt-1 flex-1">
                    <div className="flex items-center gap-1 justify-between">
                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="flex items-center gap-1.5 overflow-hidden text-left hover:opacity-80 transition-opacity focus:outline-none pr-2">
                                    <MapPin className="h-4 w-4 shrink-0 text-orange-600" />
                                    <span className="line-clamp-1 font-semibold text-foreground underline decoration-dotted underline-offset-4">{item.restaurant_name}</span>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>{item.restaurant_name}</DialogTitle>
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
                                                    className="inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-md px-3 py-2 w-max transition-colors"
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
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-red-500 shrink-0"
                            onClick={handleToggleFavorite}
                        >
                            <Heart className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                    </div>
                    {item.dist_meters > 0 && (
                        <p className="pl-5 text-xs">A {Math.round(item.dist_meters)}m</p>
                    )}
                </div>
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border/50">
                    <Badge variant="outline" className="bg-orange-50/50 text-orange-700 hover:bg-orange-50/50">{item.meal_period}</Badge>
                    <Badge variant="outline" className="bg-secondary/40 text-muted-foreground font-medium flex items-center gap-1">
                        <Store className="w-3 h-3" /> Sur place
                    </Badge>
                    <Badge variant="outline" className="bg-secondary/40 text-muted-foreground font-medium flex items-center gap-1">
                        <ShoppingBag className="w-3 h-3" /> À emporter
                    </Badge>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 bg-muted/30 pb-3 mt-auto shrink-0 flex flex-col gap-2">
                {item.is_sold_out ? (
                    <Button className="w-full gap-2 mt-4" size="sm" disabled variant="secondary">
                        <ExternalLink className="h-4 w-4" />
                        Épuisé
                    </Button>
                ) : (
                    <div className="w-full mt-2 flex flex-col gap-3">
                        {item.accepts_reservations !== false ? (
                            item.dist_meters > 0 ? (
                                item.dist_meters > 20000 ? (
                                    <Button className="w-full gap-2 bg-secondary/50 text-muted-foreground" size="sm" variant="secondary" disabled>
                                        <ExternalLink className="h-4 w-4" />
                                        Trop éloigné (&gt; {Math.round(item.dist_meters / 1000)}km)
                                    </Button>
                                ) : (
                                    <Button asChild className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white" size="sm">
                                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-4 w-4" />
                                            Réserver via WhatsApp
                                        </a>
                                    </Button>
                                )
                            ) : (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white" size="sm">
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
