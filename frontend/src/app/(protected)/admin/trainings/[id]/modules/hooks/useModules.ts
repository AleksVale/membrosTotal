import { useQuery } from "@tanstack/react-query";
import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";

// Interfaces de resposta e filtros
interface Module {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  order: number;
  trainingId: number;
  createdAt: string;
  updatedAt: string;
  submoduleCount?: number;
}

interface ModuleResponse {
  data: Module[];
  meta: {
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  };
}

interface Training {
  id: number;
  title: string;
  description: string;
  tutor: string;
  thumbnail?: string;
  status: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface UseModulesParams {
  trainingId: number;
  page: number;
  perPage: number;
  search?: string;
  filters?: Record<string, string | undefined>;
}

export function useModules({ trainingId, page, perPage, search, filters = {} }: UseModulesParams) {
  // Construção dos parâmetros
  const buildParams = () => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("per_page", perPage.toString());
    params.append("trainingId", trainingId.toString());
    
    if (search) params.append("title", search);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    return params;
  };

  // Query para buscar o treinamento pai
  const { data: trainingData } = useQuery<{ training: Training }>({
    queryKey: QueryKeys.trainings.detail(trainingId),
    queryFn: async () => {
      const response = await http.get(`/training-admin/${trainingId}`);
      return response.data;
    },
    staleTime: 300000, // 5 minutos
    refetchOnWindowFocus: false,
  });

  // Query para buscar a lista de módulos
  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery<ModuleResponse>({
    queryKey: QueryKeys.modules.list(trainingId, buildParams().toString()),
    queryFn: async () => {
      const response = await http.get<ModuleResponse>(`/training-modules-admin?${buildParams()}`);
      return response.data;
    },
    staleTime: 60000, // 1 minuto
    refetchOnWindowFocus: false,
    enabled: !!trainingId,
  });

  return {
    modules: data?.data || [],
    totalItems: data?.meta.total || 0,
    totalPages: data?.meta.last_page || 1,
    isLoading,
    isError,
    isFetching,
    refetch,
    training: trainingData?.training,
  };
}