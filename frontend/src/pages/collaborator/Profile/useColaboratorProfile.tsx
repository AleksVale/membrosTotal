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
dayjs.extend(utc)
export function useColaboratorProfile() {
  const [editing, setEditing] = useState(false)
  const navigate = useNavigate()
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
      setEditing(false)
      const response = await ColaboratorService.update(data)
      if (response.data.success) {
        toast.success('Usuário editado com sucesso')
        navigate(COLLABORATOR_PAGES.home)
      }
    },
    [navigate],
  )

  const fetchUser = useCallback(async () => {
    const { data } = await ColaboratorService.getCurrentUser()
    reset({
      email: data.email,
      phone: formatToPhoneNumber(data.phone),
      firstName: data.firstName,
      lastName: data.lastName,
      document: formatToDocument(data.document ?? ''),
      birthDate: dayjs(data.birthDate, 'YYYY-MM-DD')
        .utc(false)
        .format('YYYY/MM/DD'),
      instagram: data.instagram ?? '',
      pixKey: data.pixKey ?? '',
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
