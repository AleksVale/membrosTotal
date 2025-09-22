"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { use, useMemo } from "react";
import { ModuleForm, ModuleFormData } from "../../components/ModuleForm";
import {
  useModule,
  useUpdateModule,
  useUploadModuleThumbnail,
} from "../../hooks/useModuleMutations";

interface EditModulePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditModulePage({ params }: EditModulePageProps) {
  const router = useRouter();
  const { id } = use(params);
  const moduleId = parseInt(id);

  console.log(
    "EditModulePage - ID from params:",
    id,
    "Parsed moduleId:",
    moduleId
  );

  if (isNaN(moduleId) || moduleId <= 0) {
    console.error("Invalid module ID:", id);
    notFound();
  }

  const { data: module, isLoading, isError } = useModule(moduleId);
  const updateModule = useUpdateModule();
  const uploadThumbnail = useUploadModuleThumbnail();

  const defaultValues = useMemo(() => {
    return module
      ? {
          title: module.title,
          description: module.description || "",
          trainingId: module.trainingId,
          order: module.order || 0,
          thumbnail: module.thumbnail,
        }
      : undefined;
  }, [module]);

  const handleSubmit = async (data: ModuleFormData, file?: File) => {
    try {
      // Primeiro atualizar o módulo
      await updateModule.mutateAsync({
        id: moduleId,
        data,
      });

      // Se tiver arquivo, fazer o upload
      if (file) {
        await uploadThumbnail.mutateAsync({
          moduleId,
          file,
        });
      }

      router.push("/admin/modules");
    } catch {
      // Error is handled by the mutation hooks
    }
  };

  const handleCancel = () => {
    router.push("/admin/modules");
  };

  if (isLoading) {
    return (
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Carregando...</h1>
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Erro ao carregar módulo</h1>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">
            Ocorreu um erro ao carregar os dados do módulo. Verifique se o ID é
            válido e tente novamente.
          </p>
          <Button onClick={() => router.push("/admin/modules")}>
            Voltar para lista de módulos
          </Button>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Módulo não encontrado</h1>
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            O módulo solicitado não foi encontrado.
          </p>
          <Button onClick={() => router.push("/admin/modules")}>
            Voltar para lista de módulos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">
        Editar Módulo{module?.title && `: ${module.title}`}
      </h1>
      <ModuleForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        defaultValues={defaultValues}
        isSubmitting={updateModule.isPending || uploadThumbnail.isPending}
        submitText="Atualizar Módulo"
      />
    </div>
  );
}
