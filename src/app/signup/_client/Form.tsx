'use client'

import MyAlert from '@/app/_components/_client/MyAlert'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material'
import Link from '@mui/material/Link'
import axios from 'axios'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().required().email('invalid email'),
  newPassword: yup.string().required().min(8).max(16).label('password'),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('newPassword')], 'password does not match')
    .label('confirm password'),
})
type FormData = yup.InferType<typeof schema>

export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<FormData>({
    mode: 'all',
    criteriaMode: 'all',
    resolver: yupResolver(schema, {
      abortEarly: false,
    }),
  })

  const [status, setStatus] = useState<{ open: boolean; message: string }>({
    open: false,
    message: '',
  })

  const onSubmit: SubmitHandler<FormData> = async function (
    { name, email, newPassword: password },
    e,
  ) {
    try {
      const res = await axios.post<{ id: string; name: string; email: string }>(
        '/api/users/signup',
        {
          name,
          email,
          password,
        },
      )

      reset()
      setStatus((prev) => ({
        ...prev,
        open: true,
        message: `signed up with email ${res.data.email}`,
      }))
    } catch (error) {
      if (axios.isAxiosError<Record<keyof FormData, string[]>>(error)) {
        if (error.response) {
          Object.entries(error.response.data).forEach(([key, val], i) => {
            setError(
              key as keyof FormData,
              {
                types: val.reduce(
                  (accu, curr, i) => ({
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
  }

  return (
    <>
      <Snackbar
        open={status.open}
        autoHideDuration={5000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={() => {
          setStatus((prev) => ({
            ...prev,
            open: false,
            message: '',
          }))
        }}
      >
        <Alert
          onClose={() => {
            setStatus((prev) => ({
              ...prev,
              open: false,
              message: '',
            }))
          }}
          severity="success"
          sx={{ width: '100%' }}
        >
          {status.message}
        </Alert>
      </Snackbar>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 3 }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoComplete="name"
              required
              fullWidth
              id="name"
              label="Name"
              autoFocus
              error={errors.name ? true : false}
              helperText={
                <>
                  {errors.name?.types &&
                    Object.entries(errors.name?.types).map(([typ, msg]) => {
                      return (
                        <Typography
                          component="span"
                          variant="caption"
                          key={typ}
                        >
                          {msg}
                          <br />
                        </Typography>
                      )
                    })}
                </>
              }
              {...register('name')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              error={errors.email ? true : false}
              helperText={
                <>
                  {errors.email?.types &&
                    Object.entries(errors.email?.types).map(([typ, msg]) => {
                      return (
                        <Typography
                          component="span"
                          variant="caption"
                          key={typ}
                        >
                          {msg}
                          <br />
                        </Typography>
                      )
                    })}
                </>
              }
              {...register('email')}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              label="Password"
              type="password"
              id="newPassword"
              autoComplete="newPassword"
              error={errors.newPassword ? true : false}
              helperText={
                <>
                  {errors.newPassword?.types &&
                    Object.entries(errors.newPassword?.types).map(
                      ([typ, msg]) => {
                        return (
                          <Typography
                            component="span"
                            variant="caption"
                            key={typ}
                          >
                            {msg}
                            <br />
                          </Typography>
                        )
                      },
                    )}
                </>
              }
              {...register('newPassword')}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="confirmPassword"
              error={errors.confirmPassword ? true : false}
              helperText={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </Grid>
          <Grid item xs={8}>
            <Button type="submit" fullWidth variant="contained">
              Sign Up
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              type="reset"
              fullWidth
              variant="outlined"
              onClick={() => {
                reset()
              }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>

        <Grid container justifyContent="flex-end" mt={2}>
          <Grid item>
            <Link href="/signin" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
