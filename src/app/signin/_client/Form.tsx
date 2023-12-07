'use client'

import Copyright from '@/app/_components/_server/Copyright'
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
} from '@mui/material'
import Link from '@mui/material/Link'
import { signIn } from 'next-auth/react'
import React from 'react'

export default function Form() {
  return (
    <>
      <Box
        component="form"
        onSubmit={async (e) => {
          e.preventDefault()
        }}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item>
            <Link href="/signup" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
        <Copyright sx={{ mt: 5 }} />
      </Box>
    </>
  )
}
