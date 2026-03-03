'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Store, ShieldAlert, LogOut, Settings, Loader2, User } from 'lucide-react'
import { EditRestaurantForm } from './EditRestaurantForm'
import { deleteRestaurantAccount } from '@/app/actions'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface ProfileMenuProps {
    restaurant: any
}

export function ProfileMenu({ restaurant }: ProfileMenuProps) {
    const router = useRouter()

    // Dialog states
    const [showSettingsDialog, setShowSettingsDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    // Action states
    const [isDeleting, setIsDeleting] = useState(false)
    const [isSigningOut, setIsSigningOut] = useState(false)

    const handleSignOut = async () => {
        setIsSigningOut(true)
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    const handleDeleteAccount = async () => {
        setIsDeleting(true)
        try {
            await deleteRestaurantAccount()
            toast.success("Votre compte a été supprimé definitivement.")
            // Redirect handled by server action
        } catch (err: any) {
            console.error('Deletion error:', err)
            toast.error("Impossible de supprimer le compte.")
            setIsDeleting(false)
            setShowDeleteDialog(false)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 p-0 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-transparent text-slate-600 font-medium">
                                <User className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">Mon Profil</p>
                            <p className="text-xs leading-none text-muted-foreground truncate">
                                {restaurant?.name || 'Restaurateur'}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    {restaurant && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setShowSettingsDialog(true)}
                                className="cursor-pointer"
                            >
                                <Store className="mr-2 h-4 w-4 text-emerald-600" />
                                <span>Gérer mon restaurant</span>
                            </DropdownMenuItem>
                        </>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        Sécurité
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => setShowDeleteDialog(true)}
                        className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                    >
                        <ShieldAlert className="mr-2 h-4 w-4" />
                        <span>Supprimer mon compte</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="cursor-pointer font-medium"
                    >
                        {isSigningOut ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin text-slate-500" />
                        ) : (
                            <LogOut className="mr-2 h-4 w-4 text-slate-500" />
                        )}
                        <span>Se déconnecter</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings Dialog */}
            <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
                <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Paramètres du Restaurant</DialogTitle>
                    </DialogHeader>
                    {restaurant && (
                        <EditRestaurantForm
                            restaurant={restaurant}
                            onSuccess={() => setShowSettingsDialog(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Account Alert Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600">Êtes-vous absolument sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. Elle supprimera définitivement votre compte,
                            votre profil restaurant et l'ensemble des menus que vous avez publiés sur DayEat.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault(); // Prevent closing immediately to show loading state
                                handleDeleteAccount();
                            }}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Oui, supprimer mon compte
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
