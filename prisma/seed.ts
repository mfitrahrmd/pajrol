import prisma from '../src/utils/prisma'
import { Prisma } from '@prisma/client'

async function seed() {
  const fakeItems: Prisma.ItemCreateManyInput[] = Array.from(Array(10)).map(
    (_, i) => ({
      name: `name${i}`,
      description: `description${i}`,
      stock: 10,
    }),
  )
  try {
    await prisma.item.deleteMany()

    await prisma.item.createMany({
      data: fakeItems,
    })
  } catch (error) {
    console.log(error)
  }
}

seed()
