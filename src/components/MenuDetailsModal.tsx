import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { MenuCard } from "@/components/MenuCard"
import { Database } from "@/types"

type MenuItem = Database['public']['Functions']['get_menus_around']['Returns'][number]

interface MenuDetailsModalProps {
    item: MenuItem;
    children: React.ReactNode;
}

export function MenuDetailsModal({ item, children }: MenuDetailsModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="p-0 border-none bg-transparent shadow-none sm:max-w-md [&>button]:bg-white [&>button]:rounded-full [&>button]:p-1 [&>button]:text-slate-900 [&>button]:border [&>button]:border-slate-200 [&>button]:shadow-sm [&>button]:hover:bg-slate-100">
                <MenuCard item={item} />
            </DialogContent>
        </Dialog>
    )
}
