import { BaseHeader } from '@/components/BaseHeader'
import { Helmet } from 'react-helmet-async'
import { CreateEditPaymentRefund } from './CreateEditPaymentRefund'
import { useCreateRefund } from './hooks/useCreateRefund'

export function CreateRefunds() {
  const { form, handleSubmitForm, isSubmitting } = useCreateRefund()
  return (
    <div>
      <Helmet title="Novo Reembolso" />
      <BaseHeader label="Criar Reembolso" />
      <CreateEditPaymentRefund
        form={form}
        isSubmitting={isSubmitting}
        onSubmitForm={handleSubmitForm}
      />
    </div>
  )
}
