import { Helmet } from 'react-helmet-async'
import { CreateEditPaymentForm } from './CreateEditPaymentForm'
import { BaseHeader } from '@/components/BaseHeader'
import { useEditPayment } from './hooks/useEditPayment'

export function EditPayment() {
  const { form, isSubmitting, handleSubmitForm, loading } = useEditPayment()

  return (
    <div>
      <Helmet title="Editar pagamento" />
      <BaseHeader label="Editar pagamento" />
      {!loading && (
        <CreateEditPaymentForm
          form={form}
          isSubmitting={isSubmitting}
          onSubmitForm={handleSubmitForm}
          isEdit={true}
        />
      )}
    </div>
  )
}
