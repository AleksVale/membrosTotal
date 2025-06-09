import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface User {
  id: number;
  name: string;
  email: string;
}

interface SubmodulePermissions {
  users: User[];
  totalUsers: number;
}

interface UpdatePermissionsData {
  removedUsers?: number[];
  addedUsers?: number[];
  addRelatives?: boolean;
}

export function useSubmodulePermissions(submoduleId: number) {
  return useQuery<SubmodulePermissions>({
    queryKey: QueryKeys.submodules.permissions(submoduleId),
    queryFn: async () => {
      const response = await http.get(`/sub-modules-admin/${submoduleId}/permissions`);
      return response.data;
    },
    enabled: !!submoduleId,
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
}

export function useUpdateSubmodulePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      submoduleId, 
      data 
    }: { 
      submoduleId: number; 
      data: UpdatePermissionsData 
    }) => {
      const response = await http.patch(`/sub-modules-admin/permissions/${submoduleId}`, data);
      return response.data;
    },
    onSuccess: (_, { submoduleId }) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.submodules.permissions(submoduleId),
      });
      queryClient.invalidateQueries({
        queryKey: QueryKeys.submodules.detail(submoduleId),
      });
      toast.success("Permissões atualizadas com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar permissões:", error);
      toast.error("Erro ao atualizar permissões. Tente novamente.");
    },
  });
}
