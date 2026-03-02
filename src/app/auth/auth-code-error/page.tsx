export default function AuthCodeErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900">Lien invalide ou expiré</h1>

                <p className="text-gray-600">
                    Le lien de vérification que vous avez utilisé n'est plus valide. Les liens expirent après une courte période ou s'ils ont déjà été utilisés.
                </p>

                <div className="p-4 bg-orange-50 text-orange-800 rounded-xl text-sm text-left">
                    <p className="font-semibold mb-1">Que faire maintenant ?</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Essayez de vous connecter pour recevoir un nouveau lien.</li>
                        <li>Vérifiez si vous avez reçu un lien plus récent dans votre boîte mail.</li>
                    </ul>
                </div>

                <a
                    href="/login"
                    className="block w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors"
                >
                    Retourner à la connexion
                </a>
            </div>
        </div>
    )
}
