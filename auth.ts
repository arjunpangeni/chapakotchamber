import NextAuth, { type AuthOptions, type Session } from 'next-auth'
import { getServerSession } from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { getDatabase } from './lib/mongodb'
import { ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'

// Extend next-auth types for role
export {}
declare module 'next-auth' {
  interface User {
    role?: string
  }
  interface Session {
    user: {
      id?: string
      email?: string | null
      name?: string | null
      image?: string | null
      role?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
  }
}

const adminWhitelist = (process.env.ADMIN_EMAIL_WHITELIST || '')
  .split(',')
  .map((email) => email.trim())
  .filter(Boolean)

async function resolveRoleByEmail(email?: string | null) {
  if (!email) return undefined

  try {
    const db = await getDatabase()
    const dbUser = await db.collection('users').findOne({ email })
    return (dbUser?.role as string | undefined) || undefined
  } catch (error) {
    console.error('Failed to resolve role by email:', error)
    return undefined
  }
}

export const config = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        try {
          const db = await getDatabase()
          const user = await db.collection('users').findOne({
            email: credentials.email as string,
          })

          if (!user) {
            throw new Error('User not found')
          }

          if (!user.password) {
            throw new Error('Password not set for user')
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isValid) {
            throw new Error('Invalid password')
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || 'user',
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw error
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For Google OAuth, check if email is whitelisted
      if (account?.provider === 'google') {
        if (!adminWhitelist.includes(user.email || '')) {
          return false
        }

        try {
          const db = await getDatabase()
          const existingUser = await db.collection('users').findOne({
            email: user.email,
          })

          if (!existingUser) {
            await db.collection('users').insertOne({
              email: user.email,
              name: user.name,
              role: 'admin',
              createdAt: new Date().toISOString(),
            })
          }
        } catch (error) {
          console.error('Error during sign in callback:', error)
        }
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || token.role || (await resolveRoleByEmail(user.email)) || 'user'
      }

      if (!token.role) {
        token.role = (await resolveRoleByEmail(token.email)) || 'user'
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
} as AuthOptions

const handler = NextAuth(config)

export { handler as GET, handler as POST }

export const auth = () => getServerSession(config)
