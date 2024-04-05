import { useNewUser } from './hooks/useNewUser'
import { HeaderUser } from '@/components/HeaderUser'
import { Helmet } from 'react-helmet-async'
import { CreateEditUserForm } from '@/components/userForm/CreateEditUserForm'

export function CreateUser() {
  const { form, isSubmitting, handleSubmitForm } = useNewUser()

  return (
    <div>
      <Helmet title="Novo usuário" />
      <HeaderUser label="Criar usuário" />
      <CreateEditUserForm
        form={form}
        isSubmitting={isSubmitting}
        onSubmitForm={handleSubmitForm}
      />
    </div>
  )
}
