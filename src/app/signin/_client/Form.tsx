'use client'

import Copyright from '@/app/_components/_server/Copyright'
import { yupResolver } from '@hookform/resolvers/yup'
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
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import * as yup from 'yup'

export default function Form({ callbackUrl }: { callbackUrl: string }) {
  const onSubmit: SubmitHandler<{ email: string; password: string }> =
    async function ({ email, password }, e) {
      const res = await signIn('credentials', {
        redirect: false,
        callbackUrl,
        email,
        password,
      })

      alert(res?.error)
    }

  const schema = yup.object({
    email: yup.string().required().email('invalid email'),
    password: yup.string().required(),
  })
  type FormData = yup.InferType<typeof schema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'all',
    resolver: yupResolver(schema),
  })
  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 1 }}
      >
        <TextField
          margin="normal"
          fullWidth
          id="email"
          label="Email Address"
          autoComplete="email"
          autoFocus
          error={errors.email ? true : false}
          helperText={errors.email?.message}
          {...register('email')}
        />
        <TextField
          margin="normal"
          fullWidth
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password ? true : false}
          helperText={errors.password?.message}
          {...register('password')}
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
