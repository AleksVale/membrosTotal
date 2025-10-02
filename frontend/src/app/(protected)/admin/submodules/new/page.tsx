"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

import http from "@/lib/http";
import { SubmoduleForm, SubmoduleFormData } from "../components/SubmoduleForm";
import { useCreateSubmodule } from "../hooks/useSubmoduleMutations";

function NewSubmodulePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = searchParams.get("moduleId")
    ? Number(searchParams.get("moduleId"))
    : undefined;
  const createSubmodule = useCreateSubmodule();

  // Memoize defaultValues to prevent object recreation on every render
  const defaultValues = useMemo(() => {
    return moduleId ? { moduleId } : undefined;
  }, [moduleId]);

  const handleSubmit = async (data: SubmoduleFormData, file?: File) => {
    try {
      // Primeiro criar o submódulo
      const result = await createSubmodule.mutateAsync(data);
      const submoduleId = result.id;

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

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Novo Submódulo</h1>
      <SubmoduleForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        defaultValues={defaultValues}
        isSubmitting={createSubmodule.isPending}
        submitText="Criar Submódulo"
      />
    </div>
  );
}

export default function NewSubmodulePageWrapper() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <NewSubmodulePage />
    </Suspense>
  );
}
