import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database } from "@/types"
import { ExternalLink, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

type MenuItem = Database['public']['Functions']['get_menus_around']['Returns'][number]

interface MenuCardProps {
    item: MenuItem
}

export function MenuCard({ item }: MenuCardProps) {
    const whatsappMessage = `Bonjour, je souhaite commander : ${item.title} du menu du jour.`
    const whatsappUrl = `https://wa.me/${item.restaurant_phone}?text=${encodeURIComponent(whatsappMessage)}`

    return (
        <Card className="w-full max-w-sm overflow-hidden transition-all hover:shadow-md">
            {item.photo_url && (
                <div className="relative h-48 w-full overflow-hidden">
                    <img
                        src={item.photo_url}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                    <Badge className="absolute right-2 top-2" variant={item.is_sold_out ? "destructive" : "secondary"}>
                        {item.is_sold_out ? "Épuisé" : `${item.price} MAD`}
                    </Badge>
                </div>
            )}
            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="line-clamp-1">{item.title}</CardTitle>
                        <CardDescription className="line-clamp-2 text-sm">{item.description}</CardDescription>
                    </div>
                    {!item.photo_url && (
                        <Badge variant={item.is_sold_out ? "destructive" : "secondary"}>
                            {item.is_sold_out ? "Épuisé" : `${item.price} MAD`}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{item.restaurant_name}</span>
                    </div>
                    {item.restaurant_address && (
                        <p className="text-xs pl-5 line-clamp-1">{item.restaurant_address}</p>
                    )}
                    <p className="pl-5 text-xs">A {Math.round(item.dist_meters)}m</p>
                </div>
                <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{item.meal_period}</Badge>
                    <Badge variant="outline">{item.category}</Badge>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 bg-muted/50 p-3 mt-auto">
                <Button asChild className="w-full gap-2" size="sm" disabled={item.is_sold_out || false}>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        Commander sur WhatsApp
                    </a>
                </Button>
            </CardFooter>
        </Card>
    )
}
