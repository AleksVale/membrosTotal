import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Tipos
interface PaymentRequest {
  id: number;
  userId: number;
  value: number;
  requestDate?: string;
  photoKey?: string;
  status: "PENDING" | "PAID" | "CANCELLED";
  reason?: string;
  approvedPhotoKey?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  paymentRequestTypeId?: number;
  PaymentRequestType?: {
    id: number;
    label: string;
  };
}

interface PaymentRequestResponse {
  data: PaymentRequest[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
  };
}

interface CreatePaymentRequestData {
  description: string;
  value: number;
  paymentRequestTypeId: number;
  requestDate?: string;
}

export function useCollaboratorPaymentRequests(params: URLSearchParams) {
  return useQuery<PaymentRequestResponse>({
    queryKey: QueryKeys.collaborator.paymentRequests.list(params.toString()),
    queryFn: async () => {
      const response = await http.get<PaymentRequestResponse>(
        `/collaborator/payment_requests?${params}`
      );
      return response.data;
    },
    staleTime: 60000, // 1 minuto
    refetchOnWindowFocus: false,
  });
}

export function usePaymentRequestTypes() {
  return useQuery({
    queryKey: QueryKeys.autocomplete.fields(["paymentRequest"]),
    queryFn: async () => {
      const response = await http.get("/autocomplete?fields=paymentRequest");
      return response.data.paymentRequest || [];
    },
    staleTime: 300000, // 5 minutos
  });
}

export function useCreatePaymentRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePaymentRequestData) => {
      const response = await http.post("/collaborator/payment_requests", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Solicitação de pagamento criada com sucesso");
      queryClient.invalidateQueries({ queryKey: QueryKeys.collaborator.paymentRequests.all });
    },
    onError: () => {
      toast.error("Erro ao criar solicitação de pagamento");
    },
  });
}

export function useUpdatePaymentRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreatePaymentRequestData>;
    }) => {
      const response = await http.patch(
        `/collaborator/payment_requests/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Solicitação de pagamento atualizada com sucesso");
      queryClient.invalidateQueries({ queryKey: QueryKeys.collaborator.paymentRequests.all });
    },
    onError: () => {
      toast.error("Erro ao atualizar solicitação de pagamento");
    },
  });
}

export function useCancelPaymentRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await http.delete(`/collaborator/payment_requests/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Solicitação de pagamento cancelada com sucesso");
      queryClient.invalidateQueries({ queryKey: QueryKeys.collaborator.paymentRequests.all });
    },
    onError: () => {
      toast.error("Erro ao cancelar solicitação de pagamento");
    },
  });
}

export function useUploadPaymentRequestFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await http.post(
        `/collaborator/payment_requests/${id}/file`,
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
      queryClient.invalidateQueries({ queryKey: QueryKeys.paymentRequests.all });
    },
    onError: () => {
      toast.error("Erro ao enviar arquivo");
    },
  });
} 