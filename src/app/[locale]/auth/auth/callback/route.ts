import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/admin'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocal = process.env.NODE_ENV === 'development'

            if (isLocal) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                redirect(`https://${forwardedHost}${next}`)
            } else {
                redirect(`${origin}${next}`)
            }
        } else {
            console.error('Exchange error:', error)
        }
    }

    // return the user to an error page with instructions
    redirect(`${origin}/auth/auth-code-error`)
}
