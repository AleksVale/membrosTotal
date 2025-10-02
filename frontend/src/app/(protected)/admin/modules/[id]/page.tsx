"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getImageUrl } from "@/lib/image-utils";
import { ArrowLeft, Edit, Loader2 } from "lucide-react";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { use } from "react";
import { useModule } from "../hooks/useModuleMutations";

interface ModulePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ModulePage({ params }: ModulePageProps) {
  const router = useRouter();
  const { id } = use(params);
  const moduleId = parseInt(id);

  if (isNaN(moduleId)) {
    notFound();
  }

  const { data: module, isLoading, isError } = useModule(moduleId);

  if (isError) {
    notFound();
  }

  const handleEdit = () => {
    router.push(`/admin/modules/${moduleId}/edit`);
  };

  const handleBack = () => {
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

  if (!module) {
    notFound();
  }

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Detalhes do Módulo</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações principais */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
                <p className="text-muted-foreground">{module.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Ordem
                  </p>
                  <p className="text-lg">{module.order}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Treinamento
                  </p>
                  <p className="text-lg">
                    {module.training?.title || "Não definido"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Criado em
                  </p>
                  <p className="text-sm">
                    {new Date(module.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Atualizado em
                  </p>
                  <p className="text-sm">
                    {new Date(module.updatedAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Thumbnail */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thumbnail</CardTitle>
            </CardHeader>
            <CardContent>
              {module.thumbnail ? (
                <div className="relative aspect-video w-full">
                  <Image
                    src={getImageUrl(module.thumbnail) ?? ""}
                    alt={`Thumbnail do módulo ${module.title}`}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">
                    Nenhuma imagem
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">ID do Módulo</span>
                  <Badge variant="secondary">#{module.id}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">ID do Treinamento</span>
                  <Badge variant="outline">#{module.trainingId}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
