'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: 'Email ou mot de passe incorrect.' }
    }

    revalidatePath('/', 'layout')
    redirect('/admin')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const terms = formData.get('terms') as string

    if (terms !== 'on') {
        return { error: "Vous devez accepter les conditions d'utilisation." }
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        }
    })

    if (error) {
        return { error: error.message }
    }

    if (data.user && !data.session) {
        return { message: 'Compte créé ! Veuillez vérifier votre email pour confirmer.' }
    }

    revalidatePath('/', 'layout')
    redirect('/admin')
}

export async function resetPassword(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/admin/update-password`,
    })

    if (error) {
        return { error: "Impossible d'envoyer l'email de réinitialisation. Vérifiez l'adresse." }
    }

    return { message: 'Email de réinitialisation envoyé ! Vérifiez votre boîte mail.' }
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient()

    const password = formData.get('password') as string

    if (!password || password.length < 6) {
        return { error: "Le mot de passe doit faire au moins 6 caractères." }
    }

    const { error } = await supabase.auth.updateUser({
        password: password
    })

    if (error) {
        return { error: "Erreur lors de la mise à jour du mot de passe." }
    }

    revalidatePath('/', 'layout')
    redirect('/admin')
}
