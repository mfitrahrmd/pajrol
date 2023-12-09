import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from './prisma'
import bcrypt from 'bcrypt'
import { TErrorClient, TErrorServer } from '@/types/api'

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials)
          throw new Error(
            JSON.stringify({
              errorType: 'server',
              message: 'server is busy',
            } as TErrorServer),
          )

        if (!credentials.email)
          throw new Error(
            JSON.stringify({
              errorType: 'client',
              errors: {
                email: ['email cn not be empty'],
              },
            } as TErrorClient),
          )

        if (!credentials.password)
          throw new Error(
            JSON.stringify({
              errorType: 'client',
              errors: {
                password: ['password can not be empty'],
              },
            } as TErrorClient),
          )

        const foundUser = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!foundUser)
          throw new Error(
            JSON.stringify({
              errorType: 'client',
              errors: {
                email: ['email not found'],
              },
            } as TErrorClient),
          )

        if (!(await bcrypt.compare(credentials.password, foundUser.password)))
          throw new Error(
            JSON.stringify({
              errorType: 'client',
              errors: {
                password: ['incorrect password'],
              },
            } as TErrorClient),
          )

        return foundUser
      },
    }),
  ],
  callbacks: {
    async jwt({ user, token }) {
      token.id = user.id
      token.role = user.role

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }

      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
  },
}

export default authOptions
