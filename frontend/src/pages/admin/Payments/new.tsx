import { Helmet } from 'react-helmet-async'
import { useCreatePayment } from './hooks/useCreatePayment'
import { CreateEditPaymentForm } from './CreateEditPaymentForm'
import { BaseHeader } from '@/components/BaseHeader'

export function CreatePaymentAdmin() {
  const { form, isSubmitting, handleSubmitForm } = useCreatePayment()

  return (
    <div>
      <Helmet title="Novo pagamento" />
      <BaseHeader label="Criar pagamento" />
      <CreateEditPaymentForm
        form={form}
        isSubmitting={isSubmitting}
        onSubmitForm={handleSubmitForm}
      />
    </div>
  )
}
