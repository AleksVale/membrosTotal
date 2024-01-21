import { useForm, Controller } from 'react-hook-form'
import { TextField, Button, Paper } from '@mui/material'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginFormSchema, LoginFormValues } from './schema'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export const Login = () => {
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
  })

  const { login } = useAuth()
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const profile = await login(data.email, data.password)
      switch (profile) {
        case 'admin':
          navigate('/executive')
          break
        case 'employee':
          navigate('/employee')
          break
        case 'expert':
          navigate('/expert')
          break
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Paper
      elevation={5}
      sx={{
        padding: 4,
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.email}
              helperText={errors.email?.message}
              label="Email"
              variant="outlined"
              margin="normal"
              fullWidth
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              error={!!errors.password}
              helperText={errors.password?.message}
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              fullWidth
            />
          )}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
    </Paper>
  )
}
