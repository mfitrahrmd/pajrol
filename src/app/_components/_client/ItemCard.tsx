'use client'

import { Card, CardMedia, CardContent, Typography } from '@mui/material'
import { Item } from '@prisma/client'
import MyTypography from './MyTypography'

export default function ItemCard({ item }: { item: Item }) {
  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        'borderRadius': 4,
        'bgcolor': theme.palette.primary[50],
        'overflow': 'visible',
        ':hover': {
          '& .MuiCardMedia-root': {
            transform: 'scale(1.025)',
          },
          '& .MyTypography-root::before': {
            transform: 'scaleX(1)',
          },
        },
      })}
    >
      {item.image && (
        <CardMedia
          sx={{
            height: '250px',
            transition: 'all 0.25s',
            borderRadius: 4,
          }}
          image={item.image}
        />
      )}
      <CardContent
        sx={{
          textAlign: 'center',
        }}
      >
        <Typography gutterBottom variant="h6" component="div">
          {item.name}
        </Typography>
        <Typography variant="body2">Lorem ipsum dolor sit amet.</Typography>
        <MyTypography variant="body1" display="inline">
          Stock :<Typography component="span">10</Typography>
        </MyTypography>
      </CardContent>
    </Card>
  )
}
