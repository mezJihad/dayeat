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
            className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-medium"
        >
            <LogOut className="w-4 h-4 mr-2 shrink-0" />
            <span>Déconnexion</span>
        </Button>
    )
}
