"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, MoreHorizontal, Trash, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Module {
  id: number;
  title: string;
  description: string;
  thumbnail?: string | null;
  order: number;
  trainingId: number;
  training?: {
    title: string;
  };
  createdAt: string;
  updatedAt: string;
  submoduleCount?: number;
}

interface ModuleListProps {
  modules: Module[];
  isLoading?: boolean;
  onDelete?: (id: number) => Promise<void>;
  onView?: (id: number, trainingId: number) => void;
  onEdit?: (id: number, trainingId: number) => void;
  onManageSubmodules?: (id: number, trainingId: number) => void;
}

export function ModuleList({
  modules,
  isLoading,
  onDelete,
  onView,
  onEdit,
  onManageSubmodules,
}: ModuleListProps) {
  const [moduleToDelete, setModuleToDelete] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const TABLE_COLUMN_COUNT = 7; // Número de colunas para uso com colSpan

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Ordem</TableHead>
            <TableHead>Título</TableHead>
            <TableHead className="hidden md:table-cell">Descrição</TableHead>
            <TableHead className="hidden md:table-cell">Treinamento</TableHead>
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
                  {module.training?.title || ""}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {module.submoduleCount || 0}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {format(new Date(module.createdAt), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {onView && (
                        <DropdownMenuItem
                          onClick={() => onView(module.id, module.trainingId)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>Ver detalhes</span>
                        </DropdownMenuItem>
                      )}

                      {onEdit && (
                        <DropdownMenuItem
                          onClick={() => onEdit(module.id, module.trainingId)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                      )}

                      {onManageSubmodules && (
                        <DropdownMenuItem
                          onClick={() =>
                            onManageSubmodules(module.id, module.trainingId)
                          }
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Gerenciar Submódulos</span>
                        </DropdownMenuItem>
                      )}

                      {onDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setModuleToDelete(module.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Excluir</span>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog
        open={!!moduleToDelete}
        onOpenChange={(open) => !open && setModuleToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir módulo</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este módulo? Esta ação não pode ser
              desfeita e também excluirá todos os submódulos e aulas
              relacionados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (moduleToDelete && onDelete) {
                  onDelete(moduleToDelete);
                  setModuleToDelete(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmar exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
