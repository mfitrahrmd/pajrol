'use client'

import { Alert, Snackbar, SnackbarProps } from '@mui/material'
import { SyntheticEvent } from 'react'

export default function MyAlert({
  open,
  onClose,
  ...props
}: {
  open: boolean
  onClose: (event: Event | SyntheticEvent<any, Event>) => void
} & SnackbarProps) {
  return (
    <Snackbar open={open} onClose={onClose} autoHideDuration={6000} {...props}>
      <Alert severity="success" sx={{ width: '100%' }}>
        This is a success message!
      </Alert>
    </Snackbar>
  )
}
