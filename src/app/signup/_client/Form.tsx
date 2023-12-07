'use client'

import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid, TextField, Button } from '@mui/material'
import Link from '@mui/material/Link'
import { signIn } from 'next-auth/react'
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import * as yup from 'yup'

export default function Form() {
  const onSubmit: SubmitHandler<FormData> = async function (
    { name, email, newPassword: password },
    e,
  ) {
    console.log({
      name,
      email,
      password,
    })
  }

  const schema = yup.object({
    name: yup.string().required(),
    email: yup.string().required().email('invalid email'),
    newPassword: yup.string().required().min(8).max(16).label('password'),
    confirmPassword: yup
      .string()
      .required()
      .oneOf([yup.ref('newPassword')], 'password does not match'),
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
              helperText={errors.name?.message}
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
              helperText={errors.email?.message}
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
              helperText={errors.newPassword?.message}
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
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Grid container justifyContent="flex-end">
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
