import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Tipos
interface Refund {
  id: number;
  userId: number;
  value: number;
  refundDate?: string;
  photoKey?: string;
  status: "PENDING" | "PAID" | "CANCELLED";
  reason?: string;
  approvedPhotoKey?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  refundTypeId?: number;
  RefundType?: {
    id: number;
    label: string;
  };
}

interface RefundResponse {
  data: Refund[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
  };
}

interface CreateRefundData {
  description: string;
  value: number;
  refundTypeId: number;
  refundDate: string;
}

export function useCollaboratorRefunds(params: URLSearchParams) {
  return useQuery<RefundResponse>({
    queryKey: QueryKeys.collaborator.refunds.list(params.toString()),
    queryFn: async () => {
      const response = await http.get<RefundResponse>(
        `/collaborator/refunds?${params}`
      );
      return response.data;
    },
    staleTime: 60000, // 1 minuto
    refetchOnWindowFocus: false,
  });
}

// Exportar useRefundTypes do hook centralizado
export { useRefundTypes } from "../useAutocomplete";

export function useCreateRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateRefundData) => {
      const response = await http.post("/collaborator/refunds", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Solicitação de reembolso criada com sucesso");
      queryClient.invalidateQueries({ queryKey: QueryKeys.collaborator.refunds.all });
    },
    onError: () => {
      toast.error("Erro ao criar solicitação de reembolso");
    },
  });
}

export function useUpdateRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<CreateRefundData>;
    }) => {
      const response = await http.patch(
        `/collaborator/refunds/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Solicitação de reembolso atualizada com sucesso");
      queryClient.invalidateQueries({ queryKey: QueryKeys.collaborator.refunds.all });
    },
    onError: () => {
      toast.error("Erro ao atualizar solicitação de reembolso");
    },
  });
}

export function useUploadRefundFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, file }: { id: number; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await http.post(
        `/collaborator/refunds/${id}/file`,
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
      queryClient.invalidateQueries({ queryKey: QueryKeys.collaborator.refunds.all });
    },
    onError: () => {
      toast.error("Erro ao enviar arquivo");
    },
  });
} 