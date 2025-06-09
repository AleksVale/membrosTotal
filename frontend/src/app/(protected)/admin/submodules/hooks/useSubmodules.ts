import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";

interface Submodule {
  id: number;
  title: string;
  description: string;
  thumbnail?: string;
  order: number;
  moduleId: number;
  module: {
    id: number;
    title: string;
    trainingId: number;
    training?: {
      title: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  lessonCount?: number;
}

interface SubmoduleResponse {
  data: Submodule[];
  meta: {
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  };
}

interface Module {
  id: number;
  title: string;
}

interface UseSubmodulesParams {
  moduleId?: number;
  page: number;
  perPage: number;
  search?: string;
  filters?: Record<string, string | undefined>;
}

export function useSubmodules({ moduleId, page, perPage, search, filters = {} }: UseSubmodulesParams) {
  // Query para buscar submódulos
  const {
    data: submodulesData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery<SubmoduleResponse>({
    queryKey: QueryKeys.submodules.list(page, perPage, search, moduleId, filters),
    queryFn: async () => {
      const params = new URLSearchParams();
      
      params.append("page", page.toString());
      params.append("per_page", perPage.toString());
      
      if (search) {
        params.append("title", search);
      }
      
      if (moduleId) {
        params.append("moduleId", moduleId.toString());
      }

      // Adiciona outros filtros
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const response = await http.get(`/sub-modules-admin?${params.toString()}`);
      return response.data;
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  // Query para buscar módulos (para o filtro)
  const { data: modulesData } = useQuery<Module[]>({
    queryKey: QueryKeys.modules.autocomplete,
    queryFn: async () => {
      const response = await http.get("/autocomplete?fields=modules");
      return response.data.modules || [];
    },
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    submodules: submodulesData?.data || [],
    totalItems: submodulesData?.meta.total || 0,
    totalPages: submodulesData?.meta.last_page || 1,
    currentPage: submodulesData?.meta.current_page || 1,
    modules: modulesData || [],
    isLoading,
    isFetching,
    isError,
    refetch,
  };
}
