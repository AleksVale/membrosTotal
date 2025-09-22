"use client";

import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getImageUrl } from "@/lib/image-utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Edit,
  Eye,
  FileText,
  Loader2,
  MoreVertical,
  Trash,
} from "lucide-react";
import Image from "next/image";
import { DeleteSubmoduleAlert } from "./DeleteSubmoduleAlert";

interface Submodule {
  id: number;
  title: string;
  description: string;
  thumbnail?: string | null;
  order: number;
  moduleId: number;
  module: {
    id: number;
    title: string;
    trainingId: number;
    training?: {
      title: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  lessonCount?: number;
}

interface SubmoduleCardProps {
  submodule: Submodule;
  isDeletingId: number | null;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => Promise<void>;
  onManageLessons?: (id: number) => void;
}

export function SubmoduleCard({
  submodule,
  isDeletingId,
  onView,
  onEdit,
  onDelete,
  onManageLessons,
}: SubmoduleCardProps) {
  const isDeleting = isDeletingId === submodule.id;

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative aspect-video w-full">
        {submodule.thumbnail ? (
          <Image
            src={getImageUrl(submodule.thumbnail) as string}
            alt={submodule.title}
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
          <h3 className="font-medium text-lg line-clamp-2">
            {submodule.title}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreVertical className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(submodule.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  <span>Ver detalhes</span>
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(submodule.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Editar</span>
                </DropdownMenuItem>
              )}

              {onManageLessons && (
                <DropdownMenuItem onClick={() => onManageLessons(submodule.id)}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Gerenciar Aulas</span>
                </DropdownMenuItem>
              )}

              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Excluir</span>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <DeleteSubmoduleAlert
                      submoduleId={submodule.id}
                      onDelete={onDelete}
                    />
                  </AlertDialog>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
          {submodule.description}
        </p>
        <div className="text-xs text-muted-foreground mt-2">
          <span className="font-medium">Módulo:</span> {submodule.module.title}
        </div>
        {submodule.module.training && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Treinamento:</span>{" "}
            {submodule.module.training.title}
          </div>
        )}
      </CardHeader>

      <CardFooter className="p-4 pt-0">
        <div className="w-full flex flex-col gap-2 mt-auto">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {submodule.lessonCount || 0} aula
              {submodule.lessonCount !== 1 ? "s" : ""}
            </span>
            <span>Ordem: {submodule.order}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Atualizado em{" "}
            {format(new Date(submodule.updatedAt), "dd/MM/yyyy", {
              locale: ptBR,
            })}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
