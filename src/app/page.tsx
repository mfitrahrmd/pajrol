import { Container, Divider, Paper, Stack, Typography } from '@mui/material'
import MyTimeline from './_components/_client/MyTimeline'
import prisma from '@/utils/prisma'
import { getServerSession } from 'next-auth'
import authOptions from '@/utils/authOptions'

export default async function Home() {
  const session = await getServerSession(authOptions)

  const borrowItems = await prisma.userBorrowItem.findMany({
    where: {
      userId: session?.user?.id,
    },
    include: {
      status: true,
      item: true,
    },
  })

  return (
    <>
      <Container maxWidth="xl">
        <Stack divider={<Divider />}>
          {borrowItems.map((borrowItem) => (
            <Paper
              elevation={0}
              key={borrowItem.id}
              sx={{
                textAlign: 'center',
              }}
            >
              <Typography variant="h3">{borrowItem.item.name}</Typography>
              <MyTimeline status={borrowItem.status} />
            </Paper>
          ))}
        </Stack>
      </Container>
    </>
  )
}
