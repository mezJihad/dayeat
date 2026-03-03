'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

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
                <CardContent className="space-y-6 text-sm leading-relaxed text-muted-foreground">
                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-2">1. Objet</h2>
                        <p>
                            Les présentes Conditions Générales d'Utilisation (ci-après les "CGU") ont pour objet de définir les modalités
                            et conditions dans lesquelles DayEat met à la disposition de ses utilisateurs et des restaurateurs partenaires
                            sa plateforme permettant la publication et la consultation de menus du jour.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-2">2. Acceptation des CGU</h2>
                        <p>
                            L'utilisation de l'application DayEat implique l'acceptation pleine et entière des présentes CGU.
                            Lors de la création d'un compte, l'utilisateur ou le restaurateur reconnaît avoir lu et accepté ces conditions
                            en cochant la case prévue à cet effet.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-2">3. Services proposés</h2>
                        <p>
                            <strong>Pour les restaurateurs :</strong> DayEat fournit une interface permettant de publier quotidiennement
                            leurs menus du jour, incluant la description des plats et les prix.
                        </p>
                        <p className="mt-2">
                            <strong>Pour les utilisateurs :</strong> DayEat permet de consulter les menus du jour proposés par les restaurants
                            partenaires autour d'eux.
                        </p>
                        <p className="mt-2">
                            DayEat agit uniquement en tant qu'intermédiaire technique. Les transactions, réservations, ou commandes
                            sont effectuées directement auprès des restaurants.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-2">4. Engagements du Restaurateur</h2>
                        <ul className="list-disc pl-5 space-y-1 mt-2">
                            <li>Le restaurateur s'engage à fournir des informations exactes et à jour concernant ses menus (prix, description, disponibilité).</li>
                            <li>Le restaurateur est seul responsable du contenu publié sur sa page via l'application DayEat.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-2">5. Responsabilité</h2>
                        <p>
                            DayEat met tout en œuvre pour assurer l'accessibilité de l'application, mais n'est tenue qu'à une obligation de moyens.
                            DayEat ne saurait être tenue responsable des éventuels préjudices liés à une indisponibilité temporaire du service,
                            à l'inexactitude des informations fournies par un restaurateur, ou à tout litige survenant entre un utilisateur
                            et un restaurant (qualité des plats, prix, etc.).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-2">6. Propriété Intellectuelle</h2>
                        <p>
                            Tous les éléments constituant l'application DayEat (textes, images, logos, code source) sont la propriété exclusive
                            de DayEat ou de ses partenaires. Toute reproduction, copie ou utilisation non autorisée est strictement interdite.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-2">7. Données Personnelles et Suppression de Compte</h2>
                        <p>
                            <strong>Pour les utilisateurs (clients) :</strong> L'application DayEat ne requiert pas la création d'un compte pour consulter les menus.
                            Les préférences, telles que les "favoris", sont stockées localement sur votre appareil (via votre navigateur).
                            DayEat ne collecte ni ne stocke aucune donnée personnelle vous concernant sur ses serveurs.
                        </p>
                        <p className="mt-2">
                            <strong>Pour les restaurateurs (partenaires) :</strong> DayEat collecte et traite les données nécessaires au fonctionnement de votre espace professionnel
                            (adresse email, informations du restaurant). Conformément à la réglementation (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression.
                        </p>
                        <p className="mt-2">
                            <strong>Suppression de compte (Restaurateurs) :</strong> Vous pouvez à tout moment supprimer définitivement votre compte,
                            ainsi que l'ensemble des données associées (profil et menus publiés), directement depuis les paramètres (Zone de danger) de votre espace professionnel.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-foreground mb-2">8. Modification des CGU</h2>
                        <p>
                            DayEat se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés
                            de toute modification substantielle. La poursuite de l'utilisation du service après modification vaut acceptation
                            des nouvelles CGU.
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    )
}
