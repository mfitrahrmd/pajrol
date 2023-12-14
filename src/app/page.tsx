import { Container, Grid } from '@mui/material'
import prisma from '@/utils/prisma'
import { getServerSession } from 'next-auth'
import authOptions from '@/utils/authOptions'
import ItemCard from './_components/_client/ItemCard'
import InfoCard from './_components/_client/InfoCard'

export default async function Home() {
  const session = await getServerSession(authOptions)

  const items = await prisma.item.findMany()

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{
          padding: 2,
        }}
      >
        <Grid container spacing={2}>
          {Array.from(Array(3)).map((_, i) => (
            <Grid item key={i} xs={12} md={4}>
              <InfoCard />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={2}>
          {items.map((item) => (
            <Grid key={item.id} item xs={6} sm={6} md={3}>
              <ItemCard item={item} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  )
}
