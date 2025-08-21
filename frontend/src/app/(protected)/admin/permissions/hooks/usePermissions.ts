import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Types
export interface Permission {
  id: number;
  userId: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface PermissionStats {
  totalUsers: number;
  totalTrainings: number;
  totalModules: number;
  totalSubmodules: number;
  totalPermissions: number;
  recentChanges: number;
}

export interface AddPermissionData {
  removedUsers?: number[];
  addedUsers?: number[];
  addRelatives?: boolean;
}

// Training Permissions
export function useTrainingPermissions(trainingId: number) {
  return useQuery<{ users: Permission[]; totalUsers: number }>({
    queryKey: QueryKeys.trainings.permissions(trainingId),
    queryFn: async () => {
      const response = await http.get(`/training-admin/${trainingId}/permissions`);
      return response.data;
    },
    enabled: !!trainingId,
    staleTime: 60000,
  });
}

export function useUpdateTrainingPermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      trainingId, 
      data 
    }: { 
      trainingId: number; 
      data: AddPermissionData 
    }) => {
      const response = await http.patch(`/training-admin/permissions/${trainingId}`, data);
      return response.data;
    },
    onSuccess: (_, { trainingId }) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.trainings.permissions(trainingId),
      });
      queryClient.invalidateQueries({
        queryKey: ["permissions-stats"],
      });
      toast.success("Permissões do treinamento atualizadas com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar permissões do treinamento.");
    },
  });
}

// Module Permissions
export function useModulePermissions(moduleId: number) {
  return useQuery<Permission[]>({
    queryKey: QueryKeys.modules.permissions(moduleId),
    queryFn: async () => {
      const response = await http.get(`/training-modules-admin/${moduleId}/permissions`);
      return response.data;
    },
    enabled: !!moduleId,
    staleTime: 60000,
  });
}

export function useUpdateModulePermissions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      moduleId, 
      data 
    }: { 
      moduleId: number; 
      data: AddPermissionData 
    }) => {
      const response = await http.patch(`/training-modules-admin/permissions/${moduleId}`, data);
      return response.data;
    },
    onSuccess: (_, { moduleId }) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.modules.permissions(moduleId),
      });
      queryClient.invalidateQueries({
        queryKey: ["permissions-stats"],
      });
      toast.success("Permissões do módulo atualizadas com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar permissões do módulo.");
    },
  });
}

// Submodule Permissions
export function useSubmodulePermissions(submoduleId: number) {
  return useQuery<Permission[]>({
    queryKey: QueryKeys.submodules.permissions(submoduleId),
    queryFn: async () => {
      const response = await http.get(`/sub-modules-admin/${submoduleId}/permissions`);
      return response.data;
    },
    enabled: !!submoduleId,
    staleTime: 60000,
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
      data: AddPermissionData 
    }) => {
      const response = await http.patch(`/sub-modules-admin/permissions/${submoduleId}`, data);
      return response.data;
    },
    onSuccess: (_, { submoduleId }) => {
      queryClient.invalidateQueries({
        queryKey: QueryKeys.submodules.permissions(submoduleId),
      });
      queryClient.invalidateQueries({
        queryKey: ["permissions-stats"],
      });
      toast.success("Permissões do submódulo atualizadas com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar permissões do submódulo.");
    },
  });
}

// Global Permissions Stats
export function usePermissionsStats() {
  return useQuery<PermissionStats>({
    queryKey: ["permissions-stats"],
    queryFn: async () => {
      // Buscar dados do endpoint de estatísticas de permissões
      const response = await http.get("/training-admin/permissions-stats");
      
      return {
        totalUsers: response.data.totalUsers || 0,
        totalTrainings: response.data.totalTrainings || 0,
        totalModules: response.data.totalModules || 0,
        totalSubmodules: response.data.totalSubmodules || 0,
        totalPermissions: response.data.activePermissions || 0,
        recentChanges: response.data.recentChanges || 0,
      };
    },
    staleTime: 300000, // 5 minutes
  });
}

// Interface de usuário para busca
export interface SearchUser {
  id: number;
  fullName: string;
  email: string;
}

// Search users for permission management
export function useSearchUsers(search?: string) {
  return useQuery<SearchUser[]>({
    queryKey: ["users-search", search],
    queryFn: async () => {
      console.log('[DEBUG] Searching users with term:', search);

      const response = await http.get(`/autocomplete?fields=users`);
      console.log('[DEBUG] Autocomplete response:', response.data);
      
      const users = response.data.users || [];
      console.log('[DEBUG] Raw users from API:', users);
      
      // Map para garantir a estrutura correta
      const mappedUsers = users.map((user: {
        id: number; 
        firstName?: string;
        lastName?: string;
        email?: string;
      }) => {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
        const mappedUser = {
          id: user.id,
          fullName: fullName || 'Usuário sem nome',
          email: user.email || 'Sem email'
        };
        console.log('[DEBUG] Mapping user:', user, 'to:', mappedUser);
        return mappedUser;
      });
      
      console.log('[DEBUG] Mapped users:', mappedUsers);
      
      // Se não há termo de busca ou é muito curto, retorna todos
      if (!search || search.trim().length < 2) {
        console.log('[DEBUG] No search term, returning all users');
        return mappedUsers;
      }
      
      const filteredUsers = mappedUsers.filter((user: SearchUser) => 
        user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
      
      console.log('[DEBUG] Filtered users:', filteredUsers);
      return filteredUsers;
    },
    enabled: true, // Always enabled to show all users initially
    staleTime: 300000,
  });
}
