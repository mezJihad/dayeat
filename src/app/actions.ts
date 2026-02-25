'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Get menus that are active today with optional filters
export async function getTodayMenus(filters?: {
    category?: string
    lat?: number
    long?: number
    radius?: number
}) {
    const supabase = await createClient()
    const { category, lat, long, radius = 5000 } = filters || {}

    // If geolocation is provided, use the localized RPC function
    if (lat && long) {
        const { data, error } = await supabase.rpc('get_menus_around', {
            lat,
            long,
            radius_meters: radius,
        })

        if (error) {
            console.error('Error fetching menus via RPC:', error)
            return []
        }

        let menus = data as any[]

        if (category && category !== 'all') {
            menus = menus.filter((menu: any) => menu.meal_period === category)
        }

        return menus.map((menu: any) => ({
            ...menu,
            id: menu.menu_item_id, // Map RPC id back to id
            restaurants: {
                name: menu.restaurant_name,
                whatsapp_phone: menu.restaurant_phone,
                address: menu.restaurant_address,
                lat: menu.restaurant_lat,
                long: menu.restaurant_long
            }
        }))
    }

    // Otherwise, get all menus using the new global RPC (which includes coords)
    const { data, error } = await supabase.rpc('get_all_active_menus')

    if (error) {
        console.error('Error fetching all active menus via RPC:', error)
        return []
    }

    let menus = data as any[]

    if (category && category !== 'all') {
        menus = menus.filter((menu: any) => menu.meal_period === category)
    }

    return menus.map((menu: any) => ({
        ...menu,
        id: menu.menu_item_id, // Map RPC id back to id
        restaurants: {
            name: menu.restaurant_name,
            whatsapp_phone: menu.restaurant_phone,
            address: menu.restaurant_address,
            lat: menu.restaurant_lat,
            long: menu.restaurant_long
        }
    }))
}

// Add a new menu item (Basic MVP version)
export async function addMenuItem(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    // Fetch the restaurant linked to the current user
    const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', user?.id || '')
        .limit(1)
        .single()

    if (restaurantError || !restaurant) {
        console.error('No restaurant found:', restaurantError)
        throw new Error('Aucun restaurant trouvé. Veuillez en créer un dans Supabase d\'abord.')
    }

    const title = formData.get('title') as string
    const price = parseFloat(formData.get('price') as string)
    const meal_period = formData.get('meal_period') as any
    const description = formData.get('description') as string
    const photo = formData.get('photo') as File
    const accepts_reservations = formData.get('accepts_reservations') === 'true'

    if (!title || !price || !meal_period) {
        throw new Error('Champs manquants')
    }

    let photo_url = null

    if (photo && photo.size > 0) {
        const filename = `${Date.now()}-${photo.name.replace(/[^a-zA-Z0-9.]/g, '')}`
        try {
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('menus')
                .upload(filename, photo)

            if (uploadError) {
                console.error('Upload error:', uploadError)
                // Continue without photo instead of crashing
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from('menus')
                    .getPublicUrl(filename)
                photo_url = publicUrl
            }
        } catch (storageError) {
            console.error('Storage Exception (Failed to fetch):', storageError)
            // If storage fails entirely (e.g. CORS, bucket missing), we still want to create the menu item just without a photo
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
        description: description || 'Délicieux plat du jour',
        accepts_reservations,
    })

    if (error) {
        console.error('Error adding item:', error)
        throw new Error('Erreur lors de l\'ajout du plat')
    }

    revalidatePath('/')
    revalidatePath('/admin')
}

// Edit an existing menu item
export async function editMenuItem(menuId: string, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const title = formData.get('title') as string
    const price = parseFloat(formData.get('price') as string)
    const meal_period = formData.get('meal_period') as string
    const description = formData.get('description') as string
    const photo = formData.get('photo') as File
    const accepts_reservations = formData.get('accepts_reservations') === 'true'

    if (!title || !price || !meal_period) {
        throw new Error('Champs manquants')
    }

    let photo_url_update = undefined

    if (photo && photo.size > 0) {
        const filename = `${Date.now()}-${photo.name.replace(/[^a-zA-Z0-9.]/g, '')}`
        try {
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('menus')
                .upload(filename, photo)

            if (!uploadError) {
                const { data: { publicUrl } } = supabase.storage
                    .from('menus')
                    .getPublicUrl(filename)
                photo_url_update = publicUrl
            }
        } catch (storageError) {
            console.error('Storage Exception:', storageError)
        }
    }

    const updateData: any = {
        title,
        price,
        meal_period,
        description: description || 'Délicieux plat du jour',
        accepts_reservations,
    }

    if (photo_url_update) {
        updateData.photo_url = photo_url_update
    }

    const { error } = await supabase.from('menu_items')
        .update(updateData)
        .eq('id', menuId)

    if (error) {
        console.error('Error updating item:', error)
        throw new Error('Erreur lors de la modification du plat')
    }

    revalidatePath('/')
    revalidatePath('/admin')
}

export async function getRestaurant() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data: restaurant } = await supabase
        .from('restaurants')
        .select('*')
        .eq('owner_id', user.id)
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
    const lat = formData.get('lat') as string
    const long = formData.get('long') as string

    if (!name || !whatsapp_phone) {
        throw new Error('Nom et WhatsApp requis')
    }

    // Default to Casablanca center if no map coordinates are provided
    const locationString = (lat && long)
        ? `POINT(${parseFloat(long)} ${parseFloat(lat)})`
        : 'POINT(-7.5898 33.5731)'

    const { error } = await supabase.from('restaurants').insert({
        name,
        whatsapp_phone,
        address,
        owner_id,
        is_open: true,
        location: locationString,
    })

    if (error) {
        console.error('Error creating restaurant:', error)
        if (error.code === '23503') { // Foreign key violation
            throw new Error('Erreur: Impossible de créer le restaurant car vous n\'êtes pas connecté.')
        }
        throw new Error('Erreur lors de la création du restaurant: ' + error.message)
    }

    revalidatePath('/admin')
}

export async function getRestaurantMenus(restaurantId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching restaurant menus:', error)
        return []
    }

    return data
}

export async function toggleMenuStatus(menuId: string, isSoldOut: boolean) {
    const supabase = await createClient()

    // Check ownership (security)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // In a real app, we should verify the user owns the restaurant that owns the menu
    // For MVP, we'll rely on RLS policies if set correctly, or just basic check

    const { error } = await supabase
        .from('menu_items')
        .update({ is_sold_out: isSoldOut })
        .eq('id', menuId)

    if (error) {
        console.error('Error updating menu status:', error)
        throw new Error('Failed to update status')
    }

    revalidatePath('/admin')
    revalidatePath('/') // Update main feed too
    return { success: true }
}

export async function deleteMenu(menuId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', menuId)

    if (error) {
        console.error('Error deleting menu:', error)
        throw new Error('Failed to delete menu')
    }

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
}

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}

export async function republishMenu(menuId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('menu_items')
        .update({
            is_active_today: true,
            is_sold_out: false,
            created_at: new Date().toISOString() // Update timestamp to now
        })
        .eq('id', menuId)

    if (error) {
        console.error('Error republishing menu:', error)
        throw new Error('Failed to republish menu')
    }

    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
}
