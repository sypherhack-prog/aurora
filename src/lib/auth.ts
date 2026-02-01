import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@/lib/db'
import { compare } from 'bcryptjs'

const credentialsOptions = {
    name: 'Credentials',
    credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials: Record<string, string> | undefined) {
        console.log('🔍 [Auth] Login attempt started')
        const email = credentials?.email
        const password = credentials?.password

        if (!email || !password) {
            console.log('❌ [Auth] Missing credentials')
            return null
        }

        try {
            console.log(`🔍 [Auth] Finding user: ${email}`)
            const user = await prisma.user.findUnique({
                where: {
                    email: email,
                },
            })

            if (!user) {
                console.log('❌ [Auth] User not found in DB')
                return null
            }
            console.log('✅ [Auth] User found')

            const isPasswordValid = await compare(password, user.password)

            if (!isPasswordValid) {
                console.log('❌ [Auth] Invalid password')
                return null
            }
            console.log('✅ [Auth] Password valid')

            return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            }
        } catch (e) {
            console.error('❌ [Auth] CRITICAL ERROR:', e)
            return null
        }
    },
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/auth/login',
    },
    providers: [
        CredentialsProvider(credentialsOptions),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            return token
        },
    },
}
