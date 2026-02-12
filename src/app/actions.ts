'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// Get menus that are active today
export async function getTodayMenus() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('menu_items')
        .select(`
      *,
      restaurants (
        name,
        whatsapp_phone,
        logo_url
      )
    `)
        .eq('is_active_today', true)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching menus:', error)
        return []
    }

    return data
}

// Add a new menu item (Basic MVP version)
export async function addMenuItem(formData: FormData) {
    const supabase = await createClient()

    // For MVP: Fetch the first restaurant available to link the item to it
    const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .select('id')
        .limit(1)
        .single()

    if (restaurantError || !restaurant) {
        console.error('No restaurant found:', restaurantError)
        throw new Error('Aucun restaurant trouvé. Veuillez en créer un dans Supabase d\'abord.')
    }

    const title = formData.get('title') as string
    const price = parseFloat(formData.get('price') as string)
    const meal_period = formData.get('meal_period') as any
    const photo = formData.get('photo') as File

    if (!title || !price || !meal_period) {
        throw new Error('Champs manquants')
    }

    let photo_url = null

    if (photo && photo.size > 0) {
        const filename = `${Date.now()}-${photo.name.replace(/[^a-zA-Z0-9.]/g, '')}`
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('menus')
            .upload(filename, photo)

        if (uploadError) {
            console.error('Upload error:', uploadError)
            // Continue without photo or throw? Let's continue but log it.
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('menus')
                .getPublicUrl(filename)
            photo_url = publicUrl
        }
    }

    const { error } = await supabase.from('menu_items').insert({
        restaurant_id: restaurant.id,
        title,
        price,
        meal_period,
        photo_url,
        is_active_today: true,
        is_sold_out: false,
        category: 'Plat', // Default
        description: 'Délicieux plat du jour', // Default
    })

    if (error) {
        console.error('Error adding item:', error)
        throw new Error('Erreur lors de l\'ajout du plat')
    }

    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true }
}

export async function getRestaurant() {
    const supabase = await createClient()
    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('*')
        .limit(1)
        .single()

    return restaurant
}

export async function createRestaurant(formData: FormData) {
    const supabase = await createClient()

    // Try to get current user
    const { data: { user } } = await supabase.auth.getUser()

    const owner_id = user?.id || '00000000-0000-0000-0000-000000000000'

    const name = formData.get('name') as string
    const whatsapp_phone = formData.get('whatsapp_phone') as string
    const address = formData.get('address') as string

    if (!name || !whatsapp_phone) {
        throw new Error('Nom et WhatsApp requis')
    }

    const { error } = await supabase.from('restaurants').insert({
        name,
        whatsapp_phone,
        address,
        owner_id,
        is_open: true,
        location: 'POINT(0 0)', // Default location for MVP
    })

    if (error) {
        console.error('Error creating restaurant:', error)
        if (error.code === '23503') { // Foreign key violation
            throw new Error('Erreur: Impossible de créer le restaurant car vous n\'êtes pas connecté.')
        }
        throw new Error('Erreur lors de la création du restaurant: ' + error.message)
    }

    revalidatePath('/admin')
    return { success: true }
}
