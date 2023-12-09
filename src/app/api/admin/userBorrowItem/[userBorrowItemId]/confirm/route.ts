import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/utils/prisma'
import * as yup from 'yup'
import { DEFAULT_BORROWED_BORROW_ITEM_MESSAGE } from '@/utils/constants'

export async function POST(
  req: NextRequest,
  { params: { userBorrowItemId } }: { params: { userBorrowItemId: string } },
) {
  const foundUserBorrowItem = await prisma.userBorrowItem.findUnique({
    where: {
      id: userBorrowItemId,
    },
  })

  if (!foundUserBorrowItem) {
    return NextResponse.json(
      {
        message: 'user borrow item was not found',
      },
      { status: 404 },
    )
  }

  const schema = yup.object({
    message: yup.string(),
  })

  try {
    const body = await schema.validate(await req.json())

    const confirmedUserBorrowItem = await prisma.userBorrowItem.update({
      where: {
        id: userBorrowItemId,
      },
      data: {
        status: {
          connectOrCreate: {
            create: {
              borrowStatus: 'BORROWED',
              message: body.message ?? DEFAULT_BORROWED_BORROW_ITEM_MESSAGE,
            },
            where: {
              borrowStatus_userBorrowItemId: {
                userBorrowItemId,
                borrowStatus: 'BORROWED',
              },
            },
          },
        },
      },
    })

    return NextResponse.json(confirmedUserBorrowItem, {
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
