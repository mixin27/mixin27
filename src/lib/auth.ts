import { compare } from "bcryptjs"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./prisma"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: "/tools/login",
    },
    providers: [
        // Credentials provider
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials")
                }

                // Check for admin password (backward compatible)
                if (
                    credentials.email === process.env.ADMIN_EMAIL &&
                    credentials.password === process.env.TOOLS_PASSWORD
                ) {
                    // Get or create admin user
                    let user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    })

                    if (!user) {
                        user = await prisma.user.create({
                            data: {
                                email: credentials.email,
                                name: "Admin",
                            },
                        })
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                    }
                }

                // Regular user login with hashed password
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                })

                if (!user || !user.password) {
                    throw new Error("Invalid credentials")
                }

                const isPasswordValid = await compare(
                    credentials.password,
                    user.password
                )

                if (!isPasswordValid) {
                    throw new Error("Invalid credentials")
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                }
            },
        }),

        // Google OAuth (optional)
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.email = user.email
            }
            return token
        },
        async session({ session, user, token }) {
            if (token && session.user) {
                session.user.id = token.id
                session.user.email = token.email
            }
            return session
        },
    }
}
