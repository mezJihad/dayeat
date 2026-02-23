import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database } from "@/types"
import { ExternalLink, MapPin, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
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
                        <div className="flex items-center gap-1 overflow-hidden">
                            <MapPin className="h-4 w-4 shrink-0 text-orange-600" />
                            <span className="line-clamp-1 font-semibold text-foreground">{item.restaurant_name}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-red-500 shrink-0"
                            onClick={handleToggleFavorite}
                        >
                            <Heart className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                    </div>
                    {item.restaurant_address && (
                        <div className="flex justify-between items-start gap-2 pl-5">
                            <p className="text-xs line-clamp-2 flex-1 mt-0.5">{item.restaurant_address}</p>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.restaurant_address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-600 hover:text-orange-700 bg-orange-50 p-1.5 rounded-full shrink-0"
                                title="Voir l'itinéraire"
                            >
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    )}
                    {item.dist_meters > 0 && (
                        <p className="pl-5 text-xs">A {Math.round(item.dist_meters)}m</p>
                    )}
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                    <Badge variant="outline" className="bg-orange-50/50 text-orange-700 hover:bg-orange-50/50">{item.meal_period}</Badge>
                    <Badge variant="outline" className="bg-orange-50/50 text-orange-700 hover:bg-orange-50/50">{item.category}</Badge>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 bg-muted/30 pb-3 mt-auto shrink-0 flex flex-col gap-2">
                {item.is_sold_out ? (
                    <Button className="w-full gap-2 mt-4" size="sm" disabled variant="secondary">
                        <ExternalLink className="h-4 w-4" />
                        Épuisé
                    </Button>
                ) : item.accepts_reservations !== false ? (
                    <div className="w-full mt-4 flex flex-col gap-2">
                        <Button asChild className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white" size="sm">
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                                Commander sur WhatsApp
                            </a>
                        </Button>
                        <p className="text-[11px] text-center text-muted-foreground font-medium">
                            Également disponible sur place ou à emporter.
                        </p>
                    </div>
                ) : (
                    <div className="w-full mt-4 p-3 bg-orange-50 border border-orange-100 rounded-md text-center">
                        <p className="text-xs font-semibold text-orange-800">
                            Disponible sur place ou à emporter.
                        </p>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}
