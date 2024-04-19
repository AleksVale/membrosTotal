import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { EditProfileForm, editProfileSchema } from './interfaces'
import ColaboratorService from '@/services/colaborator.service'
import { COLLABORATOR_PAGES } from '@/utils/constants/routes'
import { formatToDocument, formatToPhoneNumber } from '@/utils/formatters'
import { useAuth } from '@/hooks/useAuth'
dayjs.extend(utc)
export function useColaboratorProfile() {
  const [editing, setEditing] = useState(false)
  const navigate = useNavigate()
  const { updateProfilePhoto } = useAuth()
  const form = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      email: '',
      birthDate: undefined,
      document: '',
      firstName: '',
      instagram: '',
      lastName: '',
      phone: '',
      pixKey: '',
    },
  })

  const { reset } = form

  const handleSubmitForm = useCallback(
    async (data: EditProfileForm) => {
      try {
        setEditing(false)
        const response = await ColaboratorService.update(data)
        if (response.data.success) {
          const photoResponse = await ColaboratorService.createPhotoUser(
            data.file[0],
          )
          if (photoResponse.data.success) {
            updateProfilePhoto(URL.createObjectURL(data.file[0]))
            toast.success('Usuário editado com sucesso')
            navigate(COLLABORATOR_PAGES.home)
          }
        }
      } catch (err) {
        toast.error('Erro ao editar usuário')
      }
    },
    [navigate],
  )

  const fetchUser = useCallback(async () => {
    const { data } = await ColaboratorService.getCurrentUser()
    reset({
      email: data.user.email,
      phone: formatToPhoneNumber(data.user.phone),
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      document: formatToDocument(data.user.document ?? ''),
      birthDate: dayjs(data.user.birthDate, 'YYYY-MM-DD')
        .utc(false)
        .format('YYYY/MM/DD'),
      instagram: data.user.instagram ?? '',
      pixKey: data.user.pixKey ?? '',
      file: [data.photo ?? ''],
    })
  }, [reset])

  const goBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleToggleEditing = () => {
    setEditing((prev) => !prev)
  }

  const { isSubmitting } = form.formState

  return {
    form,
    isSubmitting,
    handleSubmitForm,
    goBack,
    editing,
    handleToggleEditing,
  }
}
