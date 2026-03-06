'use client'

import { login, signup } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { TermsOfUseContent } from '@/components/TermsOfUseContent'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [isLoginMode, setIsLoginMode] = useState(true)
    const [isTermsOpen, setIsTermsOpen] = useState(false)
    const [termsAccepted, setTermsAccepted] = useState(false)

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
                            <div className="flex items-center">
                                <label htmlFor="password">Mot de passe</label>
                                <Link
                                    href="/forgot-password"
                                    className="ml-auto inline-block text-sm underline"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <Input id="password" name="password" type="password" required />
                        </div>

                        {!isLoginMode && (
                            <div className="flex items-start space-x-2 py-2">
                                <Checkbox
                                    id="terms"
                                    name="terms"
                                    required
                                    checked={termsAccepted}
                                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                                />
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    J&apos;accepte les{' '}
                                    <Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
                                        <DialogTrigger asChild>
                                            <button
                                                type="button"
                                                className="underline hover:text-primary outline-none"
                                            >
                                                conditions d&apos;utilisation
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
                                            <DialogHeader className="px-6 py-4 border-b">
                                                <DialogTitle className="text-2xl">Conditions G&eacute;n&eacute;rales d&apos;Utilisation</DialogTitle>
                                            </DialogHeader>
                                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                                <TermsOfUseContent />
                                            </div>
                                            <DialogFooter className="px-6 py-4 border-t bg-muted/50 sm:justify-between">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setTermsAccepted(false);
                                                        setIsTermsOpen(false);
                                                    }}
                                                >
                                                    Refuser
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={() => {
                                                        setTermsAccepted(true);
                                                        setIsTermsOpen(false);
                                                    }}
                                                >
                                                    Accepter
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </label>
                            </div>
                        )}

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
