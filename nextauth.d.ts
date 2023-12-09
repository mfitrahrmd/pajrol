import { Role } from '@prisma/client'
import { DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    role: Role
  }

  interface Session extends DefaultUser {
    user?: User
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: Role
  }
}
