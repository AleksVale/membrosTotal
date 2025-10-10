"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Edit, Eye, FileText, Lock, Trash2 } from "lucide-react";

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

interface ModuleListProps {
  modules: Module[];
  trainingId: number;
  isLoading?: boolean;
  onDelete?: (id: number) => Promise<void>;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
}

export function ModuleList({
  modules,
  trainingId,
  isLoading,
  onDelete,
  onView,
  onEdit,
}: ModuleListProps) {
  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const TABLE_COLUMN_COUNT = 6; // Atualizado para refletir a remoção da coluna de status

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Ordem</TableHead>
            <TableHead>Título</TableHead>
            <TableHead className="hidden md:table-cell">Descrição</TableHead>
            <TableHead className="hidden md:table-cell">Submódulos</TableHead>
            <TableHead className="hidden lg:table-cell">Criado em</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {modules.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={TABLE_COLUMN_COUNT}
                className="text-center py-6"
              >
                Nenhum módulo encontrado
              </TableCell>
            </TableRow>
          ) : (
            modules.map((module) => (
              <TableRow key={module.id}>
                <TableCell className="font-medium">{module.order}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{module.title}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {module.description}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {module.submoduleCount ? (
                    <Badge variant="secondary">{module.submoduleCount}</Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      Nenhum
                    </span>
                  )}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {format(new Date(module.createdAt), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        (window.location.href = `/admin/trainings/${trainingId}/modules/${module.id}/submodules`)
                      }
                      title="Submódulos"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        (window.location.href = `/admin/trainings/${trainingId}/modules/${module.id}/permissions`)
                      }
                      title="Permissões"
                    >
                      <Lock className="h-4 w-4" />
                    </Button>
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
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir módulo</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir este módulo? Esta
                              ação não pode ser desfeita e também excluirá todos
                              os submódulos e aulas relacionados.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(module.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Confirmar exclusão
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
