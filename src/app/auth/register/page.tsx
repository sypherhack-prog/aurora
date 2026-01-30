'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Mail, Lock, User, Loader2, ArrowRight, Check } from 'lucide-react'
import { APP_CONSTANTS } from '@/lib/constants'

// --- Components ---

function BackgroundEffects() {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        </div>
    )
}

function LogoHeader() {
    return (
        <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-2xl text-white">Aurora AI</span>
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">Créer un compte</h1>
            <p className="text-zinc-400">Commencez gratuitement avec 5 documents/mois</p>
        </div>
    )
}

function SuccessView() {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
            <div className="w-full max-w-md text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Compte créé !</h2>
                <p className="text-zinc-400 mb-4">Redirection vers la connexion...</p>
                <Loader2 className="w-6 h-6 text-cyan-400 animate-spin mx-auto" />
            </div>
        </div>
    )
}

interface InputFieldProps {
    id: string
    label: string
    icon: any
    type: string
    value: string
    onChange: (val: string) => void
    placeholder: string
    minLength?: number
}

function InputField({
    id,
    label,
    icon: Icon,
    type,
    value,
    onChange,
    placeholder,
    minLength,
}: InputFieldProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-zinc-300 mb-2">
                {label}
            </label>
            <div className="relative">
                <Icon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                    type={type}
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    required
                    minLength={minLength}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-11 pr-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                />
            </div>
        </div>
    )
}

function PlanInfo() {
    return (
        <div className="mt-6 bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 text-center">
            <p className="text-xs text-zinc-400">
                ✨ Le plan gratuit inclut 5 documents/mois, formatage IA basique, et export PDF.
            </p>
        </div>
    )
}

function RegisterFooter() {
    return (
        <div className="text-center mt-6">
            <Link href="/" className="text-sm text-zinc-400 hover:text-white transition">
                ← Retour à l&apos;accueil
            </Link>
        </div>
    )
}

// --- Main Page ---

export default function RegisterPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Une erreur est survenue')

            setSuccess(true)
            setTimeout(() => router.push('/auth/login'), APP_CONSTANTS.TIMEOUTS.NOTIFICATION)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (success) return <SuccessView />

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 relative overflow-hidden">
            <BackgroundEffects />
            <div className="w-full max-w-md relative z-10">
                <LogoHeader />

                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <InputField id="name" label="Nom" icon={User} type="text" value={name} onChange={setName} placeholder="Votre nom" />
                        <InputField id="email" label="Email" icon={Mail} type="email" value={email} onChange={setEmail} placeholder="votre@email.com" />
                        <InputField id="password" label="Mot de passe" icon={Lock} type="password" value={password} onChange={setPassword} placeholder="••••••••" minLength={6} />

                        {error && <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Créer mon compte gratuit <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-zinc-400 text-sm">
                            Déjà un compte ? <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 transition">Se connecter</Link>
                        </p>
                    </div>
                </div>

                <PlanInfo />
                <RegisterFooter />
            </div>
        </div>
    )
}
