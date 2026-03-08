'use client'

import { useState, useRef } from 'react'
import { addMenuItem, editMenuItem } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { PlusCircle, Loader2, Save } from 'lucide-react'
import imageCompression from 'browser-image-compression'

export interface MenuToEdit {
    id: string
    title: string
    price: number
    meal_period: string
    description: string | null
    accepts_reservations: boolean | null
    is_dine_in: boolean | null
    is_takeaway: boolean | null
    photo_url: string | null
}

interface AddMenuFormProps {
    menuToEdit?: MenuToEdit
    onSuccess?: () => void
}

export function AddMenuForm({ menuToEdit, onSuccess }: AddMenuFormProps) {
    const isEditing = !!menuToEdit
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [mealPeriod, setMealPeriod] = useState(menuToEdit?.meal_period || "Dejeuner")
    const formRef = useRef<HTMLFormElement>(null)

    async function handleAddMenu(formData: FormData) {
        setIsSubmitting(true)
        try {
            const photoFile = formData.get('photo') as File

            if (photoFile && photoFile.size > 0) {
                // Compression options
                const options = {
                    maxSizeMB: 0.2, // ~200 KB
                    maxWidthOrHeight: 1280,
                    useWebWorker: false // Disabled to prevent "network error" causing upload failures
                }

                try {
                    const compressedFile = await imageCompression(photoFile, options)
                    // Overwrite the raw image with the compressed one
                    formData.set('photo', compressedFile, compressedFile.name)
                    console.log(`Image compressed from ${(photoFile.size / 1024 / 1024).toFixed(2)} MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`)
                } catch (error) {
                    console.error('Error compressing image:', error)
                    // If compression fails, we fallback to sending the original file
                }
            }

            // Execute the appropriate Server Action based on context
            if (isEditing && menuToEdit) {
                await editMenuItem(menuToEdit.id, formData)
            } else {
                await addMenuItem(formData)
            }

            // Clear the form fields upon success if adding new
            if (!isEditing) {
                formRef.current?.reset()
            }

            if (onSuccess) {
                onSuccess()
            }

        } catch (error) {
            console.error('Error submitting form:', error)
            alert('Une erreur est survenue lors de la communication de vos changements.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form ref={formRef} action={handleAddMenu} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                    Qu'est-ce qu'on mange ? (Titre)
                </label>
                <Input
                    id="title"
                    name="title"
                    defaultValue={menuToEdit?.title}
                    placeholder="Ex: Tajine de Poulet aux Olives"
                    required
                    disabled={isSubmitting}
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
                    defaultValue={menuToEdit?.price}
                    placeholder="45"
                    required
                    min="0"
                    step="0.5"
                    disabled={isSubmitting}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="meal_period" className="text-sm font-medium">
                    Service
                </label>
                <input type="hidden" name="meal_period" value={mealPeriod} />
                <Select
                    value={mealPeriod}
                    onValueChange={setMealPeriod}
                    required
                    disabled={isSubmitting}
                >
                    <SelectTrigger className="w-full h-10 rounded-md border-input bg-background focus:ring-slate-900">
                        <SelectValue placeholder="Choisir un service" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Petit-Dej">Petit-Déjeuner</SelectItem>
                        <SelectItem value="Dejeuner">Déjeuner</SelectItem>
                        <SelectItem value="Gouter">Goûter</SelectItem>
                        <SelectItem value="Diner">Dîner</SelectItem>
                        <SelectItem value="AntiGaspi">Panier Anti-Gaspi</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                    Description (Ingrédients, allergènes...)
                </label>
                <Textarea
                    id="description"
                    name="description"
                    defaultValue={menuToEdit?.description || ''}
                    placeholder="Ex: Poulet fermier, olives violettes, citrons confits maison, servi avec pain semoule."
                    className="resize-none"
                    disabled={isSubmitting}
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="photo" className="text-sm font-medium">
                    Photo {isEditing ? "(Optionnel - Seulement pour remplacer l'existant)" : "(Optionnel)"}
                </label>
                {isEditing && menuToEdit?.photo_url && (
                    <div className="mb-2">
                        <img src={menuToEdit.photo_url} alt="Current photo" className="h-16 w-16 object-cover rounded border" />
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <Input
                        id="photo"
                        name="photo"
                        type="file"
                        accept="image/*"
                        className="cursor-pointer file:cursor-pointer"
                        disabled={isSubmitting}
                    />
                </div>
                {!isEditing && (
                    <p className="text-xs text-muted-foreground">
                        Une belle photo augmente vos ventes ! Elle sera automatiquement compressée.
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between gap-4 pt-2 pb-2 flex-wrap">
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="accepts_reservations"
                        name="accepts_reservations"
                        value="true"
                        defaultChecked={isEditing ? (menuToEdit?.accepts_reservations !== false) : true}
                        className="h-4 w-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900 accent-slate-900 cursor-pointer"
                        disabled={isSubmitting}
                    />
                    <label
                        htmlFor="accepts_reservations"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Réservations WhatsApp
                    </label>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="is_dine_in"
                        name="is_dine_in"
                        value="true"
                        defaultChecked={isEditing ? (menuToEdit?.is_dine_in !== false) : true}
                        className="h-4 w-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900 accent-slate-900 cursor-pointer"
                        disabled={isSubmitting}
                    />
                    <label
                        htmlFor="is_dine_in"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Sur place
                    </label>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="is_takeaway"
                        name="is_takeaway"
                        value="true"
                        defaultChecked={isEditing ? (menuToEdit?.is_takeaway !== false) : true}
                        className="h-4 w-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900 accent-slate-900 cursor-pointer"
                        disabled={isSubmitting}
                    />
                    <label
                        htmlFor="is_takeaway"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        À emporter
                    </label>
                </div>
            </div>

            <Button type="submit" className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold" disabled={isSubmitting}>
                {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isEditing ? (
                    <Save className="mr-2 h-4 w-4" />
                ) : (
                    <PlusCircle className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? 'Sauvegarde...' : isEditing ? 'Enregistrer les modifications' : 'Publier le Plat'}
            </Button>
        </form>
    )
}
