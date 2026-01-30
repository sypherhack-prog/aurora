import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/db"
import { compare } from "bcryptjs"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    console.log("LOGIN CHECK:", credentials?.email)
                    if (!credentials?.email || !credentials?.password) {
                        console.log("LOGIN FAIL: Missing credentials")
                        return null
                    }

                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email
                        }
                    })

                    console.log("LOGIN USER FOUND:", !!user)

                    if (!user) {
                        console.log("LOGIN FAIL: User not found in DB")
                        return null
                    }

                    const isPasswordValid = await compare(credentials.password, user.password)
                    console.log("LOGIN PASSWORD VALID:", isPasswordValid)

                    if (!isPasswordValid) {
                        console.log("LOGIN FAIL: Invalid password")
                        return null
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    }
                } catch (e) {
                    console.error("LOGIN ERROR:", e)
                    return null
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token) {
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
        }
    }
}
