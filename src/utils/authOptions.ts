import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from './prisma'
import bcrypt from 'bcrypt'

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'email' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials) return null

        const foundUser = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!foundUser) return null

        if (!(await bcrypt.compare(credentials.password, foundUser.password)))
          return null

        return foundUser
      },
    }),
  ],
  pages: {
    signIn: '/signin',
  },
}

export default authOptions
