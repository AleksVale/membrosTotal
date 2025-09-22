import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Tipos
interface Payment {
  id: number;
  userId: number;
  value: number;
  paymentDate?: string;
  photoKey?: string;
  status: "PENDING" | "PAID" | "CANCELLED";
  reason?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  paymentTypeId?: number;
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

interface PaymentResponse {
  data: Payment[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
  };
}

interface CreatePaymentData {
  description: string;
  value: number;
  paymentTypeId: number;
  paymentDate?: string;
}

export function useCollaboratorPayments(params: URLSearchParams) {
  return useQuery<PaymentResponse>({
    queryKey: QueryKeys.collaborator.payments.list(params.toString()),
    queryFn: async () => {
      const response = await http.get<PaymentResponse>(
        `/collaborator/payments?${params}`
      );
      return response.data;
    },
    staleTime: 60000, // 1 minuto
    refetchOnWindowFocus: false,
  });
}

export function usePaymentTypes() {
  return useQuery({
    queryKey: QueryKeys.autocomplete.fields(["paymentTypes"]),
    queryFn: async () => {
      const response = await http.get("/autocomplete?fields=paymentTypes");
      return response.data.paymentTypes || [];
    },
    staleTime: 300000, // 5 minutos
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePaymentData) => {
      const response = await http.post("/collaborator/payments", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Pagamento registrado com sucesso");
      queryClient.invalidateQueries({
        queryKey: QueryKeys.collaborator.payments.all,
      });
    },
    onError: () => {
      toast.error("Erro ao registrar pagamento");
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreatePaymentData>;
    }) => {
      const response = await http.patch(`/collaborator/payments/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Pagamento atualizado com sucesso");
      queryClient.invalidateQueries({
        queryKey: QueryKeys.collaborator.payments.all,
      });
    },
    onError: () => {
      toast.error("Erro ao atualizar pagamento");
    },
  });
}

export function useCancelPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      const response = await http.delete(`/collaborator/payments/${id}`, {
        data: { reason },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Pagamento cancelado com sucesso");
      queryClient.invalidateQueries({
        queryKey: QueryKeys.collaborator.payments.all,
      });
    },
    onError: () => {
      toast.error("Erro ao cancelar pagamento");
    },
  });
}

export function useUploadPaymentFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await http.post(
        `/collaborator/payments/${id}/file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Arquivo enviado com sucesso");
      queryClient.invalidateQueries({
        queryKey: QueryKeys.collaborator.payments.all,
      });
    },
    onError: () => {
      toast.error("Erro ao enviar arquivo");
    },
  });
}

// Hook para estatísticas gerais
export function usePaymentOverviewStats() {
  return useQuery({
    queryKey: QueryKeys.collaborator.payments.overview,
    queryFn: async () => {
      const response = await http.get("/collaborator/payment-stats/overview");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para dados mensais
export function usePaymentMonthlyStats(months: number = 6) {
  return useQuery({
    queryKey: QueryKeys.collaborator.payments.monthly(months),
    queryFn: async () => {
      const response = await http.get(
        `/collaborator/payment-stats/monthly?months=${months}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para estatísticas por categoria
export function usePaymentCategoryStats() {
  return useQuery({
    queryKey: QueryKeys.collaborator.payments.categories,
    queryFn: async () => {
      const response = await http.get("/collaborator/payment-stats/categories");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
