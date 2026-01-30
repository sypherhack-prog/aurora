import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { AdminSidebar } from "./components/AdminSidebar"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        redirect("/login")
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex">
            <AdminSidebar user={session.user} />

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="h-14 border-b border-zinc-800 flex items-center px-6">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-zinc-500">Admin</span>
                        <ChevronRight className="w-4 h-4 text-zinc-600" />
                        <span className="text-sm">Tableau de bord</span>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
