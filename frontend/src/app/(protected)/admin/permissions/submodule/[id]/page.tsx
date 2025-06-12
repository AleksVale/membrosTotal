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
  useSubmodulePermissions,
  useUpdateSubmodulePermissions,
} from "../../hooks/usePermissions";

interface Submodule {
  id: number;
  title: string;
  description?: string;
  module: {
    id: number;
    title: string;
    training: {
      id: number;
      title: string;
    };
  };
}

export default function SubmodulePermissionsPage() {
  const params = useParams();
  const router = useRouter();
  const submoduleId = Number(params.id);

  const { data: submodule, isLoading: isLoadingSubmodule } =
    useQuery<Submodule>({
      queryKey: QueryKeys.submodules.detail(submoduleId),
      queryFn: async () => {
        const response = await http.get(`/sub-modules-admin/${submoduleId}`);
        return response.data;
      },
      enabled: !!submoduleId && !isNaN(submoduleId),
      staleTime: 60000,
    });

  const { data: permissions = [], isLoading: isLoadingPermissions } =
    useSubmodulePermissions(submoduleId);
  const updatePermissions = useUpdateSubmodulePermissions();

  const handleUpdatePermissions = async (data: {
    addedUsers?: number[];
    removedUsers?: number[];
    addRelatives?: boolean;
  }) => {
    await updatePermissions.mutateAsync({
      submoduleId,
      data,
    });
  };

  if (isLoadingSubmodule) {
    return (
      <div className="flex flex-col items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">
          Carregando submódulo...
        </p>
      </div>
    );
  }

  if (!submodule) {
    return (
      <div className="flex flex-col items-center justify-center h-48">
        <p className="text-muted-foreground">Submódulo não encontrado</p>
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
            Permissões - {submodule.title}
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            <p>
              Treinamento: {submodule.module.training.title} &rarr; Módulo:{" "}
              {submodule.module.title}
            </p>
            <p className="mt-1">
              {submodule.description ||
                "Controle quais usuários têm acesso a este submódulo e suas entidades relacionadas."}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <PermissionManager
            title={submodule.title}
            description={submodule.description || ""}
            permissions={permissions}
            isLoading={isLoadingPermissions}
            onUpdatePermissions={handleUpdatePermissions}
            isUpdating={updatePermissions.isPending}
            entityType="submodule"
          />
        </CardContent>
      </Card>
    </div>
  );
}
