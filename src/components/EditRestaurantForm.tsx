'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateRestaurant } from '@/app/actions'
import { Loader2 } from 'lucide-react'
import { LocationPickerField } from './LocationPickerField'
import { toast } from 'sonner'
import { Database } from '@/types'

interface EditRestaurantFormProps {
    restaurant: any
    onSuccess?: () => void
}

export function EditRestaurantForm({ restaurant, onSuccess }: EditRestaurantFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        const formData = new FormData(e.currentTarget)

        try {
            await updateRestaurant(formData)
            toast.success("Paramètres mis à jour avec succès !")
            if (onSuccess) onSuccess()
        } catch (err: any) {
            console.error('Submission error:', err)
            setError(err.message || "Une erreur est survenue")
            toast.error("Erreur lors de la mise à jour.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nom du Restaurant *</label>
                <Input
                    id="name"
                    name="name"
                    placeholder="Nom du restaurant"
                    required
                    defaultValue={restaurant.name}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="whatsapp_phone" className="text-sm font-medium">WhatsApp / Téléphone *</label>
                <Input
                    id="whatsapp_phone"
                    name="whatsapp_phone"
                    placeholder="ex: +212600000000 ou 0600000000"
                    required
                    defaultValue={restaurant.whatsapp_phone}
                />
                <p className="text-xs text-muted-foreground">Les clients utiliseront ce numéro pour commander.</p>
            </div>

            <div className="space-y-4 pt-4 border-t">
                <h4 className="font-semibold text-sm">Modification de l'emplacement</h4>
                <p className="text-xs text-muted-foreground">
                    Modifiez ces informations uniquement si vous avez changé d'adresse.
                </p>
                <LocationPickerField
                    defaultAddress={restaurant.address || ''}
                />
            </div>

            {error && (
                <div className="text-red-500 bg-red-50 p-3 rounded-md text-sm border border-red-200">
                    {error}
                </div>
            )}

            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold shadow-md" disabled={isSubmitting}>
                {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    "Enregistrer les modifications"
                )}
            </Button>
        </form>
    )
}
