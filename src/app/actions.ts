'use server'

import { supabase } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function getMenusAround(lat: number, long: number, radiusMeters: number = 5000) {
    const { data, error } = await supabase.rpc('get_menus_around', {
        lat,
        long,
        radius_meters: radiusMeters,
    })

    if (error) {
        console.error('Error fetching menus around:', error)
        throw new Error('Failed to fetch menus around')
    }

    return data
}

export async function publishTemplate(templateId: string) {
    // 1. Fetch the template
    const { data: template, error: fetchError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', templateId)
        .single()

    if (fetchError || !template) {
        console.error('Error fetching template:', fetchError)
        throw new Error('Template not found')
    }

    // 2. Create the new live item
    const { data: newItem, error: insertError } = await supabase
        .from('menu_items')
        .insert({
            restaurant_id: template.restaurant_id,
            title: template.title,
            description: template.description,
            price: template.price,
            photo_url: template.photo_url,
            category: template.category,
            meal_period: template.meal_period,
            is_template: false,
            is_active_today: true,
            is_sold_out: false,
            published_at: new Date().toISOString(),
        })
        .select()
        .single()

    if (insertError) {
        console.error('Error publishing template:', insertError)
        throw new Error('Failed to publish template')
    }

    revalidatePath('/')
    return newItem
}
