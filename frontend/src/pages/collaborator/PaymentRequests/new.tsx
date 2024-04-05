import { BaseHeader } from '@/components/BaseHeader'
import { Helmet } from 'react-helmet-async'
import { CreateEditPaymentRequestForm } from './CreateEditPaymentRequestForm'
import { useCreatePaymentRequest } from './hooks/useCreatePaymentRequest'

export function CreatePaymentRequest() {
  const { form, handleSubmitForm, isSubmitting } = useCreatePaymentRequest()
  return (
    <div>
      <Helmet title="Novo pagamento" />
      <BaseHeader label="Criar pagamento" />
      <CreateEditPaymentRequestForm
        form={form}
        isSubmitting={isSubmitting}
        onSubmitForm={handleSubmitForm}
      />
    </div>
  )
}
