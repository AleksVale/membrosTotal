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
  useTrainingPermissions,
  useUpdateTrainingPermissions,
} from "../../hooks/usePermissions";

interface Training {
  id: number;
  title: string;
  description?: string;
  status: string;
}

export default function TrainingPermissionsPage() {
  const params = useParams();
  const router = useRouter();
  const trainingId = Number(params.id);

  const { data: training, isLoading: isLoadingTraining } = useQuery<Training>({
    queryKey: QueryKeys.trainings.detail(trainingId),
    queryFn: async () => {
      const response = await http.get(`/training-admin/${trainingId}`);
      return response.data;
    },
    enabled: !!trainingId && !isNaN(trainingId),
    staleTime: 60000,
  });

  const { data: permissions = [], isLoading: isLoadingPermissions } =
    useTrainingPermissions(trainingId);
  const updatePermissions = useUpdateTrainingPermissions();

  const handleUpdatePermissions = async (data: {
    addedUsers?: number[];
    removedUsers?: number[];
    addRelatives?: boolean;
  }) => {
    await updatePermissions.mutateAsync({
      trainingId,
      data,
    });
  };

  if (isLoadingTraining) {
    return (
      <div className="flex flex-col items-center justify-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-2 text-sm text-muted-foreground">
          Carregando treinamento...
        </p>
      </div>
    );
  }

  if (!training) {
    return (
      <div className="flex flex-col items-center justify-center h-48">
        <p className="text-muted-foreground">Treinamento não encontrado</p>
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
            Permissões - {training.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Controle quais usuários têm acesso a este treinamento e suas
            entidades relacionadas.
          </p>
        </CardHeader>
        <CardContent>
          <PermissionManager
            title={training.title}
            description={training.description || ""}
            permissions={permissions}
            isLoading={isLoadingPermissions}
            onUpdatePermissions={handleUpdatePermissions}
            isUpdating={updatePermissions.isPending}
            entityType="training"
          />
        </CardContent>
      </Card>
    </div>
  );
}
