"use client";

import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { getImageUrl } from "@/lib/image-utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit, Eye, FileText, Trash2 } from "lucide-react";
import Image from "next/image";
import { DeleteModuleAlert } from "./DeleteModuleAlert";

interface Module {
  id: number;
  title: string;
  description: string;
  thumbnail?: string | null;
  order: number;
  trainingId: number;
  createdAt: string;
  updatedAt: string;
  submoduleCount?: number;
}

interface ModuleCardProps {
  module: Module;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => Promise<void>;
  onManageSubmodules?: (id: number) => void;
}

export function ModuleCard({
  module,
  onView,
  onEdit,
  onDelete,
  onManageSubmodules,
}: ModuleCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative aspect-video w-full">
        {module.thumbnail ? (
          <Image
            src={getImageUrl(module.thumbnail) as string}
            alt={module.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="bg-muted/30 h-full w-full flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Sem imagem</p>
          </div>
        )}
      </div>

      <CardHeader className="p-4 pb-0 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-lg line-clamp-2">{module.title}</h3>
          <div className="flex items-center gap-1">
            {onView && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onView(module.id)}
                title="Ver detalhes"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(module.id)}
                title="Editar"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onManageSubmodules && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onManageSubmodules(module.id)}
                title="Gerenciar Submódulos"
              >
                <FileText className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <DeleteModuleAlert moduleId={module.id} onDelete={onDelete} />
              </AlertDialog>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
          {module.description}
        </p>
      </CardHeader>

      <CardFooter className="p-4 pt-0">
        <div className="w-full flex flex-col gap-2 mt-auto">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {module.submoduleCount || 0} submódulo
              {module.submoduleCount !== 1 ? "s" : ""}
            </span>
            <span>Ordem: {module.order}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Atualizado em{" "}
            {format(new Date(module.updatedAt), "dd/MM/yyyy", { locale: ptBR })}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
