import React from 'react'
import { z } from 'nestjs-zod/z'
import { useForm, Controller } from 'react-hook-form'
import { TextField, Button, Box, Grid } from '@mui/material'
import { zodResolver } from '@hookform/resolvers/zod'

const CreateUserSchema = z.object({
  password: z
    .string({
      required_error: 'Senha é obrigatória',
    })
    .min(1),
  phone: z.string().optional(),
  email: z
    .string({
      required_error: 'E-mail é obrigatório',
    })
    .email({ message: 'E-mail inválido.' }),
  document: z.string().optional(),
  birthDate: z.string({ required_error: 'Data de nascimento é obrigatória' }),
  instagram: z.string().optional(),
  pixKey: z.string().optional(),
  photoKey: z.string().optional(),
  profileId: z.number({
    required_error: 'O perfil é obrigatório',
    invalid_type_error: 'O perfil deve ser um número',
  }),
})

type ICreateUserSchema = z.infer<typeof CreateUserSchema>

export default function CreateUser() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateUserSchema>({
    resolver: zodResolver(CreateUserSchema),
  })

  const onSubmit = (data: ICreateUserSchema) => console.log(data)

  return (
    <Box
      component={'form'}
      bgcolor={'blue'}
      onSubmit={handleSubmit(onSubmit)}
      maxWidth={'1100px'}
      width={'100%'}
      p={6}
    >
      <Grid container spacing={2} sx={{ marginTop: -5 }}>
        <Grid item lg={6}>
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.password}
                fullWidth
                helperText={errors.password?.message}
                label="Senha"
              />
            )}
          />
        </Grid>
        <Grid item lg={6}>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.email}
                fullWidth
                helperText={errors.email?.message}
                label="Email"
              />
            )}
          />
        </Grid>
        <Grid item lg={4}>
          <Controller
            name="document"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                error={!!errors.document}
                fullWidth
                helperText={errors.document?.message}
                label="Documento"
              />
            )}
          />
        </Grid>
      </Grid>
      <Box display={'flex'} justifyContent={'flex-end'} mt={2}>
        <Button type="submit" variant="contained" color="success">
          Submit
        </Button>
      </Box>
    </Box>
  )
}
