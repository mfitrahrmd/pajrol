import { NextRequest, NextResponse } from 'next/server'
import * as yup from 'yup'
import prisma from '@/utils/prisma'
import bcrypt from 'bcrypt'
import { User } from '@prisma/client'

export async function POST(req: NextRequest) {
  const schema = yup.object({
    name: yup.string().required(),
    email: yup.string().required().email('invalid email'),
    password: yup.string().required().min(8).max(16),
  })

  try {
    const { name, email, password } = await schema.validate(await req.json(), {
      abortEarly: false,
      disableStackTrace: true,
    })

    // check if email is already used
    const foundUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (foundUser) {
      return NextResponse.json(
        {
          email: ['email already in used'],
        },
        {
          status: 400,
        },
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const createdUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return NextResponse.json(createdUser, {
      status: 201,
    })
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors = error.inner.reduce(
        (accu, curr) =>
          Object.assign(accu, {
            [curr.path!]: curr.errors,
          }),
        {},
      )

      return NextResponse.json(errors, { status: 400 })
    }

    return NextResponse.json(
      { message: 'unexpected server error' },
      { status: 500 },
    )
  }
}
