import http from "@/lib/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface UsePaymentActionsProps {
  paymentType: "refund" | "payment-request" | "payment";
  invalidateQueryKey: string[];
}

export function usePaymentActions({
  paymentType,
  invalidateQueryKey,
}: UsePaymentActionsProps) {
  const queryClient = useQueryClient();
  const baseUrl = `/${paymentType}-admin`;

  // Map payment types to endpoints
  const endpoints = {
    refund: {
      patch: (id: number) => `${baseUrl}/${id}`,
      upload: (id: number) => `${baseUrl}/${id}/file`,
      download: (id: number) => `${baseUrl}/signed_url/${id}`,
    },
    "payment-request": {
      patch: (id: number) => `${baseUrl}/${id}`,
      upload: (id: number) => `${baseUrl}/${id}/finish/file`,
      download: (id: number) => `${baseUrl}/signed_url/${id}`,
    },
    payment: {
      patch: (id: number) => `${baseUrl}/${id}/finish`, // Usando endpoint específico para payments
      upload: (id: number) => `${baseUrl}/${id}/finish/file`, // Upload para payments também é no finish
      download: (id: number) => `${baseUrl}/signed_url/${id}`,
    },
  };

  // Pay mutation
  const payMutation = useMutation({
    mutationFn: async ({
      id,
      reason,
      file,
    }: {
      id: number;
      reason?: string;
      file?: File | null;
    }) => {
      let paymentResponse;

      if (paymentType === "payment") {
        // For payments, use the specific /finish endpoint
        paymentResponse = await http.patch(endpoints[paymentType].patch(id));

        // If reason is provided, update it separately
        if (reason) {
          await http.patch(`${baseUrl}/${id}`, { reason });
        }
      } else {
        // For refunds and payment-requests, use normal PATCH with status and reason
        paymentResponse = await http.patch(endpoints[paymentType].patch(id), {
          status: "PAID",
          reason,
        });
      }

      // Upload file if provided
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        await http.post(endpoints[paymentType].upload(id), formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      return paymentResponse;
    },
    onSuccess: () => {
      toast.success("Item marcado como pago com sucesso");
      queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
    },
    onError: () => {
      toast.error(`Erro ao marcar como pago`);
    },
  });

  // Cancel mutation
  const cancelMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      return await http.patch(endpoints[paymentType].patch(id), {
        status: "CANCELLED",
        reason,
      });
    },
    onSuccess: () => {
      toast.success("Item cancelado com sucesso");
      queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
    },
    onError: () => {
      toast.error("Erro ao cancelar");
    },
  });

  // Download file function
  const downloadFile = async (id: number) => {
    try {
      const response = await http.get(endpoints[paymentType].download(id));
      if (response.data.signedUrl) {
        window.open(response.data.signedUrl, "_blank");
      }
    } catch {
      toast.error("Erro ao obter arquivo");
    }
  };

  return {
    pay: (id: number, reason?: string, file?: File | null) => {
      payMutation.mutate({ id, reason, file });
    },
    cancel: (id: number, reason: string) => {
      cancelMutation.mutate({ id, reason });
    },
    downloadFile,
    payMutation,
    cancelMutation,
  };
}
