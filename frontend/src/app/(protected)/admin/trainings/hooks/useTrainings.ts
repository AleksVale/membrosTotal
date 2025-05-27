import { useQuery } from "@tanstack/react-query";
import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";

// Interfaces de resposta e filtros
interface Training {
  id: number;
  title: string;
  description: string;
  tutor: string;
  thumbnail?: string;
  status?: string;
  createdAt: string;
  updatedAt: string;
  totalStudents?: number;
  totalModules?: number;
  order: number;
}

interface TrainingResponse {
  data: Training[];
  meta: {
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  };
}

interface TrainingStats {
  total: number;
  students: number;
  active: number;
  draft: number;
  archived: number;
}

interface UseTrainingsParams {
  page: number;
  perPage: number;
  search?: string;
  filters?: Record<string, string | undefined>;
}

export function useTrainings({ page, perPage, search, filters = {} }: UseTrainingsParams) {
  // Construção dos parâmetros
  const buildParams = () => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("per_page", perPage.toString());
    
    if (search) params.append("title", search);
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    return params;
  };

  // Query para buscar a lista de treinamentos
  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery<TrainingResponse>({
    queryKey: QueryKeys.trainings.list(buildParams().toString()),
    queryFn: async () => {
      const response = await http.get<TrainingResponse>(`/training-admin?${buildParams()}`);
      return response.data;
    },
    staleTime: 60000, // 1 minuto
    refetchOnWindowFocus: false,
  });

  // Query para buscar estatísticas
  const { data: statsData } = {
    data: {
      total: 0,
      students: 0,
      active: 0,
      draft: 0, 
      archived: 0
    } as TrainingStats,
  };

  return {
    trainings: data?.data || [],
    totalItems: data?.meta.total || 0,
    totalPages: data?.meta.last_page || 1,
    isLoading,
    isError,
    isFetching,
    refetch,
    stats: statsData || {
      total: 0,
      students: 0,
      active: 0,
      draft: 0,
      archived: 0,
    },
  };
}