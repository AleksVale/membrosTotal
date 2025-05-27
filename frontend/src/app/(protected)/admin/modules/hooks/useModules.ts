import { useQuery } from "@tanstack/react-query";
import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";

interface Module {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  order: number;
  trainingId: number;
  training?: {
    title: string;
  };
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

interface ModuleStats {
  total: number;
  submodules: number;
}

interface Training {
  id: number;
  title: string;
}

interface UseModulesParams {
  trainingId?: number;
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
    
    if (trainingId) {
      params.append("trainingId", trainingId.toString());
    }
    
    if (search) params.append("title", search);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    return params;
  };

  // Query para buscar a lista de módulos
  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery<ModuleResponse>({
    queryKey: QueryKeys.modules.list(trainingId || 'all', buildParams().toString()),
    queryFn: async () => {
      const response = await http.get<ModuleResponse>(`/training-modules-admin?${buildParams()}`);
      return response.data;
    },
    staleTime: 60000, // 1 minuto
    refetchOnWindowFocus: false,
  });

  // Query para buscar estatísticas
  const { data: statsData } = useQuery<ModuleStats>({
    queryKey: ['modules', 'stats', trainingId || 'all'],
    queryFn: async () => {
      const url = trainingId 
        ? `/training-modules-admin/stats?trainingId=${trainingId}`
        : '/training-modules-admin/stats';
      const response = await http.get<ModuleStats>(url);
      return response.data;
    },
    staleTime: 300000, // 5 minutos
    refetchOnWindowFocus: false,
    // Fallback em caso de erro
    onError: () => {
      console.warn('Failed to fetch module stats');
    },
  });

  // Query para buscar treinamentos para o filtro
  const { data: trainingsData } = useQuery<{ data: Training[] }>({
    queryKey: QueryKeys.trainings.all,
    queryFn: async () => {
      const response = await http.get('/training-admin?per_page=100');
      return response.data;
    },
    staleTime: 300000, // 5 minutos
    refetchOnWindowFocus: false,
    enabled: !trainingId, // Só busca todos os treinamentos se não tiver um trainingId específico
  });

  return {
    modules: data?.data || [],
    totalItems: data?.meta.total || 0,
    totalPages: data?.meta.last_page || 1,
    isLoading,
    isError,
    isFetching,
    refetch,
    stats: statsData,
    trainings: trainingsData?.data || [],
  };
}