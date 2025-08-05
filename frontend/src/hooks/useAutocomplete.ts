import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { AutocompleteResponse } from "@/shared/types/autocomplete";
import { useQuery } from "@tanstack/react-query";

/**
 * Hook reutilizável para buscar dados de autocomplete
 */
export function useAutocomplete(fields: string[]) {
  return useQuery<AutocompleteResponse>({
    queryKey: QueryKeys.autocomplete.fields(fields),
    queryFn: async () => {
      const fieldsParam = fields.join(",");
      const response = await http.get<AutocompleteResponse>(
        `/autocomplete?fields=${fieldsParam}`
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: fields.length > 0, // Só executa se houver campos
  });
}

/**
 * Hook específico para buscar tipos de refund
 */
export function useRefundTypes() {
  const { data, ...rest } = useAutocomplete(["refundTypes"]);
  return {
    data: data?.refundTypes || [],
    ...rest,
  };
}

/**
 * Hook específico para buscar tipos de payment request
 */
export function usePaymentRequestTypes() {
  const { data, ...rest } = useAutocomplete(["paymentRequest"]);
  return {
    data: data?.paymentRequest || [],
    ...rest,
  };
}

/**
 * Hook específico para buscar tipos de payment
 */
export function usePaymentTypes() {
  const { data, ...rest } = useAutocomplete(["paymentTypes"]);
  return {
    data: data?.paymentTypes || [],
    ...rest,
  };
}

/**
 * Hook específico para buscar users/experts
 */
export function useUsers() {
  const { data, ...rest } = useAutocomplete(["users"]);
  return {
    data: data?.users || [],
    ...rest,
  };
}

/**
 * Hook específico para buscar experts
 */
export function useExperts() {
  const { data, ...rest } = useAutocomplete(["experts"]);
  return {
    data: data?.experts || [],
    ...rest,
  };
}