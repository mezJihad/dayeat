'use client'

import { login, signup } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [isLoginMode, setIsLoginMode] = useState(true)

    async function handleSubmit(formData: FormData) {
        setError(null)
        setMessage(null)
        startTransition(async () => {
            const action = isLoginMode ? login : signup
            const result = await action(formData)
            if (result?.error) {
                setError(result.error)
            } else if ((result as any)?.message) {
                setMessage((result as any).message)
            }
        })
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        {isLoginMode ? 'Connexion' : 'Créer un compte'}
                    </CardTitle>
                    <CardDescription>
                        {isLoginMode
                            ? 'Entrez vos identifiants pour accéder à votre espace.'
                            : 'Entrez un email et un mot de passe pour commencer.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <label htmlFor="email">Email</label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="password">Mot de passe</label>
                            <Input id="password" name="password" type="password" required />
                        </div>

                        {error && (
                            <div className="text-sm text-red-500 font-medium">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="text-sm text-green-600 font-medium">
                                {message}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isPending}
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isLoginMode ? 'Se connecter' : "S'inscrire"}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        <span className="text-muted-foreground">
                            {isLoginMode ? "Pas encore de compte ? " : "Déjà un compte ? "}
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setIsLoginMode(!isLoginMode)
                                setError(null)
                                setMessage(null)
                            }}
                            className="underline hover:text-primary font-medium"
                        >
                            {isLoginMode ? "Créer un compte" : "Se connecter"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
