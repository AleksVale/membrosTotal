"use client";

import { PaymentForm } from "@/components/payments/payment-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import http from "@/lib/http";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Payment {
  id: number;
  value: number;
  description: string;
  expertId: number;
  paymentTypeId: number;
  paymentDate?: string;
  PaymentType?: {
    id: number;
    label: string;
  };
  User?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export default function EditPaymentPage() {
  const params = useParams();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await http.get(`/payment-admin/${params.id}`);
        setPayment(response.data);
      } catch {
        toast.error("Não foi possível carregar os dados do pagamento");
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [params.id]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!payment) {
    return <div>Pagamento não encontrado</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        {payment && (
          <PaymentForm
            initialData={{
              value: payment.value,
              description: payment.description,
              expertId: payment.expertId,
              paymentTypeId: payment.paymentTypeId,
              paymentDate: payment.paymentDate
                ? new Date(payment.paymentDate)
                : new Date(),
            }}
            paymentId={payment.id}
          />
        )}
      </CardContent>
    </Card>
  );
}
