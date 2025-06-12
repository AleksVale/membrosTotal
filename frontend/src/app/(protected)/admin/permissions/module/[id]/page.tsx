"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Shield } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import http from "@/lib/http";
import { QueryKeys } from "@/shared/constants/queryKeys";
import { PermissionManager } from "../../components/PermissionManager";
import {
  useModulePermissions,
  useUpdateModulePermissions,
} from "../../hooks/usePermissions";

interface Module {
  id: number;
  title: string;
  description?: string;
  training: {
    id: number;
    title: string;
  };
}

export default function ModulePermissionsPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = Number(params.id);

  const { data: module, isLoading: isLoadingModule } = useQuery<Module>({
    queryKey: QueryKeys.modules.detail(moduleId),
    queryFn: async () => {
      const response = await http.get(`/training-modules-admin/${moduleId}`);
      return response.data;
    },
    enabled: !!moduleId && !isNaN(moduleId),
    staleTime: 60000,
  });

  const { data: permissions = [], isLoading: isLoadingPermissions } =
    useModulePermissions(moduleId);
  const updatePermissions = useUpdateModulePermissions();

  const handleUpdatePermissions = async (data: {
    addedUsers?: number[];
    removedUsers?: number[];
    addRelatives?: boolean;
  }) => {
    await updatePermissions.mutateAsync({
      moduleId,
      data,
    });
  };

  if (isLoadingModule) {
    return (
      <div className="flex flex-col items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">
          Carregando módulo...
        </p>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="flex flex-col items-center justify-center h-48">
        <p className="text-muted-foreground">Módulo não encontrado</p>
        <Button
          variant="link"
          onClick={() => router.push("/admin/permissions")}
          className="mt-2"
        >
          Voltar para Permissões
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/permissions")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Gerenciar Permissões</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permissões - {module.title}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            <p>Treinamento: {module.training.title}</p>
            <p className="mt-1">
              {module.description ||
                "Controle quais usuários têm acesso a este módulo e suas entidades relacionadas."}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <PermissionManager
            title={module.title}
            description={module.description || ""}
            permissions={permissions}
            isLoading={isLoadingPermissions}
            onUpdatePermissions={handleUpdatePermissions}
            isUpdating={updatePermissions.isPending}
            entityType="module"
          />
        </CardContent>
      </Card>
    </div>
  );
}
