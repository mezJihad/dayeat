'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { TermsOfUseContent } from "@/components/TermsOfUseContent"

export default function TermsPage() {
    const router = useRouter()

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <button
                onClick={() => router.back()}
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-6"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
            </button>

            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Conditions Générales d'Utilisation (CGU)</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
                </CardHeader>
                <CardContent>
                    <TermsOfUseContent />
                </CardContent>
            </Card>
        </div>
    )
}
