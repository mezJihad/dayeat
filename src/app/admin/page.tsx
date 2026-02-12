import { addMenuItem, getRestaurant, createRestaurant } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { PlusCircle, Store, Upload } from 'lucide-react'
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
                <h1 className="text-2xl font-bold mb-6">Bienvenue sur DayEat ! 🚀</h1>

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

                            <div className="space-y-2">
                                <label htmlFor="address" className="text-sm font-medium">
                                    Adresse (Optionnel)
                                </label>
                                <Input
                                    id="address"
                                    name="address"
                                    placeholder="123 Bd Mohamed V, Casablanca"
                                />
                            </div>

                            <Button type="submit" className="w-full mt-4 bg-orange-600 hover:bg-orange-700">
                                <Store className="mr-2 h-4 w-4" />
                                Créer mon Restaurant
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 max-w-md pb-24">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Espace Pro 👨‍🍳</h1>
                <p className="text-sm text-muted-foreground">
                    Restaurant: <span className="font-semibold text-foreground">{restaurant.name}</span>
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Ajouter un Plat du Jour</CardTitle>
                    <CardDescription>
                        Publiez rapidement votre menu pour le service d'aujourd'hui.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={addMenuItem} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">
                                Qu'est-ce qu'on mange ? (Titre)
                            </label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Ex: Tajine de Poulet aux Olives"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="price" className="text-sm font-medium">
                                Prix (DH)
                            </label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                placeholder="45"
                                required
                                min="0"
                                step="0.5"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="meal_period" className="text-sm font-medium">
                                Service
                            </label>
                            <div className="relative">
                                <Select id="meal_period" name="meal_period" required defaultValue="Dejeuner">
                                    <option value="Petit-Dej">Petit-Déjeuner</option>
                                    <option value="Dejeuner">Déjeuner</option>
                                    <option value="Gouter">Goûter</option>
                                    <option value="Diner">Dîner</option>
                                    <option value="AntiGaspi">Panier Anti-Gaspi</option>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="photo" className="text-sm font-medium">
                                Photo (Optionnel)
                            </label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="photo"
                                    name="photo"
                                    type="file"
                                    accept="image/*"
                                    className="cursor-pointer file:cursor-pointer"
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-4 bg-orange-500 hover:bg-orange-600">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Publier le Plat
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>💡 Astuce: Les plats sont automatiquement marqués comme "actifs aujourd'hui".</p>
            </div>
        </div>
    )
}

