'use client'

import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
} from '@mui/lab'
import { Typography } from '@mui/material'
import FastfoodIcon from '@mui/icons-material/FastfoodOutlined'
import LaptopMacIcon from '@mui/icons-material/LaptopMacOutlined'
import HotelIcon from '@mui/icons-material/LocalHotelOutlined'
import RepeatIcon from '@mui/icons-material/RepeatOutlined'
import React from 'react'
import { UserBorrowItemStatus } from '@prisma/client'

export default function MyTimeline({
  status,
}: {
  status: UserBorrowItemStatus[]
}) {
  return (
    <Timeline position="alternate">
      {status.map((s) => (
        <TimelineItem key={s.id}>
          <TimelineOppositeContent
            sx={{ m: 'auto 0' }}
            align="right"
            variant="body2"
            color="text.secondary"
          >
            {s.at.toLocaleString()}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot>
              <FastfoodIcon />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: '12px', px: 2 }}>
            <Typography variant="h6" component="span">
              {s.message}
            </Typography>
            <Typography>{s.borrowStatus}</Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
