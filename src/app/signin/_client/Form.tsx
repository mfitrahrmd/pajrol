'use client'

import MyAlert from '@/app/_components/_client/MyAlert'
import Copyright from '@/app/_components/_server/Copyright'
import { TErrorClient } from '@/types/api'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Alert,
  Fade,
} from '@mui/material'
import Link from '@mui/material/Link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import * as yup from 'yup'

const schema = yup.object({
  email: yup.string().required().email('invalid email'),
  password: yup.string().required(),
})
type FormData = yup.InferType<typeof schema>

export default function Form({ callbackUrl }: { callbackUrl: string }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    mode: 'all',
    resolver: yupResolver(schema),
  })

  const r = useRouter()

  const [alert, setAlert] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  })

  const onSubmit: SubmitHandler<FormData> = async function (
    { email, password },
    e,
  ) {
    try {
      const res = await signIn('credentials', {
        redirect: false,
        callbackUrl,
        email,
        password,
      })

      if (!res) {
        throw new Error('server is busy')
      }

      if (!res.ok) {
        throw new Error(res.error || 'server is busy')
      }

      r.push(callbackUrl)
    } catch (error) {
      const e = JSON.parse((error as Error).message)
      if (e.errorType === 'server') {
        showAlert(e.message)
      } else if (e.errorType === 'client') {
        Object.entries(e.errors as object).forEach(([key, val], i) => {
          setError(
            key as keyof FormData,
            {
              types: val.reduce(
                (accu: any, curr: any, i: any) => ({
                  ...accu,
                  [i]: curr,
                }),
                {},
              ),
            },
            { shouldFocus: true },
          )
        })
      }
    }
  }

  const showAlert = function (message: string) {
    setAlert((prev) => ({
      ...prev,
      open: true,
      message,
    }))

    setTimeout(() => {
      setAlert((prev) => ({
        ...prev,
        open: false,
        message: '',
      }))
    }, 3000)
  }

  return (
    <>
      {alert.open && (
        <Fade in={alert.open}>
          <Alert
            severity="error"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            {alert.message}
          </Alert>
        </Fade>
      )}
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
          helperText={
            <>
              {errors.email?.types &&
                Object.entries(errors.email?.types).map(([typ, msg]) => {
                  return (
                    <Typography component="span" variant="caption" key={typ}>
                      {msg}
                      <br />
                    </Typography>
                  )
                })}
            </>
          }
          {...register('email')}
        />
        <TextField
          margin="normal"
          fullWidth
          id="password"
          label="Password"
          type="password"
          autoComplete="password"
          error={errors.password ? true : false}
          helperText={
            <>
              {errors.password?.types &&
                Object.entries(errors.password?.types).map(([typ, msg]) => {
                  return (
                    <Typography component="span" variant="caption" key={typ}>
                      {msg}
                      <br />
                    </Typography>
                  )
                })}
            </>
          }
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
