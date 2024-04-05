import { HeaderUser } from '@/components/HeaderUser'
import { Helmet } from 'react-helmet-async'
import { CreateEditUserForm } from '@/components/userForm/CreateEditUserForm'
import { useEditUser } from './hooks/useEditUser'

export function EditUser() {
  const { form, isSubmitting, handleSubmitForm } = useEditUser()

  return (
    <div>
      <Helmet title="Editar usuário" />
      <HeaderUser label="Editar usuário" />
      <CreateEditUserForm
        form={form}
        isSubmitting={isSubmitting}
        onSubmitForm={handleSubmitForm}
        isEdit={true}
      />
    </div>
  )
}
