import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";

interface LessonsQuery {
  submoduleId?: number;
  page: number;
  perPage: number;
  search?: string;
  filters?: Record<string, string | number | undefined>;
}

interface LessonListItem {
  id: number;
  title: string;
  description?: string;
  content: string;
  thumbnail?: string;
  order: number;
  submoduleId: number;
  submodule: {
    id: number;
    title: string;
    module: {
      id: number;
      title: string;
      trainingId: number;
    };
  };
  createdAt: string;
  updatedAt: string;
}

interface Submodule {
  id: number;
  title: string;
}

export function useLessons({
  submoduleId,
  page,
  perPage,
  search,
  filters,
}: LessonsQuery) {
  return useQuery({
    queryKey: QueryKeys.lessons.list({
      submoduleId,
      page,
      perPage,
      search,
      filters,
    }),
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });

      if (submoduleId) {
        params.append("subModuleId", submoduleId.toString());
      }

      if (search) {
        params.append("title", search);
      }

      const response = await http.get(`/lessons-admin?${params.toString()}`);
      
      return {
        lessons: response.data.data as LessonListItem[],
        totalItems: response.data.meta.total,
        totalPages: response.data.meta.lastPage,
        currentPage: response.data.meta.currentPage,
        submodules: [] as Submodule[], // We'll fetch this separately if needed
      };
    },
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
}
