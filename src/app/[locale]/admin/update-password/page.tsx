'use client'

export const dynamic = 'force-dynamic'

import { useState, Suspense } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updatePassword } from '@/app/auth/actions'
import { Lock } from 'lucide-react'

export default function UpdatePasswordPage() {
    return (
        <Suspense fallback={<div className="container mx-auto p-4 pt-20 text-center">Chargement...</div>}>
            <UpdatePasswordForm />
        </Suspense>
    )
}

function UpdatePasswordForm() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)

        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirm_password') as string

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.")
            setIsLoading(false)
            return
        }

        const result = await updatePassword(formData)

        if (result?.error) {
            setError(result.error)
        }

        setIsLoading(false)
    }

    return (
        <div className="container mx-auto p-4 max-w-md pt-20">
            <Card className="border-red-200 bg-red-50">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-red-100 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                        <Lock className="w-6 h-6 text-red-600" />
                    </div>
                    <CardTitle>Nouveau Mot de Passe</CardTitle>
                    <CardDescription>
                        Veuillez entrer votre nouveau mot de passe pour Dayeat.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="password">Nouveau mot de passe</label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                placeholder="Au moins 6 caractères"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="confirm_password">Confirmez le mot de passe</label>
                            <Input
                                id="confirm_password"
                                name="confirm_password"
                                type="password"
                                required
                                minLength={6}
                            />
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-red-600 hover:bg-red-700"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
