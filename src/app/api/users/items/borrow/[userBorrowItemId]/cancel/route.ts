import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/utils/prisma'
import { DEFAULT_CANCELLED_BORROW_ITEM_MESSAGE } from '@/utils/constants'

export async function POST(
  req: NextRequest,
  { params: { userBorrowItemId } }: { params: { userBorrowItemId: string } },
) {
  const foundUserBorrowItem = await prisma.userBorrowItem.findUnique({
    where: {
      id: userBorrowItemId,
    },
    include: {
      status: true,
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

  try {
    if (foundUserBorrowItem.status.some((e) => e.borrowStatus === 'APPROVED')) {
      await prisma.item.update({
        where: {
          id: foundUserBorrowItem.itemId,
        },
        data: {
          stock: {
            increment: foundUserBorrowItem.amount,
          },
        },
      })
    }

    const cancelledUserBorrowItem = await prisma.userBorrowItem.update({
      where: {
        id: userBorrowItemId,
      },
      data: {
        status: {
          connectOrCreate: {
            create: {
              borrowStatus: 'CANCELLED',
              message: DEFAULT_CANCELLED_BORROW_ITEM_MESSAGE,
            },
            where: {
              borrowStatus_userBorrowItemId: {
                userBorrowItemId,
                borrowStatus: 'CANCELLED',
              },
            },
          },
        },
      },
    })

    return NextResponse.json(cancelledUserBorrowItem, {
      status: 201,
    })
  } catch (error) {
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
