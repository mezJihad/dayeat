import { getTodayMenus } from './actions'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, Store, Tag } from 'lucide-react'

// Placeholder image if no photo provided
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"

export default async function Home() {
  const menus = await getTodayMenus()

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">DayEat 😋</h1>
          <p className="text-muted-foreground text-sm">Les meilleurs menus du jour autour de vous</p>
        </div>
      </header>

      {menus.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>Aucun menu disponible pour le moment.</p>
          <p className="text-sm mt-2">Revenez plus tard ! 🕒</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {menus.map((menu: any) => (
            <Card key={menu.id} className="overflow-hidden border-none shadow-md bg-card">
              <div className="relative h-48 w-full bg-muted">
                {/* Using standard img to avoid Next.js domain config for MVP */}
                <img
                  src={menu.photo_url || DEFAULT_IMAGE}
                  alt={menu.title}
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                />
                <div className="absolute top-2 right-2 bg-background/90 backdrop-blur px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                  {menu.price} DH
                </div>
              </div>

              <CardHeader className="pb-2 pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{menu.title}</CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground mt-1 gap-1">
                      <Store className="w-3 h-3" />
                      <span>{menu.restaurants?.name || 'Restaurant Inconnu'}</span>
                    </div>
                  </div>
                </div>
                <CardDescription className="line-clamp-2 mt-2">
                  {menu.description || "Aucune description disponible."}
                </CardDescription>
              </CardHeader>

              <CardFooter className="pt-2 pb-4">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white gap-2 font-semibold shadow-sm"
                  asChild
                >
                  <a
                    href={`https://wa.me/${menu.restaurants?.whatsapp_phone}?text=Bonjour, je commande : ${menu.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Commander sur WhatsApp
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
