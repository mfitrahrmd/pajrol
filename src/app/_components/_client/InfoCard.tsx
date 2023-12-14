'use client'

import { Card, CardContent, Typography } from '@mui/material'
import React from 'react'

export default function InfoCard() {
  return (
    <Card
      elevation={0}
      sx={(theme) => ({
        background: `linear-gradient(90deg, ${theme.palette.secondary[50]} 0%, ${theme.palette.secondary[200]} 35%, ${theme.palette.secondary[600]} 100%)`,
        borderRadius: 4,
      })}
    >
      <CardContent>
        <Typography variant="h4" fontWeight="bold">
          `APR
        </Typography>
        <Typography>Personal Wine</Typography>
        <Typography variant="caption">selector</Typography>
      </CardContent>
    </Card>
  )
}
