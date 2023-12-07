import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from './prisma'
import bcrypt from 'bcrypt'

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
        if (!credentials) return null

        if (!credentials.email) throw new Error('email can not be empty')

        if (!credentials.password) throw new Error('password can not be empty')

        const foundUser = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!foundUser) throw new Error('email not found')

        if (!(await bcrypt.compare(credentials.password, foundUser.password)))
          throw new Error('incorrect password')

        return foundUser
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
  },
}

export default authOptions
