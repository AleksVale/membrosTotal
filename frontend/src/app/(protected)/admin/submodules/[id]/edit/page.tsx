"use client";

import http from "@/lib/http";
import { Loader2 } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { use, useMemo } from "react";
import {
  SubmoduleForm,
  SubmoduleFormData,
} from "../../components/SubmoduleForm";
import {
  useSubmodule,
  useUpdateSubmodule,
} from "../../hooks/useSubmoduleMutations";

interface EditSubmodulePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditSubmodulePage({ params }: EditSubmodulePageProps) {
  const router = useRouter();
  const { id } = use(params);
  const submoduleId = parseInt(id);

  if (isNaN(submoduleId)) {
    notFound();
  }

  const { data: submodule, isLoading, isError } = useSubmodule(submoduleId);
  const updateSubmodule = useUpdateSubmodule();

  const defaultValues = useMemo(() => {
    return submodule
      ? {
          title: submodule.title,
          description: submodule.description,
          moduleId: submodule.moduleId,
          order: submodule.order,
          thumbnail: submodule.thumbnail,
        }
      : undefined;
  }, [submodule]);

  if (isError) {
    notFound();
  }

  const handleSubmit = async (data: SubmoduleFormData, file?: File) => {
    try {
      // Primeiro atualizar o submódulo
      await updateSubmodule.mutateAsync({
        id: submoduleId,
        data,
      });

      // Se tiver arquivo, fazer o upload
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        await http.post(`/sub-modules-admin/${submoduleId}/file`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      router.push("/admin/submodules");
    } catch {
      // Error is handled by the mutation hook
    }
  };

  const handleCancel = () => {
    router.push("/admin/submodules");
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

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">
        Editar Submódulo{submodule?.title && `: ${submodule.title}`}
      </h1>
      <SubmoduleForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        defaultValues={defaultValues}
        isSubmitting={updateSubmodule.isPending}
        submitText="Atualizar Submódulo"
      />
    </div>
  );
}
