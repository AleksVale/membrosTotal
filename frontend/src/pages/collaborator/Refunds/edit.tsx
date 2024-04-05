import { BaseHeader } from '@/components/BaseHeader'
import { Helmet } from 'react-helmet-async'
import { CreateEditPaymentRefund } from './CreateEditPaymentRefund'
import { useEditRefund } from './hooks/useEditRefund'

export function EditRefunds() {
  const { form, handleSubmitForm, isSubmitting } = useEditRefund()
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
