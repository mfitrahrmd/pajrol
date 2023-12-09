import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/utils/prisma'
import { DEFAULT_PENDING_BORROW_ITEM_MESSAGE } from '@/utils/constants'
import * as yup from 'yup'

export async function POST(
  req: NextRequest,
  { params }: { params: { itemId: string } },
) {
  const token = await getToken({ req })

  if (!token)
    return NextResponse.json(
      {
        message: 'unauthenticated',
      },
      {
        status: 401,
      },
    )

  if (token.role !== 'USER')
    return NextResponse.json(
      {
        message: 'unauthorized',
      },
      {
        status: 403,
      },
    )

  const schema = yup.object({
    amount: yup.number().required().min(1),
    returnDue: yup
      .date()
      .min(new Date(), 'return due can not less than current date time'),
  })

  try {
    const body = await schema.validate(await req.json())

    const foundItem = await prisma.item.findUnique({
      where: {
        id: params.itemId,
      },
    })

    if (!foundItem) {
      return NextResponse.json(
        {
          message: 'item was not found',
        },
        {
          status: 404,
        },
      )
    }

    if (body.amount > foundItem.stock) {
      return NextResponse.json(
        {
          message: "can not borrow item beyond it's stock",
        },
        {
          status: 400,
        },
      )
    }

    const createdBorrowItem = await prisma.userBorrowItem.create({
      data: {
        amount: body.amount,
        returnDue: body.returnDue,
        userId: token.id,
        itemId: params.itemId,
        status: {
          create: {
            borrowStatus: 'PENDING',
            message: DEFAULT_PENDING_BORROW_ITEM_MESSAGE,
          },
        },
      },
    })

    return NextResponse.json(createdBorrowItem, {
      status: 201,
    })
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        },
      )
    }

    return NextResponse.json(
      {
        message: 'unexpected server error',
      },
      {
        status: 500,
      },
    )
  }
}
