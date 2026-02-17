'use client'

import { signOut } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut()}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
        </Button>
    )
}
