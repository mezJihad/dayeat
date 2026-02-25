import { getRestaurant, createRestaurant, getRestaurantMenus } from '@/app/actions'
import { SignOutButton } from '@/components/SignOutButton'
import { LocationPickerField } from '@/components/LocationPickerField'
import { AdminMenuCard } from '@/components/AdminMenuCard'
import { AddMenuForm } from '@/components/AddMenuForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Store, Clock, CalendarDays } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const restaurant = await getRestaurant()

    if (!restaurant) {
        return (
            <div className="container mx-auto p-4 max-w-md pb-24">
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-2xl font-bold">Bienvenue sur DayEat ! 🚀</h1>
                    <SignOutButton />
                </div>

                <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                        <CardTitle>Créez votre Restaurant</CardTitle>
                        <CardDescription>
                            Avant de publier des plats, configurez votre établissement.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={createRestaurant} className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Nom du Restaurant
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Chez Maître Délice"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="whatsapp_phone" className="text-sm font-medium">
                                    Numéro WhatsApp (Format International)
                                </label>
                                <Input
                                    id="whatsapp_phone"
                                    name="whatsapp_phone"
                                    placeholder="212600000000"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Sans le '+' (ex: 212...)</p>
                            </div>

                            <div className="space-y-2 mt-4">
                                <LocationPickerField />
                            </div>

                            <Button type="submit" className="w-full mt-6 bg-orange-600 hover:bg-orange-700">
                                <Store className="mr-2 h-4 w-4" />
                                Créer mon Restaurant
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const menus = await getRestaurantMenus(restaurant.id)

    const today = new Date().toISOString().split('T')[0]

    const todaysMenus = menus.filter((menu: any) =>
        menu.created_at.startsWith(today)
    )

    const historyMenus = menus.filter((menu: any) =>
        !menu.created_at.startsWith(today)
    )

    return (
        <div className="container mx-auto p-4 max-w-md pb-24">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Mon Restaurant 👨‍🍳</h1>
                    <p className="text-sm text-muted-foreground">
                        Restaurant: <span className="font-semibold text-foreground">{restaurant.name}</span>
                    </p>
                </div>
                <SignOutButton />
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Ajouter un Plat du Jour</CardTitle>
                    <CardDescription>
                        Publiez rapidement votre menu pour le service d'aujourd'hui.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AddMenuForm />
                </CardContent>
            </Card>

            <div className="space-y-8">
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <CalendarDays className="w-5 h-5 text-orange-600" />
                        <h2 className="text-xl font-bold">Au Menu Aujourd'hui</h2>
                    </div>

                    {todaysMenus.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8 bg-muted/20 rounded-lg text-sm">
                            Rien n'est publié pour aujourd'hui.
                        </p>
                    ) : (
                        <div className="grid gap-3">
                            {todaysMenus.map((menu: any) => (
                                <AdminMenuCard key={menu.id} menu={menu} />
                            ))}
                        </div>
                    )}
                </section>

                {historyMenus.length > 0 && (
                    <section>
                        <div className="flex items-center gap-2 mb-4 mt-8 text-muted-foreground">
                            <Clock className="w-5 h-5" />
                            <h2 className="text-lg font-semibold">Historique / Plats Précédents</h2>
                        </div>

                        <div className="grid gap-3 opacity-90">
                            {historyMenus.map((menu: any) => (
                                <AdminMenuCard key={menu.id} menu={menu} isHistory={true} />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>💡 Astuce: Les plats sont automatiquement marqués comme "actifs aujourd'hui".</p>
            </div>
        </div>
    )
}

