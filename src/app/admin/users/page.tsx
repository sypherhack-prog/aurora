import { prisma } from '@/lib/db'

export default async function AdminUsersPage() {
    const fetchedUsers = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            subscriptions: {
                select: {
                    status: true,
                    plan: true,
                },
            },
        },
    })

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                Gestion des Utilisateurs
            </h1>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-zinc-800 bg-zinc-900/50">
                                <th className="p-4 font-semibold text-zinc-400">Utilisateur</th>
                                <th className="p-4 font-semibold text-zinc-400">Email</th>
                                <th className="p-4 font-semibold text-zinc-400">Rôle</th>
                                <th className="p-4 font-semibold text-zinc-400">Abonnement</th>
                                <th className="p-4 font-semibold text-zinc-400">Date d&apos;inscription</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {fetchedUsers.map((user: any) => (
                                <UserRow key={user.id} user={user} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

interface UserWithSubs {
    id: string
    name: string | null
    email: string | null
    role: string
    createdAt: Date
    subscriptions: { status: string; plan: string }[]
}

function UserRow({ user }: { user: UserWithSubs }) {
    const activeSub = user.subscriptions.find((s) => s.status === 'ACTIVE')

    return (
        <tr className="hover:bg-zinc-800/50 transition-colors">
            <td className="p-4 text-zinc-200 font-medium">{user.name || 'Sans nom'}</td>
            <td className="p-4 text-zinc-400">{user.email}</td>
            <td className="p-4">
                <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'bg-zinc-700 text-zinc-300'
                        }`}
                >
                    {user.role}
                </span>
            </td>
            <td className="p-4">
                {activeSub ? (
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
                        {activeSub.plan}
                    </span>
                ) : (
                    <span className="text-zinc-500 italic">Aucun</span>
                )}
            </td>
            <td className="p-4 text-zinc-500 text-sm">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
        </tr>
    )
}
