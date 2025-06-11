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
  return useQuery<Permission[]>({
    queryKey: QueryKeys.trainings.permissions(trainingId),
    queryFn: async () => {
      const response = await http.get(`/trainings-admin/${trainingId}/permissions`);
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
      const response = await http.patch(`/trainings-admin/permissions/${trainingId}`, data);
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
      // Vamos buscar dados de várias APIs para montar as estatísticas
      const [trainingsRes, usersRes] = await Promise.all([
        http.get("/trainings-admin?per_page=1"),
        http.get("/autocomplete?fields=users"),
      ]);

      return {
        totalUsers: usersRes.data.users?.length || 0,
        totalTrainings: trainingsRes.data.meta?.total || 0,
        totalModules: 0, // Seria implementado no backend
        totalSubmodules: 0, // Seria implementado no backend
        totalPermissions: 0, // Seria implementado no backend
        recentChanges: 0, // Seria implementado no backend
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
      const response = await http.get(`/autocomplete?fields=users`);
      const users = response.data.users || [];
      
      // Map para garantir a estrutura correta
      const mappedUsers = users.map((user: {
        id: number; 
        name?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
      }) => ({
        id: user.id,
        fullName: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || ''
      }));
      
      if (search) {
        return mappedUsers.filter((user: SearchUser) => 
          user.fullName.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      return mappedUsers;
    },
    enabled: !!search || search === "",
    staleTime: 300000,
  });
}
